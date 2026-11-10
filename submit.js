const $ = id => document.getElementById(id);
const catalog = window.KDRAMA_CATALOG || { works: [], landmarks: [], scenes: [], sources: [] };
const repo = /^[\w.-]+\/[\w.-]+$/.test(window.KDRAMA_REPO || '') ? window.KDRAMA_REPO : 'zurizhao/kdrama';
const params = new URLSearchParams(location.search);
const core = window.KdramaSubmission;
const works = catalog.works.slice();
const landmarks = catalog.landmarks.slice();
const draftKey = 'kdrama-submission-draft-v2';
const progressKey = 'kdrama-submission-issue';
const draftFields = ['kind','work-id','work-search','work-title','work-original','work-type','landmark-id','landmark-search','place-name','place-group','lat','lng','description','correction-name','correction-group','correction-lat','correction-lng','episode','time-seconds','source-url','source-title','image-credit','contributor'];
const workTypes = {drama:'电视剧', movie:'电影', variety:'综艺'};
let step = 0;
let previewUrl = '';
let workMatches = [];
let activeWorkIndex = -1;
let composing = false;
let saveTimer;
let draftDirty = false;
let progressRequest = 0;
let restoredFiles = {};
let savedDraft = null;
const landmarkLabels = new Map();

function value(id) { return $(id).value.trim(); }
function required(id, message) { const result = value(id); if (!result) throw new Error(message); return result; }
function normalize(text) { return String(text || '').normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ''); }
function optionalNumber(id, max) {
  const raw = value(id);
  if (raw === '') return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < (id === 'episode' ? 1 : 0) || n > max) throw new Error('集数或时间点格式不正确');
  return n;
}
function sourceUrl() {
  const raw = value('source-url');
  if (!raw) return '';
  try { const url = new URL(raw); if (url.protocol === 'https:' && !url.username && !url.password) return url.href; } catch {}
  throw new Error('资料来源请填写 HTTPS 链接');
}
function closeWorkResults() {
  $('work-results').hidden = true;
  $('work-search').setAttribute('aria-expanded', 'false');
  $('work-search').removeAttribute('aria-activedescendant');
  activeWorkIndex = -1;
}
function setActiveWork(index) {
  activeWorkIndex = index;
  [...$('work-results').children].forEach((node, i) => {
    node.setAttribute('aria-selected', String(i === index));
    node.classList.toggle('active', i === index);
  });
  if (index >= 0 && $('work-results').children[index]) {
    const active = $('work-results').children[index];
    $('work-search').setAttribute('aria-activedescendant', active.id);
    active.scrollIntoView({ block: 'nearest' });
  } else $('work-search').removeAttribute('aria-activedescendant');
}
function renderWorkResults() {
  const term = normalize(value('work-search'));
  const matched = works.filter(work => [work.title, work.original, ...(work.aliases || [])].some(text => normalize(text).includes(term)));
  workMatches = matched.slice(0, 20);
  $('work-results').replaceChildren(...workMatches.map((work, index) => {
    const option = document.createElement('div');
    option.id = `work-option-${index}`;
    option.className = 'work-option';
    option.setAttribute('role', 'option');
    option.setAttribute('aria-selected', 'false');
    const poster = document.createElement('span');
    poster.className = 'work-option-poster';
    if (typeof work.poster === 'string' && (/^https:\/\//.test(work.poster) || /^\.\/assets\//.test(work.poster))) {
      const image = document.createElement('img'); image.src = work.poster; image.alt = ''; image.loading = 'lazy'; poster.append(image);
    } else poster.textContent = (work.title || '').slice(0, 2);
    const text = document.createElement('span'); text.className = 'work-option-copy';
    const title = document.createElement('strong'); title.textContent = work.title || work.original;
    const original = document.createElement('small'); original.textContent = work.original || '';
    const meta = document.createElement('small'); meta.textContent = [work.year, workTypes[work.type] || '电视剧'].filter(Boolean).join(' · ');
    text.append(title, original, meta); option.append(poster, text);
    option.addEventListener('pointerdown', event => event.preventDefault());
    option.addEventListener('click', () => { selectWork(work.id); saveDraft(); });
    return option;
  }));
  $('work-results').hidden = workMatches.length === 0;
  $('work-search').setAttribute('aria-expanded', String(workMatches.length > 0));
  $('work-search-status').textContent = matched.length ? `找到 ${matched.length} 部作品${matched.length > 20 ? '，显示前 20 部，请输入更多文字缩小范围' : ''}` : '没有找到作品，可以在下方添加新作品。';
  setActiveWork(-1);
}
function selectWork(id) {
  const work = works.find(item => item.id === id);
  $('work-id').value = work || id === 'new' ? id : '';
  $('work-selection').hidden = !value('work-id');
  $('work-selection-text').textContent = id === 'new' ? '已选择：添加新作品' : work ? `已选择：${work.title || work.original} · ${work.original || ''}` : '';
  if (work) $('work-search').value = work.title || work.original;
  else if (id === 'new') $('work-search').value = '';
  closeWorkResults();
  $('work-search-status').textContent = '';
  showKind();
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
  const label = [...landmarkLabels].find(([, found]) => found === id)?.[0] || '';
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
  $('landmark-selection').textContent = id ? `已选择：${landmarks.find(place => place.id === id)?.name || text}` : '请从建议中选择一个已有地点。';
}
function showKind() {
  const kind = value('kind');
  $('work-fields').hidden = kind !== 'place';
  $('landmark-fields').hidden = kind === 'place';
  $('place-fields').hidden = kind !== 'place';
  $('update-fields').hidden = kind !== 'update';
  $('scene-label').textContent = kind === 'place' ? '剧中的场景' : '补充场景描述（可选）';
  $('new-work-fields').hidden = value('work-id') !== 'new' || kind !== 'place';
  updateFileNotice();
  updateImageRights();
}
function showStep(scroll = true) {
  document.querySelectorAll('.step-panel').forEach((panel, i) => { panel.hidden = i !== step; });
  document.querySelectorAll('.steps li').forEach((item, i) => { item.classList.toggle('active', i === step); });
  $('back-button').hidden = step === 0;
  $('next-button').hidden = step === 2;
  $('send-button').hidden = step !== 2;
  $('form-status').textContent = '';
  updateSummary();
  if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
}
function updateSummary() {
  const kind = value('kind');
  const work = works.find(item => item.id === value('work-id'));
  const place = landmarks.find(item => item.id === value('landmark-id'));
  $('review-summary').textContent = kind === 'place'
    ? `请检查：${work?.title || value('work-title') || value('work-original')} · ${value('place-name')} · 坐标 ${value('lat')}, ${value('lng')}`
    : `请检查：${place?.name || ''} · 补充／更正资料`;
}
function validateCurrentStep(atStep = step) {
  const kind = value('kind');
  if (atStep === 0) {
    if (kind === 'place') {
      const work = required('work-id', '请从搜索结果中选择作品');
      if (work !== 'new' && !works.some(item => item.id === work)) throw new Error('请选择有效作品');
      if (work === 'new' && !value('work-title') && !value('work-original')) throw new Error('新作品请填写中文名或韩文名');
    } else if (!landmarks.some(item => item.id === required('landmark-id', '请选择已有地点'))) throw new Error('请选择有效地点');
  }
  if (atStep === 1) {
    if (kind === 'place') {
      required('place-name', '请填写地点名称');
      const lat = Number(required('lat', '请填写地图纬度'));
      const lng = Number(required('lng', '请填写地图经度'));
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) throw new Error('纬度需在 -90～90、经度需在 -180～180 之间');
      // Scene description can be supplied per image in the next step.
    }
    for (const [id, limit] of [['correction-lat', 90], ['correction-lng', 180]]) {
      if (value(id) !== '' && (!Number.isFinite(Number(value(id))) || Math.abs(Number(value(id))) > limit)) throw new Error('更正坐标超出经纬度范围');
    }
    if (kind === 'update' && (value('correction-lat') !== '') !== (value('correction-lng') !== '')) throw new Error('更正坐标请同时填写经纬度');
  }
}
function collect() {
  if (value('website')) throw new Error('请刷新后重试。');
  validateCurrentStep(0); validateCurrentStep(1);
  const kind = value('kind');
  const link = sourceUrl();
  const payload = { kind, version: 2, sourceUrl: link, sourceTitle: value('source-title') || (link ? new URL(link).hostname : ''), contributor: value('contributor') };
  if (kind === 'place') Object.assign(payload, {
    workId: value('work-id'), newWork: value('work-id') === 'new' ? { title: value('work-title'), original: value('work-original'), type: value('work-type') } : null,
    name: value('place-name'), group: value('place-group'), lat: Number(value('lat')), lng: Number(value('lng')), description: value('description'),
    episode: optionalNumber('episode', 1000), timeSeconds: optionalNumber('time-seconds', 100000)
  });
  if (kind === 'update') {
    const changes = {};
    if (value('correction-name')) changes.name = value('correction-name');
    if (value('correction-group')) changes.group = value('correction-group');
    if (value('correction-lat') !== '') changes.lat = Number(value('correction-lat'));
    if (value('correction-lng') !== '') changes.lng = Number(value('correction-lng'));
    Object.assign(payload, { landmarkId: value('landmark-id'), description: value('description'), changes,
      episode: optionalNumber('episode', 1000), timeSeconds: optionalNumber('time-seconds', 100000) });
  }
  const files = KdramaImages.files(); const file = files[0];
  const poster = kind === 'place' && value('work-id') === 'new' ? $('poster').files[0] : null;
  if ((restoredFiles.image && !file) || (restoredFiles.poster && !poster && kind === 'place' && value('work-id') === 'new')) throw new Error('草稿中的图片需要重新选择；如不再使用，请点击“移除草稿图片提醒”。');
  if (kind === 'update' && !payload.description && !Object.keys(payload.changes).length && !file) throw new Error('请至少补充场景、图片或一项更正资料');
  for (const upload of [...files, poster].filter(Boolean)) {
    if (upload.size > 5000000 || !['image/jpeg', 'image/png', 'image/webp'].includes(upload.type)) throw new Error('图片仅支持 JPG、PNG、WebP，最大 5 MB');
    if (!$('rights-confirmed').checked) throw new Error('请确认图片展示许可');
  }
  if (file || poster) { payload.imageCredit = value('image-credit'); payload.rightsConfirmed = true; }
  payload.imageAttachment = false;
  if(files.length) payload.scenes = KdramaImages.payload();
  if(kind==='place'&&!payload.description&&!files.length)throw new Error('请填写场景描述或添加场景图片。');
  payload.posterAttachment = !!poster;
  return { payload, file, files, poster };
}
function markdownText(text) { return String(text ?? '').replace(/[\r\n]+/g, ' ').replace(/[\\`*_{}\[\]()#+.!|<>]/g, '\\$&'); }
function issueTitle(payload) {
  if (payload.kind === 'place') {
    const work = works.find(item => item.id === payload.workId);
    const title = work ? work.title : (payload.newWork && (payload.newWork.title || payload.newWork.original)) || '';
    return `[投稿·地点] ${title ? title + ' · ' : ''}${payload.name}`;
  }
  const place = landmarks.find(item => item.id === payload.landmarkId);
  return `[投稿·补充/更正] ${place ? place.name : payload.landmarkId}`;
}
function issueBody(payload) {
  const work = works.find(item => item.id === payload.workId);
  const place = landmarks.find(item => item.id === payload.landmarkId);
  const summary = payload.kind === 'place'
    ? `作品：${markdownText(work?.title || payload.newWork?.title || payload.newWork?.original)}\n\n地点：${markdownText(payload.name)}\n\n坐标：${payload.lat}, ${payload.lng}\n\n分组：${markdownText(payload.group || '未分组')}`
    : `地点：${markdownText(place?.name || payload.landmarkId)}\n\n补充／更正：${markdownText(payload.description || (Object.keys(payload.changes).length ? Object.keys(payload.changes).map(key => `${key} → ${payload.changes[key]}`).join('；') : '补充场景图片'))}`;
  let body = `## 投稿摘要\n\n${summary}\n\n请检查摘要，在下方对应区域附图后点击 **Submit new issue**。\n\n<details>\n<summary>供地图读取的投稿信息（请保留）</summary>\n\n<!-- KDRAMA_SUBMISSION_V2_START -->\n\`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\`\n<!-- KDRAMA_SUBMISSION_V2_END -->\n\n</details>`;
  for(const scene of payload.scenes||[])body += `\n\n## 场景 ${scene.key.slice(1)} 图片：${markdownText(scene.filename)}\n<!-- KDRAMA_SCENE_${scene.key}_START -->\n（将这张原图拖到这里，保留标记。地图会使用刚才设置的裁剪位置。）\n<!-- KDRAMA_SCENE_${scene.key}_END -->`;
  if (payload.imageAttachment) body += '\n\n## 场景图片\n<!-- KDRAMA_IMAGE_START -->\n（把场景图片拖到这里，替换这行文字。请保留上下两行标记，等待图片上传完成。）\n<!-- KDRAMA_IMAGE_END -->';
  if (payload.posterAttachment) body += '\n\n## 作品海报\n<!-- KDRAMA_POSTER_START -->\n（把作品海报拖到这里，替换这行文字。请保留上下两行标记，等待图片上传完成。）\n<!-- KDRAMA_POSTER_END -->';
  return body;
}
function updateImageRights() {
  const posterActive = value('kind') === 'place' && value('work-id') === 'new';
  $('image-rights').hidden = !KdramaImages.files().length && !(posterActive && $('poster').files[0]);
}
function updateFileNotice() {
  const pending = [restoredFiles.image ? `场景图片：${restoredFiles.image}` : '', restoredFiles.poster && value('kind') === 'place' && value('work-id') === 'new' ? `海报：${restoredFiles.poster}` : ''].filter(Boolean);
  $('draft-file-notice').hidden = pending.length === 0;
  $('draft-file-notice').replaceChildren();
  if (pending.length) {
    $('draft-file-notice').append(document.createTextNode(`草稿已记录文件名，但图片没有上传或保存在草稿中，请重新选择。${pending.join('；')}。 `));
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'text-button'; remove.textContent = '移除草稿图片提醒';
    remove.addEventListener('click', () => { restoredFiles = {}; updateFileNotice(); saveDraft(); });
    $('draft-file-notice').append(remove);
  }
}
function saveDraft() {
  clearTimeout(saveTimer);
  draftDirty = false;
  const fields = Object.fromEntries(draftFields.map(id => [id, $(id).value]));
  const files = { image: KdramaImages.files().map(f=>f.name).join('、') || restoredFiles.image || '', poster: $('poster').files[0]?.name || restoredFiles.poster || '' };
  try {
    localStorage.setItem(draftKey, JSON.stringify({version:2, fields, files, scenes:KdramaImages.draft(), step, savedAt:Date.now()}));
    $('draft-status').textContent = '文字草稿已保存在当前浏览器。';
    $('restore-draft').hidden = true;
  } catch { $('draft-status').textContent = '当前浏览器无法保存草稿，请保留此页面。'; }
}
function restoreDraft(draft) {
  if (!draft || draft.version !== 2 || !draft.fields || typeof draft.fields !== 'object') return false;
  $('success-panel').hidden = true;
  $('image').value = ''; $('poster').value = ''; KdramaImages.restore(draft.scenes);
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = ''; $('image-preview-img').removeAttribute('src'); $('image-preview').hidden = true;
  for (const id of draftFields) if (typeof draft.fields[id] === 'string') $(id).value = draft.fields[id];
  if (!['place','update'].includes(value('kind'))) $('kind').value = 'place';
  selectWork(value('work-id'));
  if (value('kind') === 'update') selectLandmark(value('landmark-id'));
  restoredFiles = {image: typeof draft.files?.image === 'string' ? draft.files.image : '', poster: typeof draft.files?.poster === 'string' ? draft.files.poster : ''};
  $('rights-confirmed').checked = false;
  step = Number.isInteger(draft.step) ? Math.max(0,Math.min(2,draft.step)) : 0;
  showKind(); showStep(false);
  $('draft-status').textContent = '已恢复文字草稿；有图片时请重新选择。';
  $('restore-draft').hidden = true;
  return true;
}
async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, {cache:'no-store', signal:controller.signal, headers:{Accept:'application/json'}});
    if (!response.ok) throw new Error(response.status === 404 ? '未找到这条投稿' : response.status === 403 || response.status === 429 ? '查询暂时受限，请稍后重试' : `请求失败（${response.status}）`);
    return await response.json();
  } finally { clearTimeout(timer); }
}
async function checkProgress() {
  const request = ++progressRequest;
  const button = $('check-progress');
  $('progress-issue-link').hidden = true; $('published-place-link').hidden = true;
  try {
    const number = core.parseIssueNumber(value('issue-number'), repo);
    if (!number) throw new Error('请填写本仓库的 Issue 链接或有效编号');
    button.disabled = true;
    $('progress-status').textContent = '正在查询投稿与线上发布记录…';
    const results = await Promise.allSettled([
      fetchJson(`https://api.github.com/repos/${repo}/issues/${number}`),
      fetchJson(new URL('./data/publication-status.json', location.href).href)
    ]);
    if (request !== progressRequest) return;
    const issueResult = results[0], publicationResult = results[1];
    const published = publicationResult.status === 'fulfilled' && Array.isArray(publicationResult.value.updates)
      ? publicationResult.value.updates.find(update => Number(update.issueNumber) === Number(number)) : null;
    if (issueResult.status === 'fulfilled' && issueResult.value.pull_request) throw new Error('这个编号是 Pull Request，请填写投稿 Issue 编号');
    if (published) {
      let sameVersion = null;
      if (/^[a-f0-9]{64}$/i.test(published.bodyHash || '') && issueResult.status === 'fulfilled' && typeof issueResult.value.body === 'string') {
        try {
          const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(issueResult.value.body));
          const bodyHash = [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2,'0')).join('');
          sameVersion = bodyHash === published.bodyHash.toLowerCase();
        } catch {}
      }
      if (request !== progressRequest) return;
      $('progress-status').textContent = sameVersion === true
        ? '已发布：这条投稿已出现在当前线上地图，内容与当前 Issue 正文一致。'
        : sameVersion === false
          ? '批准时的版本已发布；Issue 后续修改尚未发布，请另建补充投稿。'
          : '已发布：地图已有这条投稿的发布记录。当前 Issue 正文是否同步尚未确认。';
      $('published-place-link').href = published.landmarkId ? `./index.html#place=${encodeURIComponent(published.landmarkId)}` : published.workId ? `./index.html#work=${encodeURIComponent(published.workId)}` : './index.html';
      $('published-place-link').hidden = false;
    } else {
      if (issueResult.status !== 'fulfilled') throw issueResult.reason;
      const issue = issueResult.value;
      const payload = core.parseIssue(issue.body || '').payload;
      const missingScenes=(payload.scenes||[]).filter(s=>s.attachment&&!core.extractSceneImage(issue.body,s.key)).map(s=>'场景 '+s.key.slice(1));
      const missingImages = [...missingScenes,payload.imageAttachment && !core.extractImage(issue.body, 'image') ? '场景图片' : '', payload.posterAttachment && !core.extractImage(issue.body, 'poster') ? '作品海报' : ''].filter(Boolean);
      const labels = (issue.labels || []).map(label => typeof label === 'string' ? label : label.name);
      const publicUnavailable = publicationResult.status !== 'fulfilled';
      if (labels.includes('publish-failed')) $('progress-status').textContent = '发布失败：维护者正在处理，请在 GitHub 查看回执。';
      else if (missingImages.length) $('progress-status').textContent = `需要补充：尚未找到${missingImages.join('和')}，请在 GitHub 对应区域附图后保存。`;
      else if (labels.includes('needs-info')) $('progress-status').textContent = '需要补充：请在 GitHub 查看维护者的说明并更新投稿。';
      else if (labels.includes('publish-approved')) $('progress-status').textContent = '已批准，等待发布完成。可在 GitHub 回执中查看运行情况。';
      else if (issue.state === 'closed') $('progress-status').textContent = 'Issue 已关闭，尚未确认在地图发布。请查看 GitHub 上的处理说明。';
      else $('progress-status').textContent = '待审核：已收到 GitHub 投稿，等待维护者处理。';
      if (publicUnavailable) $('progress-status').textContent += ' 暂时无法读取线上发布记录，请稍后刷新确认。';
    }
    $('progress-issue-link').href = `https://github.com/${repo}/issues/${number}`;
    $('progress-issue-link').hidden = false;
    try { localStorage.setItem(progressKey, String(number)); } catch {}
  } catch (error) {
    if (request === progressRequest) $('progress-status').textContent = `无法确认进度：${error.name === 'AbortError' ? '网络请求超时，请稍后重试' : error.message}。`;
  } finally { if (request === progressRequest) button.disabled = false; }
}
function init() {
  updateLandmarkOptions();
  try { savedDraft = JSON.parse(localStorage.getItem(draftKey) || 'null'); } catch {}
  const hasContext = ['kind','workId','landmarkId','lat','lng'].some(key => params.has(key));
  if (!hasContext && restoreDraft(savedDraft)) {
    // Restored below before installing autosave listeners.
  } else {
    if (['update','scene','correction'].includes(params.get('kind'))) $('kind').value = 'update';
    if (params.has('workId')) selectWork(params.get('workId'));
    if (params.has('landmarkId')) selectLandmark(params.get('landmarkId'));
    $('lat').value = params.get('lat') ?? '';
    $('lng').value = params.get('lng') ?? '';
    showKind(); showStep(false);
    $('draft-status').textContent = hasContext && savedDraft ? '已带入地图位置。当前浏览器还有一份草稿，恢复后会替换当前表单。' : '填写后会自动保存文字草稿，图片需重新选择。';
    $('restore-draft').hidden = !savedDraft;
  }
  try { $('issue-number').value = localStorage.getItem(progressKey) || ''; } catch {}
}
$('work-search').addEventListener('compositionstart', () => { composing = true; });
$('work-search').addEventListener('compositionend', () => { composing = false; renderWorkResults(); });
$('work-search').addEventListener('input', () => { $('work-id').value = ''; $('work-selection').hidden = true; showKind(); if (!composing) renderWorkResults(); });
$('work-search').addEventListener('focus', renderWorkResults);
$('work-search').addEventListener('keydown', event => {
  if (event.isComposing || composing) return;
  if (event.key === 'Escape') { closeWorkResults(); return; }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    if ($('work-results').hidden) renderWorkResults();
    if (workMatches.length) setActiveWork(activeWorkIndex < 0 ? (event.key === 'ArrowDown' ? 0 : workMatches.length - 1) : (activeWorkIndex + (event.key === 'ArrowDown' ? 1 : -1) + workMatches.length) % workMatches.length);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    if (!$('work-results').hidden && activeWorkIndex >= 0 && workMatches[activeWorkIndex]) { selectWork(workMatches[activeWorkIndex].id); saveDraft(); }
  }
});
$('work-picker').addEventListener('focusout', event => { if (!$('work-picker').contains(event.relatedTarget)) closeWorkResults(); });
document.addEventListener('pointerdown', event => { if (!$('work-picker').contains(event.target)) closeWorkResults(); });
$('change-work').addEventListener('click', () => { selectWork(''); $('work-search').value = ''; $('work-search').focus(); renderWorkResults(); saveDraft(); });
$('add-new-work').addEventListener('click', () => { selectWork('new'); $('work-title').focus(); saveDraft(); });
$('kind').addEventListener('change', showKind);
$('landmark-search').addEventListener('input', resolveLandmark);
$('image').addEventListener('change', () => {
  try {KdramaImages.select([...$('image').files]);delete restoredFiles.image;$('form-status').textContent='';}
  catch(error){$('form-status').textContent=error.message;$('image').value='';KdramaImages.clear();}
  updateImageRights();updateFileNotice();saveDraft();
});
$('poster').addEventListener('change', () => { delete restoredFiles.poster; updateImageRights(); updateFileNotice(); saveDraft(); });
window.addEventListener('pagehide', event => { clearTimeout(saveTimer); if (draftDirty) saveDraft(); if (!event.persisted && previewUrl) URL.revokeObjectURL(previewUrl); });
$('next-button').addEventListener('click', () => { try { validateCurrentStep(); step++; showStep(); saveDraft(); } catch (error) { $('form-status').textContent = error.message; } });
$('back-button').addEventListener('click', () => { $('success-panel').hidden = true; step--; showStep(); saveDraft(); });
$('return-edit').addEventListener('click', () => { $('success-panel').hidden = true; step = 2; showStep(); $('submission-form').scrollIntoView({behavior:'smooth'}); });
$('restore-draft').addEventListener('click', () => { restoreDraft(savedDraft); });
$('clear-draft').addEventListener('click', () => {
  clearTimeout(saveTimer); draftDirty = false; $('submission-form').reset(); restoredFiles = {}; savedDraft = null; step = 0; KdramaImages.clear();
  if (previewUrl) URL.revokeObjectURL(previewUrl); previewUrl = ''; $('image-preview').hidden = true; $('image-preview-img').removeAttribute('src');
  selectWork(''); selectLandmark(''); showKind(); showStep(false); $('success-panel').hidden = true;
  try { localStorage.removeItem(draftKey); } catch {}
  $('draft-status').textContent = '草稿已清空。'; $('restore-draft').hidden = true;
});
$('check-progress').addEventListener('click', checkProgress);
$('issue-number').addEventListener('input', () => { progressRequest++; $('check-progress').disabled = false; $('progress-status').textContent = ''; $('progress-issue-link').hidden = true; $('published-place-link').hidden = true; });
$('issue-number').addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); checkProgress(); } });
$('copy-issue-body').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText($('issue-body-copy').value); $('copy-status').textContent = '已复制投稿正文。'; }
  catch { $('issue-body-copy').select(); $('copy-status').textContent = '已选中正文，请手动复制。'; }
});
$('submission-form').addEventListener('submit', event => {
  event.preventDefault();
  try {
    const { payload, file, files, poster } = collect();
    const title = issueTitle(payload), body = issueBody(payload);
    const params = new URLSearchParams({title}); if (body.length<5500)params.set('body',body);
    const url = `https://github.com/${repo}/issues/new?${params}`;
    $('github-issue-link').href = url; $('issue-title-copy').value = title; $('issue-body-copy').value = body;
    $('handoff-files').replaceChildren(...[...files.map((f,i)=>[f,'场景 '+(i+1)+' 图片']), [poster, '作品海报']].filter(([upload]) => upload).map(([upload, label]) => { const li = document.createElement('li'); li.textContent = `${label}：${upload.name}（请在 GitHub 的“${label}”区域附上）`; return li; }));
    $('handoff-image-note').hidden = !file && !poster;
    $('attachment-instruction').textContent = file || poster ? '把下列图片拖入对应区域，等待 GitHub 显示图片预览。' : '检查投稿摘要；这条投稿没有选择图片，可直接确认。';
    if(body.length>=5500)$('attachment-instruction').textContent='本次多图内容较长：请先复制下方完整正文，粘贴到 GitHub，再按编号附图。';
    $('success-panel').hidden = false; saveDraft();
    window.open(url, '_blank', 'noopener');
    $('success-panel').scrollIntoView({behavior:'smooth', block:'start'});
  } catch (error) { $('form-status').textContent = error.message; }
});
init();
$('submission-form').addEventListener('input', () => { $('success-panel').hidden = true; draftDirty = true; updateSummary(); clearTimeout(saveTimer); saveTimer = setTimeout(saveDraft, 350); });
$('submission-form').addEventListener('change', () => { $('success-panel').hidden = true; updateSummary(); updateImageRights(); saveDraft(); });
