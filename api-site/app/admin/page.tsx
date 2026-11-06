import { env } from "cloudflare:workers";
import { requireChatGPTUser } from "../chatgpt-auth";
import AdminClient from "./review-client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  const owner = (env.KDRAMA_ADMIN_ID && user.userId === env.KDRAMA_ADMIN_ID) ||
    (env.KDRAMA_ADMIN_EMAIL && user.email.toLowerCase() === env.KDRAMA_ADMIN_EMAIL.toLowerCase());
  if (!owner) return <main style={{ padding: 32 }}>无权查看投稿审核页。</main>;
  return <main style={{ maxWidth: 980, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif", color: "#263a37" }}>
    <h1>剧场之外 · 投稿审核</h1>
    <p>核对取景关系、坐标和图片许可。可以直接修改 JSON，确认后再批准。批准的投稿会自动出现在公开地图。</p>
    <AdminClient />
  </main>;
}
