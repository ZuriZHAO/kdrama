import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { submissions } from "../../../../db/schema";

export const runtime = "edge";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!/^[a-f0-9-]{36}$/.test(id)) return new Response("Not found", { status: 404 });
  const [row] = await getDb().select().from(submissions).where(eq(submissions.id, id)).limit(1);
  if (!row || row.status !== "approved" || !row.posterKey || !env.BUCKET) return new Response("Not found", { status: 404 });
  const object = await env.BUCKET.get(row.posterKey);
  if (!object) return new Response("Not found", { status: 404 });
  return new Response(object.body, { headers: { "Content-Type": row.posterType || "application/octet-stream",
    "Cache-Control": "public, max-age=3600", "X-Content-Type-Options": "nosniff" } });
}
