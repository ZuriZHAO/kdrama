'use strict';

const $ = id => document.getElementById(id);
const core = window.KdramaSubmission;
const catalog = window.KDRAMA_CATALOG || { works: [], landmarks: [], scenes: [], sources: [] };
const repo = String(window.KDRAMA_REPO || 'zurizhao/kdrama');
const clone = value => JSON.parse(JSON.stringify(value));
const locationKeys = ['name', 'ko', 'group', 'city', 'address', 'visit', 'lat', 'lng'];
const fieldNames = { name: '名称', ko: '韩文地名', group: '分组', city: '城市', address: '地址', visit: '到访提示', lat: '纬度', lng: '经度' };
const kindNames = { place: '新增取景地', update: '补充／更正地点', scene: '补充场景', correction: '更正地点', work: '新增作品' };
let parsed = null;
let basePayload = null;
let draftBody = '';
let fetchedIssue = null;
let dirtyFields = new Set();
let advancedDirty = false;
let editRevision = 0;
let map = null;
let mapPin = null;
let currentPin = null;
let streetLayer = null;

function value(id) { return $(id).value.trim(); }
function setValue(id, next) { $(id).value = next == null ? '' : String(next); }
function status(message, isError = false) {
  $('review-status').textContent = message;
  $('review-status').dataset.error = String(isError);
}
function invalidate() {
  const hadResult = !$('review-result').hidden;
  editRevision += 1;
  $('review-result').hidden = true;
  $('review-output').value = '';
  if (hadResult) status('内容已修改，请重新检查并生成正文。');
}
function markDirty(id) {
  dirtyFields.add(id);
  invalidate();
}
function setBusy(busy) {
  ['review-fetch', 'review-load', 'review-generate', 'review-apply-json', 'review-refresh-json', 'review-copy'].forEach(id => { $(id).disabled = busy; });
}
function currentPlace() { return catalog.landmarks.find(place => place.id === value('review-landmark')); }
function isLocationKind() { return ['place', 'update', 'correction'].includes(basePayload?.kind); }
function isSceneKind() { return ['place', 'update', 'scene'].includes(basePayload?.kind); }
function isPosterKind() { return basePayload?.kind === 'place' && value('review-work') === 'new'; }
function selectedCoordinates() {
  if (!value('review-lat') || !value('review-lng')) return null;
  const lat = Number(value('review-lat')), lng = Number(value('review-lng'));
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? [lat, lng] : null;
}
function safeImageUrl(url, allowLocal = false) {
  if (allowLocal && /^\.\/assets\//.test(url || '')) return url;
  try { const link = new URL(url); return link.protocol === 'https:' && !link.username && !link.password ? link.href : ''; } catch { return ''; }
}
function isGitHubImage(url) {
  return core.isGitHubImage(url);
}
function ensureOption(select, id, label) {
  if (id && ![...select.options].some(option => option.value === id)) select.add(new Option(label || id, id));
  select.value = id || '';
}
function fillOptions() {
  $('review-work').replaceChildren(new Option('请选择作品', ''), ...catalog.works.map(work =>
    new Option([work.title, work.original, work.year].filter(Boolean).join(' · '), work.id)), new Option('＋ 新作品', 'new'));
  $('review-landmark').replaceChildren(new Option('请选择地点', ''), ...catalog.landmarks.map(place => {
    const work = catalog.works.find(item => item.id === place.workId);
    return new Option([place.name, work?.title, place.city].filter(Boolean).join(' · '), place.id);
  }));
}
function fillLocation() {
  const place = currentPlace();
  const incoming = basePayload.kind === 'place' ? basePayload : (basePayload.changes || {});
  locationKeys.forEach(key => {
    setValue('review-' + key, Object.hasOwn(incoming, key) ? incoming[key] : place?.[key]);
    dirtyFields.delete('review-' + key);
  });
}
function refreshVisibility() {
  const kind = basePayload.kind;
  $('review-work-fields').hidden = kind !== 'place';
  $('review-new-work').hidden = !(kind === 'work' || isPosterKind());
  $('review-landmark-fields').hidden = !['update', 'correction', 'scene'].includes(kind);
  $('review-location').hidden = !isLocationKind();
  $('review-scene').hidden = !isSceneKind();
  $('review-reason-label').hidden = kind !== 'correction';
  $('review-images').hidden = !isSceneKind();
  $('review-image-section').hidden = !isSceneKind();
  $('review-poster-section').hidden = !isPosterKind();
  const place = currentPlace();
  $('review-current').hidden = kind === 'place';
  $('review-current').textContent = place ? '当前地点：' + place.name + ' · ' + (place.group || '未分组') : '当前目录中未找到此地点，请重新选择。';
  $('review-diff').hidden = kind === 'place';
  renderDiff();
  if (isLocationKind()) {
    initMap();
    updateMap(true);
  }
}
function fillEditor(payload, body, source) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload) || !Object.hasOwn(kindNames, payload.kind)) throw new Error('不支持的投稿类型。');
  const nextParsed = core.parseIssue(body);
  const nextPayload = clone(payload);
  const nextImage = payload.imageAttachment ? core.extractImage(body, 'image') : payload.imageUrl;
  const nextPoster = payload.posterAttachment ? core.extractImage(body, 'poster') : '';
  if (arguments.length > 2) setSource(source);
  parsed = nextParsed;
  basePayload = nextPayload;
  draftBody = body;
  dirtyFields = new Set();
  advancedDirty = false;
  ensureOption($('review-work'), payload.workId, '未知作品：' + payload.workId);
  ensureOption($('review-landmark'), payload.landmarkId, '未知地点：' + payload.landmarkId);
  const work = payload.kind === 'work' ? payload : (payload.newWork || {});
  ['title', 'original', 'year'].forEach(key => setValue('review-' + key, work[key]));
  ensureOption($('review-type'), work.type || 'drama');
  fillLocation();
  setValue('review-description', payload.description);
  setValue('review-episode', payload.episode);
  setValue('review-time', payload.timeSeconds);
  setValue('review-reason', payload.reason);
  setValue('review-source-url', payload.sourceUrl);
  setValue('review-source-title', payload.sourceTitle);
  setValue('review-contributor', payload.contributor);
  setValue('review-credit', payload.imageCredit);
  $('review-rights').checked = payload.rightsConfirmed === true;
  setValue('review-image-url', nextImage);
  setValue('review-poster-url', nextPoster);
  $('review-json').value = JSON.stringify(payload, null, 2);
  $('review-summary').textContent = kindNames[payload.kind] + (fetchedIssue ? ' · Issue #' + fetchedIssue.number : ' · 从粘贴正文读取');
  $('review-editor').hidden = false;
  invalidate();
  refreshVisibility();
  updatePreviews();
}
function collectPayload() {
  if (!basePayload) throw new Error('请先读取投稿。');
  const payload = clone(basePayload);
  payload.version = 2;
  const kind = payload.kind;
  if (kind === 'place') {
    payload.workId = value('review-work');
    if (payload.workId === 'new') {
      payload.newWork = { ...(payload.newWork || {}), title: value('review-title'), original: value('review-original'), year: value('review-year'), type: value('review-type') };
    }
    locationKeys.forEach(key => {
      payload[key] = ['lat', 'lng'].includes(key) ? (value('review-' + key) === '' ? null : Number(value('review-' + key))) : value('review-' + key);
    });
  }
  if (kind === 'work') {
    ['title', 'original', 'year', 'type'].forEach(key => { payload[key] = value('review-' + key); });
  }
  if (['update', 'correction', 'scene'].includes(kind)) payload.landmarkId = value('review-landmark');
  if (['update', 'correction'].includes(kind)) {
    const current = currentPlace() || {};
    const changes = { ...(payload.changes || {}) };
    locationKeys.filter(key => !['lat', 'lng'].includes(key)).forEach(key => {
      if (!dirtyFields.has('review-' + key)) return;
      const next = value('review-' + key);
      if (next === String(current[key] ?? '')) delete changes[key]; else changes[key] = next;
    });
    if (dirtyFields.has('review-lat') || dirtyFields.has('review-lng')) {
      const lat = value('review-lat') === '' ? null : Number(value('review-lat'));
      const lng = value('review-lng') === '' ? null : Number(value('review-lng'));
      if (lat === current.lat && lng === current.lng) { delete changes.lat; delete changes.lng; }
      else { changes.lat = lat; changes.lng = lng; }
    }
    payload.changes = changes;
  }
  if (kind === 'correction') payload.reason = value('review-reason');
  if (isSceneKind()) {
    payload.description = value('review-description');
    payload.episode = value('review-episode') === '' ? null : Number(value('review-episode'));
    payload.timeSeconds = value('review-time') === '' ? null : Number(value('review-time'));
    payload.imageCredit = value('review-credit');
    payload.rightsConfirmed = $('review-rights').checked;
  }
  payload.sourceUrl = value('review-source-url');
  payload.sourceTitle = value('review-source-title');
  payload.contributor = value('review-contributor');
  return payload;
}
function buildDraft() {
  const payload = collectPayload();
  let body = draftBody;
  if (isSceneKind() && dirtyFields.has('review-image-url')) {
    const url = value('review-image-url');
    delete payload.imageUrl;
    if (url && !isGitHubImage(url)) {
      payload.imageAttachment = false;
      payload.imageUrl = url;
      body = core.replaceImage(body, 'image', '');
    } else {
      payload.imageAttachment = !!url;
      body = core.replaceImage(body, 'image', url);
    }
  }
  if (isPosterKind() && dirtyFields.has('review-poster-url')) {
    const url = value('review-poster-url');
    payload.posterAttachment = !!url;
    body = core.replaceImage(body, 'poster', url);
  } else if (payload.kind === 'place' && !isPosterKind() && dirtyFields.has('review-work')) {
    payload.posterAttachment = false;
    body = core.replaceImage(body, 'poster', '');
  }
  return { payload, body: core.serializeIssue(core.parseIssue(body), payload) };
}
function renderDiff() {
  if (!basePayload || !['update', 'correction'].includes(basePayload.kind)) return;
  const current = currentPlace() || {};
  const next = collectPayload().changes || {};
  const tbody = $('review-diff').querySelector('tbody');
  tbody.replaceChildren(...locationKeys.map(key => {
    const row = document.createElement('tr');
    const old = current[key] ?? '';
    const proposed = Object.hasOwn(next, key) ? next[key] : old;
    if (old !== proposed) row.className = 'changed';
    [fieldNames[key], String(old) || '未填写', String(proposed ?? '') || (key === 'group' ? '未分组' : '未填写')].forEach(text => {
      const cell = document.createElement('td');
      cell.textContent = text;
      row.append(cell);
    });
    return row;
  }));
}
function updatePreview(kind) {
  const url = value('review-' + kind + '-url');
  const safe = safeImageUrl(url);
  const figure = $('review-' + kind + '-preview');
  const img = $('review-' + kind + '-img');
  const feedback = $('review-' + kind + '-feedback');
  figure.hidden = !safe;
  feedback.textContent = url && !safe ? '请使用完整的 HTTPS 图片链接。' : '';
  if (!safe) { img.removeAttribute('src'); return; }
  if (img.getAttribute('src') !== safe) img.src = safe;
}
function updatePreviews() { updatePreview('image'); updatePreview('poster'); }
async function fetchIssue(number) {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) throw new Error('仓库配置无效。');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch('https://api.github.com/repos/' + repo + '/issues/' + number, {
      headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store', signal: controller.signal
    });
    if (!response.ok) throw new Error(response.status === 404 ? '未找到该 Issue，请确认编号。' : 'GitHub 读取失败（' + response.status + '），可稍后重试或粘贴正文。');
    const issue = await response.json();
    if (issue.pull_request || issue.number !== number || typeof issue.body !== 'string') throw new Error('链接不是可读取的投稿 Issue。');
    return issue;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('GitHub 读取超时，请重试或粘贴正文。');
    throw error;
  } finally { clearTimeout(timeout); }
}
function setSource(issue) {
  fetchedIssue = issue ? { number: issue.number, body: issue.body, updatedAt: issue.updated_at, url: 'https://github.com/' + repo + '/issues/' + issue.number } : null;
  $('review-issue-link').hidden = !fetchedIssue;
  if (fetchedIssue) $('review-issue-link').href = fetchedIssue.url;
}
async function loadFromGitHub() {
  setBusy(true);
  invalidate();
  try {
    const number = core.parseIssueNumber(value('review-issue'), repo);
    if (!number) throw new Error('请输入本仓库的 Issue 编号或完整链接。');
    const issue = await fetchIssue(number);
    const result = core.parseIssue(issue.body);
    fillEditor(result.payload, issue.body, issue);
    setValue('review-input', issue.body);
    status('已读取 Issue #' + number + '。修改后生成正文，再回 GitHub 保存与批准。');
  } catch (error) { status('读取失败：' + error.message, true); }
  finally { setBusy(false); }
}
function loadPasted() {
  try {
    const body = $('review-input').value;
    const result = core.parseIssue(body);
    fillEditor(result.payload, body, null);
    status('已读取粘贴正文。保存前请对照原 Issue，确认没有其他人的新修改。');
  } catch (error) { status('读取失败：' + error.message, true); }
}
function writeCoordinates(lat, lng) {
  const point = L.latLng(lat, lng).wrap();
  setValue('review-lat', Number(point.lat.toFixed(6)));
  setValue('review-lng', Number(point.lng.toFixed(6)));
  markDirty('review-lat');
  markDirty('review-lng');
  updateMap(false);
  renderDiff();
}
function initMap() {
  if (map) return;
  if (!window.L) { $('review-map-status').textContent = '地图暂不可用，可直接填写经纬度。'; return; }
  map = L.map('review-map', { minZoom: 2, maxZoom: 18, scrollWheelZoom: true }).setView([36.4, 127.8], 7);
  map.createPane('reviewFallback').style.zIndex = 180;
  const geography = window.KDRAMA_MAP_DATA;
  if (geography) {
    [geography.neighbors, geography.regions].filter(Boolean).forEach(data => L.geoJSON(data, { pane: 'reviewFallback', interactive: false, style: { color: '#afbeb5', weight: 1, fillColor: '#edf0e8', fillOpacity: 1 } }).addTo(map));
    map.attributionControl.addAttribution('地图边界：Natural Earth / geoBoundaries');
  }
  map.on('click', event => writeCoordinates(event.latlng.lat, event.latlng.lng));
  $('review-map-status').textContent = '正在加载街道地图；圆点是本次修改位置。';
  loadStreetMap();
}
async function loadStreetMap() {
  if (!window.maplibregl || !L.maplibreGL) { $('review-map-status').textContent = '街道图暂不可用，当前为轮廓图；可直接修改坐标。'; return; }
  let done = false;
  let errorCount = 0;
  const controller = new AbortController();
  const fallback = () => {
    if (done) return;
    done = true;
    controller.abort();
    if (streetLayer && map.hasLayer(streetLayer)) map.removeLayer(streetLayer);
    $('review-map-status').textContent = '街道图暂不可用，当前为轮廓图；可直接修改坐标。';
  };
  const timer = setTimeout(fallback, 15000);
  try {
    const response = await fetch('https://tiles.openfreemap.org/styles/liberty', { signal: controller.signal });
    if (!response.ok) throw new Error('地图加载失败');
    const style = await response.json();
    if (done) return;
    (style.layers || []).forEach(layer => {
      const original = layer.layout?.['text-field'];
      if (layer.type === 'symbol' && original && JSON.stringify(original).includes('name')) layer.layout['text-field'] = ['coalesce', ['get', 'name:zh-Hans'], ['get', 'name:zh'], ['get', 'name'], original];
    });
    streetLayer = L.maplibreGL({ style }).addTo(map);
    const gl = streetLayer.getMaplibreMap();
    gl.on('error', () => { if (++errorCount >= 3) { clearTimeout(timer); fallback(); } });
    gl.once('idle', () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      $('review-map-status').textContent = 'OpenFreeMap 街道图。蓝点为修改后位置，灰圈为当前目录位置。';
    });
  } catch { clearTimeout(timer); fallback(); }
}
function updateMap(center) {
  if (!map || !isLocationKind()) return;
  const coords = selectedCoordinates();
  if (currentPin) { currentPin.remove(); currentPin = null; }
  const place = basePayload.kind === 'place' ? null : currentPlace();
  if (place && Number.isFinite(place.lat) && Number.isFinite(place.lng)) currentPin = L.circleMarker([place.lat, place.lng], { radius: 10, weight: 2, color: '#77878a', fillOpacity: 0.08, interactive: false }).addTo(map);
  if (!coords) { if (mapPin) { mapPin.remove(); mapPin = null; } return; }
  if (!mapPin) {
    mapPin = L.marker(coords, { draggable: true, title: '修改后的位置，可拖动', icon: L.divIcon({ className: 'review-map-pin', html: '<span></span>', iconSize: [24, 24], iconAnchor: [12, 12] }) }).addTo(map);
    mapPin.on('dragend', () => { const point = mapPin.getLatLng(); writeCoordinates(point.lat, point.lng); });
  } else mapPin.setLatLng(coords);
  if (center) map.setView(coords, 14);
  setTimeout(() => map.invalidateSize(), 0);
}

