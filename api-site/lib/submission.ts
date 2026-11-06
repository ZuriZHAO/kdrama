export type Submission = Record<string, unknown> & { kind: "place" | "scene" | "correction" };

const string = (value: unknown, max = 800) => typeof value === "string" ? value.trim().slice(0, max) : "";
const url = (value: unknown) => {
  const raw = string(value, 1000);
  if (!raw) return "";
  try {
    const parsed = new URL(raw);
    return parsed.protocol === "https:" && !parsed.username && !parsed.password ? parsed.href : "";
  } catch { return ""; }
};
const optionalInt = (value: unknown, max: number) => {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0 || n > max) throw new Error("集数或时间点格式不正确");
  return n;
};

export function normalizeSubmission(input: unknown, approval = false): Submission {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("投稿格式不正确");
  const p = input as Record<string, unknown>;
  if (!["place", "scene", "correction"].includes(String(p.kind))) throw new Error("投稿类型不正确");
  const kind = p.kind as Submission["kind"];
  const sourceTitle = string(p.sourceTitle, 160);
  const sourceUrl = url(p.sourceUrl);
  if (p.sourceUrl && !sourceUrl) throw new Error("来源链接需使用 HTTPS");
  if (approval && (!sourceTitle || !sourceUrl)) throw new Error("发布前需要补充来源名称和链接");
  const base = { kind, sourceTitle, sourceUrl, contributor: string(p.contributor, 80) };
  if (kind === "place") {
    const workId = string(p.workId, 100);
    const name = string(p.name, 120);
    const description = string(p.description, 800);
    const lat = Number(p.lat), lng = Number(p.lng);
    if (!workId || !name || !description) throw new Error("请选择作品并填写地点与场景");
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < 33 || lat > 39 || lng < 124 || lng > 132) throw new Error("请填写韩国境内的地图坐标");
    const newWork = workId === "new" ? {
      title: string((p.newWork as Record<string, unknown> | undefined)?.title, 120),
      original: string((p.newWork as Record<string, unknown> | undefined)?.original, 120)
    } : null;
    if (newWork && (!newWork.title || !newWork.original)) throw new Error("请填写新作品的中文名和韩文名");
    const imageCredit = string(p.imageCredit, 160);
    return { ...base, workId, newWork, name, ko: string(p.ko, 120), city: string(p.city, 100), lat, lng,
      address: string(p.address, 240), visit: string(p.visit, 500), description,
      episode: optionalInt(p.episode, 1000), timeSeconds: optionalInt(p.timeSeconds, 100000),
      imageCredit, rightsConfirmed: p.rightsConfirmed === true };
  }
  const landmarkId = string(p.landmarkId, 120);
  if (!landmarkId) throw new Error("请选择已有地点");
  if (kind === "scene") {
    const description = string(p.description, 800);
    if (!description) throw new Error("请填写场景描述");
    return { ...base, landmarkId, description, episode: optionalInt(p.episode, 1000),
      timeSeconds: optionalInt(p.timeSeconds, 100000), imageCredit: string(p.imageCredit, 160),
      rightsConfirmed: p.rightsConfirmed === true };
  }
  const reason = string(p.reason, 800);
  if (!reason) throw new Error("请说明需要纠正的内容");
  const rawChanges = p.changes && typeof p.changes === "object" && !Array.isArray(p.changes) ? p.changes as Record<string, unknown> : {};
  const changes: Record<string, unknown> = {};
  for (const key of ["name", "ko", "city", "address", "visit"]) if (key in rawChanges) changes[key] = string(rawChanges[key], 500);
  for (const key of ["lat", "lng"]) if (key in rawChanges) {
    const n = Number(rawChanges[key]);
    if (!Number.isFinite(n) || n < (key === "lat" ? 33 : 124) || n > (key === "lat" ? 39 : 132)) throw new Error("更正坐标超出韩国范围");
    changes[key] = n;
  }
  if (!Object.keys(changes).length) throw new Error("请填写至少一项更正内容");
  return { ...base, landmarkId, reason, changes };
}

export const allowedOrigin = (origin: string | null) =>
  origin === "https://kdrama-map-zuri.insightfullemon.chatgpt.site" ||
  origin === "https://zurizhao.github.io" ||
  origin === "http://localhost:8000" || origin === "http://127.0.0.1:8000";

export function cors(origin: string | null) {
  return { "Access-Control-Allow-Origin": allowedOrigin(origin) ? origin! : "null",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin", "Cache-Control": "no-store" };
}
