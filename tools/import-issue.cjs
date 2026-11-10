const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createHash } = require('node:crypto');
const { parseIssue, validateSubmission } = require('../submission-core.js');

const [issueFile, issueNumber, catalogFile = path.join(__dirname, '..', 'data', 'catalog.js')] = process.argv.slice(2);
if (!issueFile || !/^\d+$/.test(issueNumber || '')) {
  console.error('用法：node tools/import-issue.cjs <issue正文文件> <Issue编号> [目录文件]');
  process.exit(1);
}

const body = fs.readFileSync(issueFile, 'utf8');
const { payload } = parseIssue(body);
const bodyHash = createHash('sha256').update(body, 'utf8').digest('hex');

const context = { window: {} };
vm.runInNewContext(fs.readFileSync(catalogFile, 'utf8'), context);
let catalog = context.window.KDRAMA_CATALOG;
if (!catalog || !['works', 'landmarks', 'scenes', 'sources'].every(key => Array.isArray(catalog[key]))) throw new Error('公开目录结构无效');

const id = suffix => `issue-${issueNumber}-${suffix}`;
catalog.revisions ||= [];
if (!Array.isArray(catalog.revisions)) throw new Error('更正记录结构无效');
catalog.updates ||= [];
if (!Array.isArray(catalog.updates)) throw new Error('更新记录结构无效');
if (catalog.updates.some(item => Number(item.issueNumber) === Number(issueNumber)) || catalog.works.some(item => item.id === id('work')) || catalog.landmarks.some(item => item.id === id('place')) || catalog.scenes.some(item => item.id === id('scene')) || catalog.revisions.some(item => item.id === id('correction'))) {
  const previous = catalog.updates.find(item => Number(item.issueNumber) === Number(issueNumber));
  if (!previous?.bodyHash || previous.bodyHash !== bodyHash) throw new Error('此 Issue 已导入，正文与导入版本无法确认一致；后续修改请新建补充／更正投稿。');
  console.log(`Issue #${issueNumber} 已导入，跳过`);
  process.exit(0);
}
const checked = validateSubmission(payload, body, catalog);
const clean = (value, label, max, required = true) => {
  if (value == null && !required) return null;
  if (typeof value !== 'string') throw new Error(`${label}必须是文字`);
  const result = value.trim();
  if ((required && !result) || result.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(result)) throw new Error(`${label}无效`);
  return result || null;
};
const https = (value, label, required = true) => {
  const result = clean(value, label, 1000, required);
  if (result == null) return '';
  try { if (new URL(result).protocol !== 'https:') throw new Error(); } catch { throw new Error(`${label}必须是 HTTPS 链接`); }
  return result;
};
const number = (value, label, min, max) => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw new Error(`${label}无效`);
  return value;
};
const optionalInt = (value, label, min, max) => {
  if (value == null) return null;
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${label}无效`);
  return value;
};
const workType = value => {
  if (value == null || value === '') return 'drama';
  if (!['drama', 'movie', 'variety'].includes(value)) throw new Error('作品类型无效');
  return value;
};
const findSource = (title, link) => {
  if (!link) return null;
  const old = catalog.sources.find(source => source.url === link);
  if (old) return old.id;
  const sourceId = id('source');
  catalog.sources.push({ id: sourceId, title: title || link, url: link });
  return sourceId;
};
const uniqueWork = title => !catalog.works.some(work => work.title.trim().toLocaleLowerCase() === title.trim().toLocaleLowerCase());

function sceneImage() {
  return { url: checked.imageUrl || null, credit: checked.imageUrl ? clean(payload.imageCredit, '图片署名', 160, false) || '' : null };
}

function appendScenes(landmarkId,sourceId) {
  const records=checked.sceneRecords || [{description:payload.description||'',episode:payload.episode??null,timeSeconds:payload.timeSeconds??null,imageUrl:checked.imageUrl||null,imageCredit:payload.imageCredit||''}];
  records.forEach((scene,index)=>catalog.scenes.push({id:id(index?'scene-'+(index+1):'scene'),landmarkId,description:scene.description,episode:scene.episode,timeSeconds:scene.timeSeconds,image:scene.imageUrl||null,imageCredit:scene.imageCredit||null,sourceId,episodeSourceId:scene.episode==null?null:sourceId,...(scene.crop?{crop:scene.crop}:{})}));
}

function posterImage() {
  return checked.posterUrl || null;
}

function applyCorrection(landmarkId, reason, sourceId) {
  const place = catalog.landmarks.find(item => item.id === landmarkId);
  if (!place) throw new Error('所属地点不存在');
  const changes = payload.changes;
  if (!changes || typeof changes !== 'object' || Array.isArray(changes)) throw new Error('更正内容无效');
  const allowed = ['name', 'group', 'ko', 'city', 'address', 'visit', 'lat', 'lng'];
  const keys = Object.keys(changes);
  if (!keys.length || keys.some(key => !allowed.includes(key))) throw new Error('更正字段无效');
  const next = {};
  for (const [key, max] of Object.entries({ name: 120, group: 100, ko: 120, city: 100, address: 240, visit: 500 })) {
    if (Object.hasOwn(changes, key)) next[key] = clean(changes[key], key, max, key === 'name') || '';
  }
  if (('lat' in changes) !== ('lng' in changes)) throw new Error('更正坐标必须同时提供经纬度');
  if ('lat' in changes) {
    next.lat = number(changes.lat, '纬度', -90, 90);
    next.lng = number(changes.lng, '经度', -180, 180);
  }
  if (!Object.keys(next).some(key => next[key] !== place[key])) throw new Error('更正内容与现有资料相同');
  Object.assign(place, next);
  if ('lat' in next) {
    place.coordinateStatus = 'approximate';
    place.verifiedAt = null;
    place.entrance = null;
    place.coordinateSourceId = sourceId;
    place.coordinateNote = `Issue #${issueNumber} 更正坐标；拍摄机位仍待独立核实。`;
  }
  if ('ko' in next || 'name' in next) place.query = place.ko || place.name;
  catalog.revisions.push({ id: id('correction'), landmarkId, changes: next, reason, sourceId, date: new Date().toISOString().slice(0, 10) });
}

