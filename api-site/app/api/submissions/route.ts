import { env } from "cloudflare:workers";
import { and, count, eq, gt } from "drizzle-orm";
import { getDb } from "../../../db";
import { submissions } from "../../../db/schema";
import { allowedOrigin, cors, normalizeSubmission } from "../../../lib/submission";

export const runtime = "edge";

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return new Response(null, { status: allowedOrigin(origin) ? 204 : 403, headers: cors(origin) });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const headers = cors(origin);
  const fail = (message: string, status: number) => Response.json({ error: message }, { status, headers });
  if (!allowedOrigin(origin)) return fail("请从地图投稿页面提交", 403);
  if (Number(request.headers.get("content-length") || 0) > 6_000_000) return fail("图片过大，请选择 5 MB 以下的文件", 413);
  try {
    const form = await request.formData();
    if (form.get("website")) return fail("投稿未通过检查", 400);
    const raw = String(form.get("payload") || "");
    if (raw.length > 10000) return fail("投稿内容过长", 413);
    const payload = normalizeSubmission(JSON.parse(raw));
    const image = form.get("image");
    const file = image instanceof File && image.size ? image : null;
    if (file && (file.size > 5_000_000 || !["image/jpeg", "image/png", "image/webp"].includes(file.type))) return fail("图片仅支持 JPG、PNG、WebP，最大 5 MB", 400);
    if (file && (!payload.rightsConfirmed || !payload.imageCredit)) return fail("请确认图片展示许可并填写署名", 400);
    const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
    const salt = env.KDRAMA_RATE_SALT || "kdrama-fallback";
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${ip}`));
    const ipHash = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
    const db = getDb();
    const hourAgo = new Date(Date.now() - 3600000).toISOString();
    const [recent] = await db.select({ total: count() }).from(submissions).where(and(eq(submissions.ipHash, ipHash), gt(submissions.createdAt, hourAgo)));
    if ((recent?.total || 0) >= 5) return fail("提交太频繁，请稍后再试", 429);
    const id = crypto.randomUUID();
    const imageKey = file ? `pending/${id}` : null;
    if (file) {
      if (!env.BUCKET) throw new Error("Image storage unavailable");
      await env.BUCKET.put(imageKey!, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
    }
    await db.insert(submissions).values({ id, kind: payload.kind, payload: JSON.stringify(payload), status: "pending",
      createdAt: new Date().toISOString(), ipHash, imageKey, imageType: file?.type || null });
    return Response.json({ id, status: "pending" }, { status: 201, headers });
  } catch (error) {
    if (error instanceof SyntaxError) return fail("投稿内容格式不正确", 400);
    if (error instanceof Error && !/unavailable/i.test(error.message)) {
      if (error.message.includes("请") || error.message.includes("来源") || error.message.includes("投稿") || error.message.includes("更正") || error.message.includes("集数")) return fail(error.message, 400);
    }
    console.error("Submission failed", error);
    return fail("提交暂时失败，请稍后重试", 500);
  }
}
