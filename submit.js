const $ = id => document.getElementById(id);
const catalog = window.KDRAMA_CATALOG || { works: [], landmarks: [], scenes: [], sources: [] };
const api = String(window.KDRAMA_SUBMISSION_API || '').replace(/\/$/, '');
const params = new URLSearchParams(location.search);
let step = 0;
let works = catalog.works.slice();
let landmarks = catalog.landmarks.slice();
let previewUrl = '';
const landmarkLabels = new Map();

function value(id) { return $(id).value.trim(); }
function required(id, message) { const result = value(id); if (!result) throw new Error(message); return result; }
function optionalNumber(id, max) {
  const raw = value(id);
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0 || n > max) throw new Error('集数或时间点格式不正确');
  return n;
}
function sourceUrl() {
  const raw = value('source-url');
  if (!raw) return '';
  try { const url = new URL(raw); if (url.protocol === 'https:') return url.href; } catch {}
  throw new Error('资料来源请填写 HTTPS 链接');
}
function updateOptions() {
  const previous = value('work-id');
  $('work-id').replaceChildren(new Option('请选择作品', ''), ...works.map(work =>
    new Option([work.title, work.original].filter(Boolean).join(' · '), work.id)), new Option('＋ 添加新作品', 'new'));
  if ([...$('work-id').options].some(option => option.value === previous)) $('work-id').value = previous;
}
function updateLandmarkOptions() {
  landmarkLabels.clear();
  const options = landmarks.map(place => {
    const work = works.find(item => item.id === place.workId);
    const label = [place.name, place.ko, work?.title, work?.original, place.city].filter(Boolean).join(' · ');
    const unique = landmarkLabels.has(label) ? `${label} · ${place.id}` : label;
    landmarkLabels.set(unique, place.id);
    return new Option(unique, unique);
  });
  $('landmark-options').replaceChildren(...options);
}
function selectLandmark(id) {
  const label = [...landmarkLabels].find(([, value]) => value === id)?.[0] || '';
  $('landmark-id').value = label ? id : '';
  $('landmark-search').value = label;
  $('landmark-selection').textContent = label ? `已选择：${label}` : '输入后从建议中选择地点。';
}
function resolveLandmark() {
  const text = value('landmark-search');
  const exact = landmarkLabels.get(text);
  const matches = landmarks.filter(place => place.name === text || place.ko === text || place.id === text);
  const id = exact || (matches.length === 1 ? matches[0].id : '');
  $('landmark-id').value = id;
  $('landmark-selection').textContent = id
    ? `已选择：${landmarks.find(place => place.id === id)?.name || text}`
    : '请从建议中选择一个已有地点。';
}
function showKind() {
  const kind = value('kind');
  $('work-fields').hidden = kind !== 'place';
  $('landmark-fields').hidden = kind === 'place';
  $('place-fields').hidden = kind !== 'place';
  $('update-fields').hidden = kind !== 'update';
  $('scene-label').textContent = kind === 'place' ? '剧中的场景' : '补充场景描述（可选）';
  $('new-work-fields').hidden = value('work-id') !== 'new' || kind !== 'place';
}
function showStep() {
  document.querySelectorAll('.step-panel').forEach((panel, i) => { panel.hidden = i !== step; });
  document.querySelectorAll('.steps li').forEach((item, i) => { item.classList.toggle('active', i === step); });
  $('back-button').hidden = step === 0;
  $('next-button').hidden = step === 2;
  $('send-button').hidden = step !== 2;
  $('form-status').textContent = '';
  if (step === 2) {
    const kind = value('kind');
    const work = works.find(item => item.id === value('work-id'));
    const place = landmarks.find(item => item.id === value('landmark-id'));
    $('review-summary').textContent = kind === 'place'
      ? `请检查：${work?.title || value('work-title')} · ${value('place-name')} · 坐标 ${value('lat')}, ${value('lng')}`
      : `请检查：${place?.name || ''} · 补充／更正资料`;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function validateCurrentStep() {
  const kind = value('kind');
  if (step === 0) {
    if (kind === 'place') {
      const work = required('work-id', '请选择作品');
      if (work === 'new' && !value('work-title') && !value('work-original')) throw new Error('新作品请填写中文名或韩文名');
    } else required('landmark-id', '请选择已有地点');
  }
  if (step === 1) {
    if (kind === 'place') {
      required('place-name', '请填写地点名称');
      const lat = Number(required('lat', '请填写地图纬度'));
      const lng = Number(required('lng', '请填写地图经度'));
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) throw new Error('纬度需在 -90～90、经度需在 -180～180 之间');
      required('description', '请描述剧中的场景');
    }
    for (const [id, limit] of [['correction-lat', 90], ['correction-lng', 180]]) {
      if (value(id) && (!Number.isFinite(Number(value(id))) || Math.abs(Number(value(id))) > limit)) throw new Error('更正坐标超出经纬度范围');
    }
  }
}
function collect() {
  const kind = value('kind');
  const link = sourceUrl();
  const payload = { kind, sourceUrl: link, sourceTitle: value('source-title') || (link ? new URL(link).hostname : ''), contributor: value('contributor') };
  if (kind === 'place') Object.assign(payload, {
    workId: value('work-id'), newWork: value('work-id') === 'new' ? { title: value('work-title'), original: value('work-original') } : null,
    name: value('place-name'), group: value('place-group'), lat: Number(value('lat')), lng: Number(value('lng')), description: value('description'),
    episode: optionalNumber('episode', 1000), timeSeconds: optionalNumber('time-seconds', 100000)
  });
  if (kind === 'update') {
    const changes = {};
    if (value('correction-name')) changes.name = value('correction-name');
    if (value('correction-lat')) changes.lat = Number(value('correction-lat'));
    if (value('correction-lng')) changes.lng = Number(value('correction-lng'));
    Object.assign(payload, { landmarkId: value('landmark-id'), description: value('description'), changes,
      episode: optionalNumber('episode', 1000), timeSeconds: optionalNumber('time-seconds', 100000) });
  }
  const file = $('image').files[0];
  const poster = kind === 'place' && value('work-id') === 'new' ? $('poster').files[0] : null;
  if (kind === 'update' && !payload.description && !Object.keys(payload.changes).length && !file) throw new Error('请至少补充场景、图片或一项更正资料');
  for (const upload of [file, poster].filter(Boolean)) {
    if (upload.size > 5000000 || !['image/jpeg', 'image/png', 'image/webp'].includes(upload.type)) throw new Error('图片仅支持 JPG、PNG、WebP，最大 5 MB');
    if (!$('rights-confirmed').checked) throw new Error('请确认图片展示许可');
  }
  if (file || poster) {
    payload.imageCredit = value('image-credit');
    payload.rightsConfirmed = true;
  }
  return { payload, file, poster };
}
async function loadApproved() {
  if (!api) return;
  try {
    const response = await fetch(api + '/api/catalog', { signal: AbortSignal.timeout(4000) });
    if (!response.ok) return;
    const data = await response.json();
    works = works.concat(data.works || []);
    landmarks = landmarks.concat(data.landmarks || []);
  } catch {}
}
async function init() {
  await loadApproved();
  updateOptions();
  updateLandmarkOptions();
  if (['update', 'scene', 'correction'].includes(params.get('kind'))) $('kind').value = 'update';
  if (params.has('workId') && works.some(work => work.id === params.get('workId'))) $('work-id').value = params.get('workId');
  if (params.has('landmarkId')) selectLandmark(params.get('landmarkId'));
  $('lat').value = params.get('lat') || '';
  $('lng').value = params.get('lng') || '';
  showKind();
  showStep();
}
$('work-id').addEventListener('change', showKind);
$('kind').addEventListener('change', showKind);
$('landmark-search').addEventListener('input', resolveLandmark);
$('image').addEventListener('change', () => {
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  const file = $('image').files[0];
  previewUrl = file ? URL.createObjectURL(file) : '';
  $('image-preview-img').src = previewUrl;
  $('image-preview').hidden = !file;
  $('image-rights').hidden = !file && !$('poster').files[0];
});
$('poster').addEventListener('change', () => { $('image-rights').hidden = !$('poster').files[0] && !$('image').files[0]; });
window.addEventListener('pagehide', () => { if (previewUrl) URL.revokeObjectURL(previewUrl); });
$('next-button').addEventListener('click', () => { try { validateCurrentStep(); step++; showStep(); } catch (error) { $('form-status').textContent = error.message; } });
$('back-button').addEventListener('click', () => { step--; showStep(); });
$('submission-form').addEventListener('submit', async event => {
  event.preventDefault();
  try {
    if (!api) throw new Error('投稿服务暂不可用，请稍后再试');
    const { payload, file, poster } = collect();
    const form = new FormData();
    form.set('payload', JSON.stringify(payload));
    form.set('website', value('website'));
    if (file) form.set('image', file);
    if (poster) form.set('poster', poster);
    $('send-button').disabled = true;
    $('form-status').textContent = '正在提交…';
    const response = await fetch(api + '/api/submissions', { method: 'POST', body: form });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || '提交失败，请稍后再试');
    $('submission-form').hidden = true;
    $('success-panel').hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) { $('form-status').textContent = error.message; }
  finally { $('send-button').disabled = false; }
});
void init();
