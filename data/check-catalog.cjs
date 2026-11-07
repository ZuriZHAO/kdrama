const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'catalog.js'), 'utf8'), context);
const catalog = context.window.KDRAMA_CATALOG;
const errors = [];

function idsOf(items, type) {
  if (!Array.isArray(items)) {
    errors.push(`${type} 必须是数组`);
    return new Set();
  }
  const ids = new Set();
  items.forEach((item, index) => {
    if (!item.id || ids.has(item.id)) errors.push(`${type}[${index}] 的 id 缺失或重复`);
    ids.add(item.id);
  });
  return ids;
}

if (!catalog) throw new Error('缺少 KDRAMA_CATALOG');
const workIds = idsOf(catalog.works, 'works');
const sourceIds = idsOf(catalog.sources, 'sources');
const landmarkIds = idsOf(catalog.landmarks, 'landmarks');
idsOf(catalog.scenes, 'scenes');

catalog.works.forEach(work => {
  if (work.aliases && (!Array.isArray(work.aliases) || work.aliases.some(alias => typeof alias !== 'string' || !alias.trim()))) errors.push(`作品 ${work.id} 的搜索别名无效`);
  if (!work.poster) return;
  if (/^https:\/\//.test(work.poster)) return;
  if (!/^\.\/assets\/[A-Za-z0-9/_-]+\.(?:jpg|jpeg|png|webp)$/i.test(work.poster) || !fs.existsSync(path.join(__dirname, '..', work.poster))) errors.push(`作品 ${work.id} 的海报文件不存在或路径无效`);
});

catalog.sources.forEach(source => {
  if (!source.title || !/^https:\/\//.test(source.url || '')) errors.push(`来源 ${source.id} 缺少名称或 HTTPS 链接`);
});

catalog.landmarks.forEach(place => {
  if (!workIds.has(place.workId)) errors.push(`地标 ${place.id} 引用了不存在的作品`);
  if (place.sourceId && !sourceIds.has(place.sourceId)) errors.push(`地标 ${place.id} 引用了不存在的来源`);
  if (!Number.isFinite(place.lat) || !Number.isFinite(place.lng) || Math.abs(place.lat) > 90 || Math.abs(place.lng) > 180) {
    errors.push(`地标 ${place.id} 坐标无效`);
  }
  if (!['approximate', 'venue', 'camera'].includes(place.coordinateStatus)) errors.push(`地标 ${place.id} 的坐标状态无效`);
  if (place.coordinateStatus !== 'approximate' && !place.verifiedAt) errors.push(`已核实地标 ${place.id} 缺少核验日期`);
  if (place.coordinateStatus !== 'approximate' && !place.coordinateSourceId) errors.push(`已核实地标 ${place.id} 缺少坐标依据`);
  if (place.coordinateSourceId && !sourceIds.has(place.coordinateSourceId)) errors.push(`地标 ${place.id} 引用了不存在的坐标依据`);
  if (place.verifiedAt && !/^\d{4}-\d{2}-\d{2}$/.test(place.verifiedAt)) errors.push(`地标 ${place.id} 的核验日期格式无效`);
  if (place.verifiedAt && !place.coordinateNote) errors.push(`地标 ${place.id} 缺少坐标核验说明`);
});

catalog.scenes.forEach(scene => {
  if (!landmarkIds.has(scene.landmarkId)) errors.push(`场景 ${scene.id} 引用了不存在的地标`);
  if (scene.sourceId && !sourceIds.has(scene.sourceId)) errors.push(`场景 ${scene.id} 引用了不存在的来源`);
  if (scene.episodeSourceId && !sourceIds.has(scene.episodeSourceId)) errors.push(`场景 ${scene.id} 引用了不存在的集数依据`);
  if (scene.episode !== null && (!Number.isInteger(scene.episode) || scene.episode < 1)) errors.push(`场景 ${scene.id} 的集数无效`);

  if (!scene.description && !scene.image) errors.push(`场景 ${scene.id} 缺少描述和图片`);
  if (scene.timeSeconds !== null && (!Number.isInteger(scene.timeSeconds) || scene.timeSeconds < 0)) {
    errors.push(`场景 ${scene.id} 的时间秒数无效`);
  }
});

if (catalog.revisions) {
  idsOf(catalog.revisions, 'revisions');
  catalog.revisions.forEach(revision => {
    if (!landmarkIds.has(revision.landmarkId)) errors.push(`更正 ${revision.id} 引用了不存在的地标`);
    if (revision.sourceId && !sourceIds.has(revision.sourceId)) errors.push(`更正 ${revision.id} 引用了不存在的依据`);
    if (!revision.reason || !revision.changes || !Object.keys(revision.changes).length) errors.push(`更正 ${revision.id} 缺少内容或原因`);
  });
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`数据检查通过：${catalog.works.length} 部作品、${catalog.landmarks.length} 个地标、${catalog.scenes.length} 条场景、${catalog.sources.length} 条来源`);
}
