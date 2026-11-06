import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { submissions } from "../../../db/schema";
import { cors } from "../../../lib/submission";

export const runtime = "edge";

export async function GET(request: Request) {
  const headers = { ...cors(request.headers.get("origin")), "Cache-Control": "public, max-age=60" };
  try {
    const rows = await getDb().select().from(submissions).where(eq(submissions.status, "approved"));
    const result = { works: [] as Record<string, unknown>[], landmarks: [] as Record<string, unknown>[],
      scenes: [] as Record<string, unknown>[], sources: [] as Record<string, unknown>[], corrections: [] as Record<string, unknown>[] };
    const origin = new URL(request.url).origin;
    for (const row of rows) {
      const p = JSON.parse(row.payload) as Record<string, any>;
      const sourceId = p.sourceUrl ? `submission-source-${row.id}` : null;
      if (sourceId) result.sources.push({ id: sourceId, title: p.sourceTitle || "投稿来源", url: p.sourceUrl });
      const image = row.imageKey ? `${origin}/api/images/${row.id}` : null;
      if (row.kind === "place") {
        let workId = p.workId;
        if (p.newWork) {
          workId = `submission-work-${row.id}`;
          result.works.push({ id: workId, title: p.newWork.title, original: p.newWork.original, year: "", color: "#698b85" });
        }
        const landmarkId = `submission-place-${row.id}`;
        result.landmarks.push({ id: landmarkId, workId, name: p.name, ko: p.ko || "", city: p.city || "",
          lat: p.lat, lng: p.lng, coordinateStatus: "approximate", verifiedAt: row.reviewedAt?.slice(0, 10) || null,
          entrance: null, coordinateSourceId: null, coordinateNote: "投稿坐标，尚未核实具体拍摄机位。",
          address: p.address || "", query: p.ko || p.name, kind: "other", sourceId, visit: p.visit || "" });
        result.scenes.push({ id: `submission-scene-${row.id}`, landmarkId, description: p.description,
          episode: p.episode, timeSeconds: p.timeSeconds, image, imageCredit: p.imageCredit || "", sourceId });
      } else if (row.kind === "update") {
        if (p.description || image) result.scenes.push({ id: `submission-scene-${row.id}`, landmarkId: p.landmarkId,
          description: p.description || "", episode: p.episode, timeSeconds: p.timeSeconds,
          image, imageCredit: p.imageCredit || "", sourceId });
        if (p.changes && Object.keys(p.changes).length) result.corrections.push({ landmarkId: p.landmarkId, changes: p.changes, sourceId });
      } else if (row.kind === "scene") {
        result.scenes.push({ id: `submission-scene-${row.id}`, landmarkId: p.landmarkId, description: p.description,
          episode: p.episode, timeSeconds: p.timeSeconds, image, imageCredit: p.imageCredit || "", sourceId });
      } else if (row.kind === "correction") {
        result.corrections.push({ landmarkId: p.landmarkId, changes: p.changes, sourceId });
      }
    }
    return Response.json(result, { headers });
  } catch (error) {
    console.error("Catalog failed", error);
    return Response.json({ error: "目录暂时不可用" }, { status: 503, headers });
  }
}
