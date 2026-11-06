const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const [issueFile, issueNumber, catalogFile = path.join(__dirname, '..', 'data', 'catalog.js')] = process.argv.slice(2);
if (!issueFile || !/^\d+$/.test(issueNumber || '')) {
  console.error('用法：node tools/import-issue.cjs <issue正文文件> <Issue编号> [目录文件]');
  process.exit(1);
}

const body = fs.readFileSync(issueFile, 'utf8');
const editable = /<!-- KDRAMA_SUBMISSION_V2_START -->\s*```json\s*\n([\s\S]{1,30000}?)\n```\s*<!-- KDRAMA_SUBMISSION_V2_END -->/.exec(body);
let payload;
if (editable) {
  payload = JSON.parse(editable[1]);
  if (payload.version !== 2) throw new Error('可编辑投稿版本无效');
} else {
  const match = /<!-- KDRAMA_SUBMISSION_V1:([A-Za-z0-9_-]{20,16000}) -->/.exec(body);
  if (!match) throw new Error('Issue 中缺少可识别的投稿数据；请从网站投稿页生成 Issue');
  const bytes = Buffer.from(match[1], 'base64url');
  if (bytes.toString('base64url') !== match[1]) throw new Error('投稿数据编码无效');
  payload = JSON.parse(bytes.toString('utf8'));
  if (payload.version !== 1) throw new Error('旧版投稿版本无效');
}
if (!payload || !['work', 'place', 'scene', 'correction'].includes(payload.kind)) throw new Error('投稿类型无效');

const context = { window: {} };
vm.runInNewContext(fs.readFileSync(catalogFile, 'utf8'), context);
const catalog = context.window.KDRAMA_CATALOG;
if (!catalog || !['works', 'landmarks', 'scenes', 'sources'].every(key => Array.isArray(catalog[key]))) throw new Error('公开目录结构无效');

