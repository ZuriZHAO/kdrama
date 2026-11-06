const $ = id => document.getElementById(id);
const catalog = window.KDRAMA_CATALOG;
const params = new URLSearchParams(location.search);
const setStatus = message => { $('form-status').textContent = message; };

function detectRepository() {
  const configured = String(window.KDRAMA_GITHUB_REPO || '').trim();
  if (/^[\w.-]+\/[\w.-]+$/.test(configured)) return configured;
  const saved = localStorage.getItem('kdrama-repository') || '';
  if (/^[\w.-]+\/[\w.-]+$/.test(saved)) return saved;
  const match = /^([\w-]+)\.github\.io$/i.exec(location.hostname);
  if (!match) return '';
  const segment = location.pathname.split('/').filter(Boolean)[0];
  return `${match[1]}/${segment && !segment.includes('.') ? segment : `${match[1]}.github.io`}`;
}

function repository() {
  const input = $('repo-input').value.trim();
  if (/^[\w.-]+\/[\w.-]+$/.test(input)) {
    localStorage.setItem('kdrama-repository', input);
    return input;
  }
  return detectRepository();
}

function showFields() {
  const kind = $('kind').value;
  const groups = {
    'work-select-fields': kind === 'place',
    'work-only-fields': kind === 'work',
    'place-fields': kind === 'place',
    'existing-place-fields': kind === 'scene' || kind === 'correction',
    'correction-fields': kind === 'correction',
    'scene-fields': kind === 'place' || kind === 'scene'
  };
  for (const [id, visible] of Object.entries(groups)) { $(id).hidden = !visible; $(id).disabled = !visible; }
  $('new-work-fields').hidden = kind !== 'place' || $('work-id').value !== 'new';
  const attaching = $('image-attach').checked;
  if (attaching) $('image-url').value = '';
  $('image-url').disabled = attaching || !groups['scene-fields'];
  $('image-rights').hidden = !($('image-url').value.trim() || attaching);
  if (kind === 'correction') populateCorrection();
}

function populateCorrection() {
  const place = catalog?.landmarks.find(item => item.id === $('landmark-id').value);
  const fields = { name:'correction-name', ko:'correction-ko', city:'correction-city', lat:'correction-lat', lng:'correction-lng', address:'correction-address', visit:'correction-visit' };
  for (const [key, id] of Object.entries(fields)) $(id).value = place?.[key] ?? '';
}

function required(id, label, max = 1000) {
  const value = $(id).value.trim();
  if (!value || value.length > max) throw new Error(`请填写${label}`);
  return value;
}
const optional = id => $(id).value.trim() || null;
function httpsUrl(value, label) {
  try { if (new URL(value).protocol === 'https:') return value; } catch {}
  throw new Error(`${label}必须是 HTTPS 链接`);
}
function number(id, label, min, max) {
  const value = Number(required(id, label));
  if (!Number.isFinite(value) || value < min || value > max) throw new Error(`${label}超出范围`);
  return value;
}
function optionalInteger(id, label, min, max) {
  const raw = optional(id);
  if (raw === null) return null;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${label}无效`);
  return value;
}

function collect() {
  const kind = $('kind').value;
  const payload = { version: 2, kind, contributor: optional('contributor') };
  if (kind === 'work') {
    Object.assign(payload, { title:required('only-title','作品中文名',120), original:required('only-original','韩文原名',120), year:optional('only-year') });
    return payload;
  }
  if (kind === 'correction') {
    const landmarkId = required('landmark-id', '已有地点');
    const place = catalog.landmarks.find(item => item.id === landmarkId);
    if (!place) throw new Error('请选择已有地点');
    const fields = { name:['correction-name',120], ko:['correction-ko',120], city:['correction-city',100], address:['correction-address',240], visit:['correction-visit',500] };
    const changes = {};
    for (const [key, [id, max]] of Object.entries(fields)) {
      const value = $(id).value.trim();
      if (value.length > max) throw new Error(`${key}过长`);
      if (value !== String(place[key] ?? '').trim()) changes[key] = value;
    }
    const lat = number('correction-lat','纬度',-90,90);
    const lng = number('correction-lng','经度',-180,180);
    if (lat !== place.lat || lng !== place.lng) Object.assign(changes, { lat, lng });
    if (!Object.keys(changes).length) throw new Error('请至少修改一项地点资料');
    Object.assign(payload, {
      landmarkId, changes, reason:required('correction-reason','更正原因',800),
      sourceTitle:required('correction-source-title','依据名称',160),
      sourceUrl:httpsUrl(required('correction-source-url','依据链接',1000),'依据链接')
    });
    return payload;
  }
  Object.assign(payload, {
    description:required('description','场景描述',800),
    episode:optionalInteger('episode','集数',1,1000), timeSeconds:optionalInteger('time-seconds','时间点',0,100000),
    sourceTitle:required('source-title','来源名称',160), sourceUrl:httpsUrl(required('source-url','来源链接',1000),'来源链接')
  });
  const imageUrl = optional('image-url');
  const imageAttachment = $('image-attach').checked;
  if (imageUrl || imageAttachment) {
    if (!$('rights-confirmed').checked) throw new Error('请确认图片使用许可');
    payload.imageUrl = imageUrl ? httpsUrl(imageUrl,'图片链接') : null;
    payload.imageAttachment = imageAttachment;
    payload.imageCredit = required('image-credit','图片署名',160);
    payload.rightsConfirmed = true;
  } else { payload.imageUrl = null; payload.imageAttachment = false; payload.imageCredit = null; payload.rightsConfirmed = false; }
  if (kind === 'place') {
    payload.workId = required('work-id','所属作品');
    if (payload.workId === 'new') {
      payload.newWork = {title:required('work-title','新作品中文名',120), original:required('work-original','新作品韩文原名',120), year:optional('work-year')};
    }
    Object.assign(payload, {
      name:required('place-name','中文地名',120), ko:optional('place-ko'), city:optional('place-city'),
      lat:number('lat','纬度',-90,90), lng:number('lng','经度',-180,180),
      address:optional('address'), visit:optional('visit')
    });
  } else if (kind === 'scene') payload.landmarkId = required('landmark-id','已有地点');
  return payload;
}

function issueText(payload) {
  const summary = value => String(value || '未填写').replace(/[\r\n]+/g, ' ');
  const title = payload.kind === 'work' ? `[作品投稿] ${payload.title}`
    : payload.kind === 'scene' ? `[场景投稿] ${payload.landmarkId}`
      : payload.kind === 'correction' ? `[地点纠错] ${payload.landmarkId}` : `[地标投稿] ${payload.name}`;
  const lines = [
    '## 韩剧圣地巡礼投稿',
    `- 类型：${payload.kind}`,
    `- 投稿人：${summary(payload.contributor)}`,
    `- 作品：${summary(payload.kind === 'work' ? payload.title : payload.newWork?.title || payload.workId || payload.landmarkId)}`,
    `- 地点：${summary(payload.name)}`,
    `- 坐标：${payload.lat ?? '未填写'}, ${payload.lng ?? '未填写'}`,
    `- 场景：${summary(payload.description)}`,
    `- 来源：${summary(payload.sourceUrl)}`,
    `- 图片：${payload.imageAttachment ? '将在本 Issue 附图' : summary(payload.imageUrl)}`,
    ...(payload.kind === 'correction' ? [`- 更正内容：${summary(JSON.stringify(payload.changes))}`, `- 更正原因：${summary(payload.reason)}`] : []),
    '',
    '上方摘要便于阅读；下方 JSON 才是发布依据。维护者可在审核时直接编辑 JSON 字段；确认后添加 `publish-approved` 标签。',
    '',
    '<!-- KDRAMA_SUBMISSION_V2_START -->',
    '```json',
    JSON.stringify(payload, null, 2),
    '```',
    '<!-- KDRAMA_SUBMISSION_V2_END -->',
    ...(payload.imageAttachment ? ['', '## 投稿图片', '请把图片拖入本段下方；提交前确认出现图片预览。第一张图片用于地图展示。'] : [])
  ];
  return { title, body: lines.join('\n') };
}

