"use client";

import { useEffect, useState } from "react";

type Row = { id: string; kind: string; payload: Record<string, unknown>; status: string; createdAt: string; hasImage: boolean };

export default function AdminClient() {
  const [rows, setRows] = useState<Row[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("正在读取投稿…");
  async function reload() {
    const response = await fetch("/api/admin/submissions", { cache: "no-store" });
    if (!response.ok) { setMessage("读取失败，请重新登录后刷新。"); return; }
    const data = await response.json() as { submissions: Row[] };
    setRows(data.submissions.filter(row => row.status === "pending"));
    setEdits(Object.fromEntries(data.submissions.map(row => [row.id, JSON.stringify(row.payload, null, 2)])));
    setMessage(data.submissions.filter(row => row.status === "pending").length ? "" : "暂无待审核投稿。");
  }
  useEffect(() => { void reload(); }, []);
  async function review(row: Row, status: "approved" | "rejected") {
    try {
      const payload = JSON.parse(edits[row.id]);
      if (status === "approved" && !window.confirm("确认已核对取景来源、坐标及图片许可，并批准公开展示？")) return;
      const response = await fetch("/api/admin/submissions", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, status, payload }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "审核失败");
      setMessage(status === "approved" ? "已批准，公开地图约一分钟内更新。" : "已驳回。");
      await reload();
    } catch (error) { setMessage(error instanceof Error ? error.message : "审核失败"); }
  }
  return <><p role="status">{message}</p>{rows.map(row => <section key={row.id} style={{ background: "white", border: "1px solid #d9e3de", borderRadius: 12, padding: 18, margin: "16px 0" }}>
    <h2 style={{ margin: "0 0 8px" }}>{row.kind === "place" ? "新增地点" : row.kind === "scene" ? "补充场景" : "纠正资料"} · {String(row.payload.name || row.payload.landmarkId || "")}</h2>
    <p style={{ fontSize: 13, color: "#657a73" }}>提交时间 {new Date(row.createdAt).toLocaleString("zh-CN")} · {row.hasImage ? "含图片" : "无图片"}</p>
    {row.hasImage && <img src={`/api/admin/images/${row.id}`} alt="投稿图片，审核前请核对展示许可" style={{ maxWidth: "100%", maxHeight: 300, objectFit: "contain", display: "block", margin: "12px 0" }} />}
    <label>投稿资料 JSON<textarea value={edits[row.id] || ""} onChange={event => setEdits({ ...edits, [row.id]: event.target.value })}
      style={{ display: "block", width: "100%", minHeight: 260, marginTop: 8, fontFamily: "monospace", fontSize: 13 }} /></label>
    <div style={{ display: "flex", gap: 10, marginTop: 12 }}><button onClick={() => void review(row, "approved")}>核对后批准</button><button onClick={() => void review(row, "rejected")}>驳回</button></div>
  </section>)}</>;
}
