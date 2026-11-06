import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getChatGPTUser } from "../../../../chatgpt-auth";
import { getDb } from "../../../../../db";
import { submissions } from "../../../../../db/schema";

export const runtime = "edge";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getChatGPTUser();
  const owner = user && ((env.KDRAMA_ADMIN_ID && user.userId === env.KDRAMA_ADMIN_ID) ||
    (env.KDRAMA_ADMIN_EMAIL && user.email.toLowerCase() === env.KDRAMA_ADMIN_EMAIL.toLowerCase()));
  if (!owner) return new Response("Forbidden", { status: 403 });
  const { id } = await context.params;
  if (!/^[a-f0-9-]{36}$/.test(id)) return new Response("Not found", { status: 404 });
  const [row] = await getDb().select().from(submissions).where(eq(submissions.id, id)).limit(1);
  if (!row?.imageKey || !env.BUCKET) return new Response("Not found", { status: 404 });
  const object = await env.BUCKET.get(row.imageKey);
  if (!object) return new Response("Not found", { status: 404 });
  return new Response(object.body, { headers: { "Content-Type": row.imageType || "application/octet-stream",
    "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}