const id = suffix => `issue-${issueNumber}-${suffix}`;
catalog.revisions ||= [];
if (!Array.isArray(catalog.revisions)) throw new Error('更正记录结构无效');
if (catalog.works.some(item => item.id === id('work')) || catalog.landmarks.some(item => item.id === id('place')) || catalog.scenes.some(item => item.id === id('scene')) || catalog.revisions.some(item => item.id === id('correction'))) {
  console.log(`Issue #${issueNumber} 已导入，跳过`);
  process.exit(0);
}
const clean = (value, label, max, required = true) => {
  if (value == null && !required) return null;
  if (typeof value !== 'string') throw new Error(`${label}必须是文字`);
  const result = value.trim();
  if ((required && !result) || result.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(result)) throw new Error(`${label}无效`);
  return result || null;
};
const https = (value, label) => {
  const result = clean(value, label, 1000);
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
const findSource = (title, link) => {
  const old = catalog.sources.find(source => source.url === link);
  if (old) return old.id;
  const sourceId = id('source');
  catalog.sources.push({ id: sourceId, title, url: link });
  return sourceId;
};
const uniqueWork = title => !catalog.works.some(work => work.title.trim().toLocaleLowerCase() === title.trim().toLocaleLowerCase());

if (payload.kind === 'work') {
  const title = clean(payload.title, '中文剧名', 120);
  if (!uniqueWork(title)) throw new Error('同名作品已存在，请改为向现有作品投稿地标');
  catalog.works.push({ id: id('work'), title, original: clean(payload.original, '韩文原名', 120), year: clean(payload.year, '年份', 10, false) || '', color: '#617d8d' });
} else if (payload.kind === 'correction') {
  const landmarkId = clean(payload.landmarkId, '所属地点', 120);
  const place = catalog.landmarks.find(item => item.id === landmarkId);
  if (!place) throw new Error('所属地点不存在');
  const reason = clean(payload.reason, '更正原因', 800);
  const sourceTitle = clean(payload.sourceTitle, '依据名称', 160);
  const sourceUrl = https(payload.sourceUrl, '更正依据');
  const changes = payload.changes;
  if (!changes || typeof changes !== 'object' || Array.isArray(changes)) throw new Error('更正内容无效');
  const allowed = ['name','ko','city','address','visit','lat','lng'];
  const keys = Object.keys(changes);
  if (!keys.length || keys.some(key => !allowed.includes(key))) throw new Error('更正字段无效');
  const next = {};
  for (const [key, max] of Object.entries({name:120,ko:120,city:100,address:240,visit:500})) {
    if (Object.hasOwn(changes, key)) next[key] = clean(changes[key], key, max, key === 'name') || '';
  }
  if (('lat' in changes) !== ('lng' in changes)) throw new Error('更正坐标必须同时提供经纬度');
  if ('lat' in changes) {
    next.lat = number(changes.lat, '纬度', -90, 90);
    next.lng = number(changes.lng, '经度', -180, 180);
  }
  if (!Object.keys(next).some(key => next[key] !== place[key])) throw new Error('更正内容与现有资料相同');
  const sourceId = findSource(sourceTitle, sourceUrl);
  Object.assign(place, next);
  if ('lat' in next) {
    place.coordinateStatus = 'approximate';
    place.verifiedAt = null;
    place.entrance = null;
    place.coordinateSourceId = sourceId;
    place.coordinateNote = `Issue #${issueNumber} 更正坐标；拍摄机位仍待独立核实。`;
  }
  if ('ko' in next || 'name' in next) place.query = place.ko || place.name;
  catalog.revisions.push({ id: id('correction'), landmarkId, changes: next, reason, sourceId, date: new Date().toISOString().slice(0,10) });
} else {
  const description = clean(payload.description, '场景描述', 800);
  const sourceTitle = clean(payload.sourceTitle, '来源名称', 160);
  const sourceUrl = https(payload.sourceUrl, '取景来源');
  const episode = optionalInt(payload.episode, '集数', 1, 1000);
  const timeSeconds = optionalInt(payload.timeSeconds, '时间点', 0, 100000);
  let image = null; let imageCredit = null;
  if (payload.imageAttachment === true) {
    if (payload.imageUrl != null) throw new Error('图片链接和 Issue 附件不能同时提交');
    if (payload.rightsConfirmed !== true) throw new Error('图片缺少使用许可声明');
    const afterData = editable ? body.slice(editable.index + editable[0].length) : '';
    const markdownImages = [...afterData.matchAll(/!\[[^\]\n]{0,200}\]\((https:\/\/[^\s)]+)\)/g)];
    image = markdownImages.map(match => match[1]).find(link => {
      try {
        const url = new URL(link);
        return (url.hostname === 'github.com' && /^\/user-attachments\/assets\/[A-Za-z0-9-]{8,100}$/.test(url.pathname))
          || (url.hostname === 'user-images.githubusercontent.com' && /^\/\d+\/[A-Za-z0-9._/%-]+$/.test(url.pathname));
      } catch { return false; }
    }) || null;
    if (!image) throw new Error('请在 Issue 正文的投稿图片段落附上 GitHub 托管的图片');
    imageCredit = clean(payload.imageCredit, '图片署名', 160);
  } else if (payload.imageUrl != null) {
    if (payload.rightsConfirmed !== true) throw new Error('图片缺少使用许可声明');
    image = https(payload.imageUrl, '图片链接');
    imageCredit = clean(payload.imageCredit, '图片署名', 160);
  }
  let landmarkId;
  if (payload.kind === 'place') {
    let workId = clean(payload.workId, '所属作品', 120);
    if (workId === 'new') {
      if (!payload.newWork || typeof payload.newWork !== 'object') throw new Error('新作品资料缺失');
      const title = clean(payload.newWork.title, '新作品中文名', 120);
      if (!uniqueWork(title)) throw new Error('同名作品已存在，请选择现有作品');
      workId = id('work');
      catalog.works.push({ id: workId, title, original: clean(payload.newWork.original, '新作品韩文原名', 120), year: clean(payload.newWork.year, '年份', 10, false) || '', color: '#617d8d' });
    }
    if (!catalog.works.some(work => work.id === workId)) throw new Error('所属作品不存在');
    const name = clean(payload.name, '地标名称', 120);
    const lat = number(payload.lat, '纬度', -90, 90);
    const lng = number(payload.lng, '经度', -180, 180);
    if (catalog.landmarks.some(place => place.workId === workId && place.name === name && Math.abs(place.lat-lat) < .0001 && Math.abs(place.lng-lng) < .0001)) {
      throw new Error('同一作品的同名地点和近似坐标已存在');
    }
    landmarkId = id('place');
    const ko = clean(payload.ko, '韩文地名', 120, false) || '';
    catalog.landmarks.push({
      id: landmarkId, workId, name, ko, city: clean(payload.city, '城市', 100, false) || '', lat, lng,
      coordinateStatus: 'approximate', verifiedAt: null, entrance: null, coordinateSourceId: null,
      coordinateNote: '投稿坐标；具体入口和拍摄机位尚未独立核实。',
      address: clean(payload.address, '地址', 240, false) || '', query: ko || name, kind: 'other',
      sourceId: findSource(sourceTitle, sourceUrl), visit: clean(payload.visit, '到访提示', 500, false) || '出行前请核对现场开放情况。'
    });
  } else {
    landmarkId = clean(payload.landmarkId, '所属地点', 120);
    if (!catalog.landmarks.some(place => place.id === landmarkId)) throw new Error('所属地点不存在');
  }
  const sourceId = findSource(sourceTitle, sourceUrl);
  catalog.scenes.push({ id: id('scene'), landmarkId, description, episode, timeSeconds, image, imageCredit, sourceId, episodeSourceId: episode === null ? null : sourceId });
}

const output = `// 作品 → 地标 → 场景。通过 GitHub 投稿并经维护者审核后更新。\nwindow.KDRAMA_CATALOG = ${JSON.stringify(catalog, null, 2)};\n`;
const target = path.resolve(catalogFile);
const temp = `${target}.issue-${issueNumber}.tmp`;
fs.writeFileSync(temp, output, 'utf8');
fs.renameSync(temp, target);
console.log(`已将 Issue #${issueNumber} 导入目录：${payload.kind}`);
