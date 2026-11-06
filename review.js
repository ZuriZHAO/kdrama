const $ = id => document.getElementById(id);
const start = '<!-- KDRAMA_SUBMISSION_V2_START -->';
const end = '<!-- KDRAMA_SUBMISSION_V2_END -->';
const fence = '```';
let beforeData = '';
let afterData = '';

function parseIssue(body) {
  const editable = /<!-- KDRAMA_SUBMISSION_V2_START -->\s*```json\s*\n([\s\S]{1,30000}?)\n```\s*<!-- KDRAMA_SUBMISSION_V2_END -->/.exec(body);
  if (editable) {
    const jsonStart = editable.index + editable[0].indexOf(editable[1]);
    return { payload: JSON.parse(editable[1]), before: body.slice(0, jsonStart), after: body.slice(jsonStart + editable[1].length) };
  }
  const old = /<!-- KDRAMA_SUBMISSION_V1:([A-Za-z0-9_-]{20,16000}) -->/.exec(body);
  if (!old) throw new Error('未找到本项目的投稿数据标记。');
  const base64 = old[1].replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  const payload = JSON.parse(new TextDecoder().decode(bytes));
  payload.version = 2;
  return {
    payload,
    before: body.slice(0, old.index) + `${start}\n${fence}json\n`,
    after: `\n${fence}\n${end}` + body.slice(old.index + old[0].length)
  };
}

function validate(payload, after) {
  if (!payload || typeof payload !== 'object' || payload.version !== 2) throw new Error('投稿版本必须为 2。');
  if (!['work','place','scene','correction'].includes(payload.kind)) throw new Error('投稿类型无效。');
  const filled = value => typeof value === 'string' && !!value.trim();
  const https = value => { try { return new URL(value).protocol === 'https:'; } catch { return false; } };
  if (payload.kind === 'work' && (!filled(payload.title) || !filled(payload.original))) throw new Error('作品需要中文名和韩文原名。');
  if (payload.kind === 'place' && (!filled(payload.name) || !filled(payload.workId) || !Number.isFinite(payload.lat) || !Number.isFinite(payload.lng))) throw new Error('新地点缺少名称、作品或坐标。');
  if (payload.kind === 'scene' && !filled(payload.landmarkId)) throw new Error('场景缺少所属地点。');
  if (payload.kind === 'correction' && (!filled(payload.landmarkId) || !filled(payload.reason) || !payload.changes || !Object.keys(payload.changes).length)) throw new Error('纠错缺少地点、原因或更正内容。');
  if (payload.kind !== 'work' && (!filled(payload.sourceTitle) || !https(payload.sourceUrl))) throw new Error('请填写有效的来源名称和 HTTPS 链接。');
  if (payload.kind === 'place' || payload.kind === 'scene') {
    if (!filled(payload.description)) throw new Error('场景描述不能为空。');
    if (payload.imageUrl && !https(payload.imageUrl)) throw new Error('图片链接必须使用 HTTPS。');
    if (payload.imageUrl || payload.imageAttachment) {
      if (payload.rightsConfirmed !== true || !filled(payload.imageCredit)) throw new Error('图片缺少展示许可声明或署名。');
      if (payload.imageAttachment && !/!\[[^\]\n]{0,200}\]\(https:\/\/(?:github\.com\/user-attachments\/assets\/[A-Za-z0-9-]{8,100}|user-images\.githubusercontent\.com\/\d+\/[A-Za-z0-9._/%-]+)\)/.test(after)) throw new Error('正文中未找到 GitHub 图片附件。');
    }
  }
}

$('review-load').addEventListener('click', () => {
  try {
    const result = parseIssue($('review-input').value);
    beforeData = result.before;
    afterData = result.after;
    $('review-json').value = JSON.stringify(result.payload, null, 2);
    $('review-summary').textContent = `类型：${result.payload.kind} · ${result.payload.name || result.payload.title || result.payload.landmarkId || '未命名'}`;
    $('review-editor').hidden = false;
    $('review-result').hidden = true;
    $('review-status').textContent = '已读取投稿；请核对来源、坐标和图片许可。';
  } catch (error) { $('review-status').textContent = `读取失败：${error.message}`; }
});

$('review-generate').addEventListener('click', () => {
  try {
    const payload = JSON.parse($('review-json').value);
    validate(payload, afterData);
    $('review-output').value = beforeData + JSON.stringify(payload, null, 2) + afterData;
    $('review-result').hidden = false;
    $('review-status').textContent = '检查通过。复制完整正文并保存到原 GitHub Issue，审核无误后再加发布标签。';
  } catch (error) { $('review-result').hidden = true; $('review-status').textContent = `检查失败：${error.message}`; }
});

$('review-copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('review-output').value);
    $('review-status').textContent = '已复制完整正文。';
  } catch {
    $('review-output').select();
    $('review-status').textContent = '浏览器未开放复制权限；已选中正文，请手动复制。';
  }
});