if (payload.kind === 'maintenance') {
  catalog = checked.maintenance.catalog;
  catalog.maintenanceLog ||= [];
  catalog.maintenanceLog.push({ issueNumber: Number(issueNumber), date: new Date().toISOString(), changes: checked.maintenance.changes });
} else if (payload.kind === 'work') {
  const title = clean(payload.title, '中文剧名', 120);
  if (!uniqueWork(title)) throw new Error('同名作品已存在，请改为向现有作品投稿地标');
  catalog.works.push({ id: id('work'), title, original: clean(payload.original, '韩文原名', 120), year: clean(payload.year, '年份', 10, false) || '', color: '#617d8d', type: workType(payload.type) });
} else if (payload.kind === 'correction') {
  const landmarkId = clean(payload.landmarkId, '所属地点', 120);
  const reason = clean(payload.reason, '更正原因', 800);
  const sourceTitle = clean(payload.sourceTitle, '依据名称', 160, false) || '';
  const sourceUrl = https(payload.sourceUrl, '更正依据', false);
  applyCorrection(landmarkId, reason, findSource(sourceTitle, sourceUrl));
} else if (payload.kind === 'update') {
  const landmarkId = clean(payload.landmarkId, '所属地点', 120);
  const description = clean(payload.description, '场景描述', 800, false) || '';
  const episode = optionalInt(payload.episode, '集数', 1, 1000);
  const timeSeconds = optionalInt(payload.timeSeconds, '时间点', 0, 100000);
  const sourceTitle = clean(payload.sourceTitle, '来源名称', 160, false) || '';
  const sourceUrl = https(payload.sourceUrl, '取景来源', false);
  const image = sceneImage();
  const hasChanges = payload.changes && typeof payload.changes === 'object' && !Array.isArray(payload.changes) && Object.keys(payload.changes).length > 0;
  if (!description && !image.url && !hasChanges && !checked.sceneRecords) throw new Error('请至少补充场景、图片或一项更正资料');
  const sourceId = findSource(sourceTitle, sourceUrl);
  if (description || image.url || checked.sceneRecords) {
    appendScenes(landmarkId,sourceId);
  }
  if (hasChanges) applyCorrection(landmarkId, '投稿补充／更正资料', sourceId);
} else {
  const description = clean(payload.description, '场景描述', 800, !checked.sceneRecords && !checked.imageUrl) || '';
  const sourceTitle = clean(payload.sourceTitle, '来源名称', 160, false) || '';
  const sourceUrl = https(payload.sourceUrl, '取景来源', false);
  const episode = optionalInt(payload.episode, '集数', 1, 1000);
  const timeSeconds = optionalInt(payload.timeSeconds, '时间点', 0, 100000);
  const image = sceneImage();
  const sourceId = findSource(sourceTitle, sourceUrl);
  let landmarkId;
  if (payload.kind === 'place') {
    let workId = clean(payload.workId, '所属作品', 120);
    if (workId === 'new') {
      if (!payload.newWork || typeof payload.newWork !== 'object') throw new Error('新作品资料缺失');
      const title = clean(payload.newWork.title, '新作品中文名', 120, false);
      const original = clean(payload.newWork.original, '新作品韩文原名', 120, false);
      if (!title && !original) throw new Error('新作品请填写中文名或韩文名');
      const workTitle = title || original;
      if (!uniqueWork(workTitle)) throw new Error('同名作品已存在，请选择现有作品');
      workId = id('work');
      catalog.works.push({ id: workId, title: workTitle, original: original || '', year: clean(payload.newWork.year, '年份', 10, false) || '', color: '#617d8d', type: workType(payload.newWork.type), poster: posterImage() });
    }
    if (!catalog.works.some(work => work.id === workId)) throw new Error('所属作品不存在');
    const name = clean(payload.name, '地标名称', 120);
    const lat = number(payload.lat, '纬度', -90, 90);
    const lng = number(payload.lng, '经度', -180, 180);
    if (catalog.landmarks.some(place => place.workId === workId && place.name === name && Math.abs(place.lat - lat) < .0001 && Math.abs(place.lng - lng) < .0001)) {
      throw new Error('同一作品的同名地点和近似坐标已存在');
    }
    landmarkId = id('place');
    const ko = clean(payload.ko, '韩文地名', 120, false) || '';
    catalog.landmarks.push({
      id: landmarkId, workId, name, group: clean(payload.group, '地点分组', 100, false) || '', ko, city: clean(payload.city, '城市', 100, false) || '', lat, lng,
      coordinateStatus: 'approximate', verifiedAt: null, entrance: null, coordinateSourceId: null,
      coordinateNote: '投稿坐标；具体入口和拍摄机位尚未独立核实。',
      address: clean(payload.address, '地址', 240, false) || '', query: ko || name, kind: 'other',
      sourceId, visit: clean(payload.visit, '到访提示', 500, false) || '出行前请核对现场开放情况。'
    });
  } else {
    landmarkId = clean(payload.landmarkId, '所属地点', 120);
    if (!catalog.landmarks.some(place => place.id === landmarkId)) throw new Error('所属地点不存在');
  }
  appendScenes(landmarkId,sourceId);
}