fillOptions();
$('review-fetch').addEventListener('click', loadFromGitHub);
$('review-issue').addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); loadFromGitHub(); } });
$('review-load').addEventListener('click', loadPasted);
$('review-fields').addEventListener('input', event => {
  if (!basePayload || !event.target.id) return;
  markDirty(event.target.id);
  if (event.target.id === 'review-image-url' || event.target.id === 'review-poster-url') updatePreviews();
  if (event.target.id === 'review-lat' || event.target.id === 'review-lng') updateMap(false);
  renderDiff();
});
$('review-fields').addEventListener('change', event => {
  if (!basePayload || !event.target.id) return;
  markDirty(event.target.id);
  if (event.target.id === 'review-work') refreshVisibility();
  if (event.target.id === 'review-landmark') { fillLocation(); refreshVisibility(); }
  renderDiff();
});
['image', 'poster'].forEach(kind => {
  $('review-remove-' + kind).addEventListener('click', () => {
    setValue('review-' + kind + '-url', '');
    markDirty('review-' + kind + '-url');
    updatePreview(kind);
  });
  $('review-' + kind + '-img').addEventListener('error', () => { $('review-' + kind + '-feedback').textContent = '图片暂时无法预览，请检查链接；这不代表图片已移除。'; });
  $('review-' + kind + '-img').addEventListener('load', () => { $('review-' + kind + '-feedback').textContent = ''; });
});
$('review-json').addEventListener('input', () => { advancedDirty = true; invalidate(); });
$('review-refresh-json').addEventListener('click', () => {
  try { $('review-json').value = JSON.stringify(buildDraft().payload, null, 2); advancedDirty = false; status('已从当前表单刷新 JSON。'); }
  catch (error) { status(error.message, true); }
});
$('review-apply-json').addEventListener('click', () => {
  try {
    const payload = JSON.parse($('review-json').value);
    const current = buildDraft();
    const body = core.serializeIssue(core.parseIssue(current.body), payload);
    fillEditor(payload, body);
    status('已应用 JSON，请检查表单和图片预览。');
  } catch (error) { status('应用失败：' + error.message, true); }
});
$('review-generate').addEventListener('click', async () => {
  setBusy(true);
  $('review-result').hidden = true;
  const revision = editRevision;
  try {
    if (advancedDirty) throw new Error('高级 JSON 有未应用的修改，请先点击“应用 JSON 到表单”。');
    const result = buildDraft();
    core.validateSubmission(result.payload, result.body, catalog);
    if (fetchedIssue) {
      status('正在确认原 Issue 是否有新修改……');
      const latest = await fetchIssue(fetchedIssue.number);
      if (latest.body !== fetchedIssue.body) throw new Error('原 Issue 正文已被修改。请保留当前需要的内容，重新读取最新投稿后再生成，避免覆盖他人修改。');
    }
    if (editRevision !== revision) throw new Error('检查期间表单发生了修改，请重新生成正文。');
    $('review-output').value = result.body;
    $('review-result').hidden = false;
    status('检查通过。请复制完整正文到原 Issue 保存，再添加 publish-approved 标签。');
  } catch (error) { status('尚未生成：' + error.message, true); }
  finally { setBusy(false); }
});
$('review-copy').addEventListener('click', async () => {
  if ($('review-result').hidden || !$('review-output').value) return;
  try { await navigator.clipboard.writeText($('review-output').value); status('已复制。请回原 GitHub Issue 保存正文后再批准发布。'); }
  catch { $('review-output').focus(); $('review-output').select(); status('浏览器未开放复制权限，已选中正文，请手动复制。'); }
});
const query = new URLSearchParams(location.search);
if (query.has('issue')) { setValue('review-issue', query.get('issue')); void loadFromGitHub(); }
