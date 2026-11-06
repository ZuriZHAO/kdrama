import { env } from "cloudflare:workers";
import { desc, eq } from "drizzle-orm";
import { getChatGPTUser } from "../../../chatgpt-auth";
import { getDb } from "../../../../db";
import { submissions } from "../../../../db/schema";
import { normalizeSubmission } from "../../../../lib/submission";

export const runtime = "edge";

async function authorized() {
  const user = await getChatGPTUser();
  return !!user && !!((env.KDRAMA_ADMIN_ID && user.userId === env.KDRAMA_ADMIN_ID) ||
    (env.KDRAMA_ADMIN_EMAIL && user.email.toLowerCase() === env.KDRAMA_ADMIN_EMAIL.toLowerCase()));
}

export async function GET() {
  if (!await authorized()) return Response.json({ error: "无权访问" }, { status: 403 });
  const rows = await getDb().select({ id: submissions.id, kind: submissions.kind, payload: submissions.payload,
    status: submissions.status, createdAt: submissions.createdAt, imageKey: submissions.imageKey })
    .from(submissions).orderBy(desc(submissions.createdAt)).limit(100);
  return Response.json({ submissions: rows.map(row => ({ ...row, payload: JSON.parse(row.payload), hasImage: !!row.imageKey, imageKey: undefined })) },
    { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!await authorized()) return Response.json({ error: "无权访问" }, { status: 403 });
  if (request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ error: "来源不正确" }, { status: 403 });
  try {
    const body = await request.json() as { id?: string; status?: string; payload?: unknown };
    if (!body.id || !["approved", "rejected"].includes(body.status || "")) return Response.json({ error: "审核操作不正确" }, { status: 400 });
    const [row] = await getDb().select().from(submissions).where(eq(submissions.id, body.id)).limit(1);
    if (!row || row.status !== "pending") return Response.json({ error: "投稿不存在或已审核" }, { status: 409 });
    const payload = normalizeSubmission(body.payload ?? JSON.parse(row.payload), body.status === "approved");
    await getDb().update(submissions).set({ status: body.status, payload: JSON.stringify(payload), reviewedAt: new Date().toISOString() })
      .where(eq(submissions.id, row.id));
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "审核失败" }, { status: 400 });
  }
}