function initialize() {
  if (!catalog) { $('repo-status').textContent = '作品目录未加载，请刷新页面。'; return; }
  $('work-id').replaceChildren(new Option('请选择作品', ''), ...catalog.works.map(work => new Option(work.title, work.id)), new Option('＋ 投稿新作品', 'new'));
  $('landmark-id').replaceChildren(new Option('请选择地点', ''), ...catalog.landmarks.map(place => new Option(`${place.name} · ${catalog.works.find(work => work.id === place.workId)?.title || ''}`, place.id)));
  if (params.has('workId') && catalog.works.some(work => work.id === params.get('workId'))) $('work-id').value = params.get('workId');
  if (['scene','correction'].includes(params.get('kind')) && catalog.landmarks.some(place => place.id === params.get('landmarkId'))) {
    $('kind').value = params.get('kind');
    $('landmark-id').value = params.get('landmarkId');
  }
  $('lat').value = params.get('lat') || '';
  $('lng').value = params.get('lng') || '';
  const repo = detectRepository();
  $('repo-input').value = repo;
  $('repo-settings').hidden = !!repo;
  $('repo-status').textContent = repo ? `投稿仓库：${repo}` : '本地预览时请先填写 GitHub 仓库；发布到 GitHub Pages 后可自动识别。';
  showFields();
}

$('kind').addEventListener('change', showFields);
$('work-id').addEventListener('change', showFields);
$('landmark-id').addEventListener('change', () => { if ($('kind').value === 'correction') populateCorrection(); });
$('image-url').addEventListener('input', showFields);
$('image-attach').addEventListener('change', showFields);
$('submission-form').addEventListener('submit', event => {
  event.preventDefault();
  try {
    const repo = repository();
    if (!repo) { $('repo-settings').hidden = false; $('repo-settings').open = true; throw new Error('请先填写 GitHub 仓库 owner/repo'); }
    const payload = collect();
    const issue = issueText(payload);
    const base = `https://github.com/${repo}/issues/new`;
    const url = `${base}?${new URLSearchParams({title:issue.title,body:issue.body})}`;
    $('issue-body').value = issue.body;
    $('manual-link').href = url.length < 7500 ? url : base;
    $('manual-submission').hidden = false;
    if (url.length >= 7500) return setStatus('内容较长，请复制下方投稿内容，再到 GitHub Issue 页面粘贴提交。');
    window.open(url, '_blank', 'noopener');
    setStatus('请在新打开的 GitHub 页面登录并点击“Submit new issue”；当前网页不会自动发布。');
  } catch (error) { setStatus(error.message); }
});
initialize();