const updatedLandmarkId = payload.kind === 'place' ? id('place') : payload.landmarkId;
const updatedPlace = catalog.landmarks.find(place => place.id === updatedLandmarkId);
const updatedWorkId = payload.kind === 'maintenance' ? checked.maintenance.workIds[0] : payload.kind === 'work' ? id('work') : updatedPlace?.workId;
catalog.updates.push({ issueNumber: Number(issueNumber), workId: updatedWorkId || null, landmarkId: updatedPlace?.id || null, reviewedAt: new Date().toISOString(), bodyHash });

if (payload.kind === 'maintenance') for (const workId of checked.maintenance.workIds.slice(1)) catalog.updates.push({issueNumber:Number(issueNumber),workId,landmarkId:null,reviewedAt:new Date().toISOString(),bodyHash});

const output = `// 作品 → 地标 → 场景。通过 GitHub 投稿并经维护者审核后更新。\nwindow.KDRAMA_CATALOG = ${JSON.stringify(catalog, null, 2)};\n`;
const target = path.resolve(catalogFile);
const temp = `${target}.issue-${issueNumber}.tmp`;
fs.writeFileSync(temp, output, 'utf8');
fs.renameSync(temp, target);
console.log(`已将 Issue #${issueNumber} 导入目录：${payload.kind}`);
