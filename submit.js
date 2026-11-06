const $ = id => document.getElementById(id);
const catalog = window.KDRAMA_CATALOG || { works: [], landmarks: [], scenes: [], sources: [] };
const api = String(window.KDRAMA_SUBMISSION_API || '').replace(/\/$/, '');
const params = new URLSearchParams(location.search);
let step = 0;
let works = catalog.works.slice();
let landmarks = catalog.landmarks.slice();

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
  const term = value('work-search').toLocaleLowerCase();
  const previous = value('work-id');
  const filtered = works.filter(work => (work.title + ' ' + work.original).toLocaleLowerCase().includes(term));
  $('work-id').replaceChildren(new Option('请选择作品', ''), ...filtered.map(work => new Option(work.title, work.id)), new Option('＋ 没有这部剧？添加新作品', 'new'));
  if ([...$('work-id').options].some(option => option.value === previous)) $('work-id').value = previous;
  showKind();
}
function showKind() {
  const kind = value('kind');
  $('work-fields').hidden = kind !== 'place';
  $('landmark-fields').hidden = kind === 'place';
  $('place-fields').hidden = kind !== 'place';
  $('scene-fields').hidden = kind === 'correction';
  $('scene-details').hidden = kind === 'correction';
  $('correction-fields').hidden = kind !== 'correction';
  $('image-fields').hidden = kind === 'correction';
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
      : `请检查：${place?.name || ''} · ${kind === 'scene' ? '补充场景' : '纠正资料'}`;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function validateCurrentStep() {
  const kind = value('kind');
  if (step === 0) {
    if (kind === 'place') {
      const work = required('work-id', '请选择作品');
      if (work === 'new') { required('work-title', '请填写作品中文名'); required('work-original', '请填写韩文原名'); }
    } else required('landmark-id', '请选择已有地点');
  }
  if (step === 1) {
    if (kind === 'place') {
      required('place-name', '请填写地点名称');
      const lat = Number(required('lat', '请填写地图纬度'));
      const lng = Number(required('lng', '请填写地图经度'));
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < 33 || lat > 39 || lng < 124 || lng > 132) throw new Error('请填写韩国境内的地图坐标');
    }
    if (kind === 'correction') {
      required('reason', '请说明现有资料哪里不对');
      if (!value('correction-name') && !value('correction-lat') && !value('correction-lng')) throw new Error('请至少填写一项正确资料');
    } else required('description', '请描述剧中的场景');
  }
}
function collect() {
  const kind = value('kind');
  const link = sourceUrl();
  const payload = { kind, sourceUrl: link, sourceTitle: value('source-title') || (link ? new URL(link).hostname : ''), contributor: value('contributor') };
  if (kind === 'place') Object.assign(payload, {
    workId: value('work-id'), newWork: value('work-id') === 'new' ? { title: value('work-title'), original: value('work-original') } : null,
    name: value('place-name'), lat: Number(value('lat')), lng: Number(value('lng')), description: value('description'),
    episode: optionalNumber('episode', 1000), timeSeconds: optionalNumber('time-seconds', 100000)
  });
  if (kind === 'scene') Object.assign(payload, { landmarkId: value('landmark-id'), description: value('description'),
    episode: optionalNumber('episode', 1000), timeSeconds: optionalNumber('time-seconds', 100000) });
  if (kind === 'correction') {
    const changes = {};
    if (value('correction-name')) changes.name = value('correction-name');
    if (value('correction-lat')) changes.lat = Number(value('correction-lat'));
    if (value('correction-lng')) changes.lng = Number(value('correction-lng'));
    Object.assign(payload, { landmarkId: value('landmark-id'), reason: value('reason'), changes });
  }
  const file = $('image').files[0];
  if (file && kind !== 'correction') {
    if (file.size > 5000000 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('图片仅支持 JPG、PNG、WebP，最大 5 MB');
    if (!$('rights-confirmed').checked || !value('image-credit')) throw new Error('请确认图片展示许可并填写署名');
    payload.imageCredit = value('image-credit');
    payload.rightsConfirmed = true;
  }
  return { payload, file };
}
async function loadApproved() {
  if (!api) return;
  try {
    const response = await fetch(api + '/api/catalog');
    if (!response.ok) return;
    const data = await response.json();
    works = works.concat(data.works || []);
    landmarks = landmarks.concat(data.landmarks || []);
  } catch {}
}
async function init() {
  await loadApproved();
  $('landmark-id').replaceChildren(new Option('请选择地点', ''), ...landmarks.map(place => new Option(`${place.name} · ${works.find(work => work.id === place.workId)?.title || ''}`, place.id)));
  updateOptions();
  if (['scene', 'correction'].includes(params.get('kind'))) $('kind').value = params.get('kind');
  if (params.has('workId') && works.some(work => work.id === params.get('workId'))) $('work-id').value = params.get('workId');
  if (params.has('landmarkId') && landmarks.some(place => place.id === params.get('landmarkId'))) $('landmark-id').value = params.get('landmarkId');
  $('lat').value = params.get('lat') || '';
  $('lng').value = params.get('lng') || '';
  showKind();
  showStep();
}
$('work-search').addEventListener('input', updateOptions);
$('work-id').addEventListener('change', showKind);
$('kind').addEventListener('change', showKind);
$('image').addEventListener('change', () => { $('image-rights').hidden = !$('image').files.length; });
$('next-button').addEventListener('click', () => { try { validateCurrentStep(); step++; showStep(); } catch (error) { $('form-status').textContent = error.message; } });
$('back-button').addEventListener('click', () => { step--; showStep(); });
$('submission-form').addEventListener('submit', async event => {
  event.preventDefault();
  try {
    if (!api) throw new Error('投稿服务暂不可用，请稍后再试');
    const { payload, file } = collect();
    const form = new FormData();
    form.set('payload', JSON.stringify(payload));
    form.set('website', value('website'));
    if (file) form.set('image', file);
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