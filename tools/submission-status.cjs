const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const RECEIPT_MARKER = '<!-- KDRAMA_PUBLICATION_STATUS_V1 -->';
const RETRY_MARKER = '<!-- KDRAMA_PUBLICATION_RETRY_V1 -->';
const LABELS = [
  ['publish-approved', '4A7C59', 'Maintainer-approved map submission'],
  ['needs-info', 'D4A72C', 'Submission needs more information'],
  ['published', '1A7F37', 'Successfully deployed to the public map'],
  ['publish-failed', 'CF222E', 'Publication failed; inspect the workflow and reapprove'],
];

function repositoryName(env = process.env) {
  const repository = env.GITHUB_REPOSITORY || '';
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) throw new Error('仓库标识无效');
  return repository;
}

function context(env = process.env) {
  const repository = repositoryName(env);
  const event = JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH, 'utf8'));
  const number = event.issue?.number;
  if (event.action !== 'labeled' || event.label?.name !== 'publish-approved' || !Number.isSafeInteger(number) || number < 1 || event.issue?.pull_request) {
    throw new Error('仅处理加上 publish-approved 标签的投稿 Issue');
  }
  return { repository, event, number, runUrl: `https://github.com/${repository}/actions/runs/${env.GITHUB_RUN_ID}`, output: env.GITHUB_OUTPUT };
}

function setOutput(file, name, value) {
  if (file) fs.appendFileSync(file, `${name}=${String(value).replace(/[\r\n]/g, ' ')}\n`);
}

function apiClient(token, request = fetch) {
  if (!token) throw new Error('缺少 GitHub 工作流凭据');
  return async (route, method = 'GET', data) => {
    const response = await request(`https://api.github.com${route}`, {
      method,
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', ...(data === undefined ? {} : { 'Content-Type': 'application/json' }) },
      ...(data === undefined ? {} : { body: JSON.stringify(data) }),
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) {
      const error = new Error(`GitHub 请求失败（${response.status}）：${method} ${route}`);
      error.status = response.status;
      throw error;
    }
    return response.status === 204 ? null : response.json();
  };
}

async function authorize(ctx, api) {
  const login = ctx.event.sender?.login;
  if (!login || !/^[A-Za-z0-9_[\]-]+$/.test(login)) throw new Error('无法识别审核操作者');
  const access = await api(`/repos/${ctx.repository}/collaborators/${encodeURIComponent(login)}/permission`);
  if (!['admin', 'maintain', 'write'].includes(access.permission) && !['admin', 'maintain', 'write'].includes(access.role_name)) {
    throw new Error('只有具有仓库写入或管理权限的维护者可以批准投稿');
  }
  // Emit in a separate successful step so later validation failures receive feedback.
  setOutput(ctx.output, 'authorized', 'true');
}

async function verifySnapshot(ctx, api, catalog) {
  const issue = await api(`/repos/${ctx.repository}/issues/${ctx.number}`);
  if (issue.pull_request || issue.number !== ctx.number) throw new Error('投稿 Issue 不存在');
  if (!(issue.labels || []).some(label => label.name === 'publish-approved')) throw new Error('审核通过标签已被移除，请重新审核后加标签');
  if (issue.state !== 'open') throw new Error('投稿已经关闭，请确认是否需要重新打开并审核');
  if ((issue.body || '') !== (ctx.event.issue.body || '')) throw new Error('投稿正文在批准后发生变化；请先重新核对，再移除并重新添加审核通过标签');
  const imported = catalog?.updates?.find(item => Number(item.issueNumber) === ctx.number);
  if (imported) {
    const bodyHash = crypto.createHash('sha256').update(ctx.event.issue.body || '').digest('hex');
    if (!imported.bodyHash || imported.bodyHash !== bodyHash) throw new Error('此 Issue 已导入，当前正文无法与已导入版本对应。请新建补充／更正投稿；相同正文的失败部署可以重新批准后重试。');
  }
  return issue;
}

async function ensureLabels(ctx, api) {
  for (const [name, color, description] of LABELS) {
    try { await api(`/repos/${ctx.repository}/labels/${encodeURIComponent(name)}`); }
    catch (error) {
      if (error.status !== 404) throw error;
      try { await api(`/repos/${ctx.repository}/labels`, 'POST', { name, color, description }); }
      catch (createError) { if (createError.status !== 422) throw createError; }
    }
  }
}

function loadCatalog(filename = path.join(__dirname, '..', 'data', 'catalog.js')) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), sandbox);
  return sandbox.window.KDRAMA_CATALOG;
}

function publishedLink(catalog, issueNumber, pageUrl) {
  const update = (catalog.updates || []).find(item => Number(item.issueNumber) === issueNumber);
  if (!update) throw new Error('未找到本次投稿的导入记录，不能标记为已发布');
  const url = new URL(pageUrl);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('部署地址无效');
  url.hash = update.landmarkId ? `place=${encodeURIComponent(update.landmarkId)}` : update.workId ? `work=${encodeURIComponent(update.workId)}` : 'explore';
  return url.href;
}

async function upsertBotComment(ctx, api, marker, body) {
  let found;
  for (let page = 1; ; page++) {
    const comments = await api(`/repos/${ctx.repository}/issues/${ctx.number}/comments?per_page=100&page=${page}`);
    const matches = comments.filter(comment => comment.user?.login === 'github-actions[bot]' && comment.user?.type === 'Bot' && comment.body?.startsWith(marker));
    if (matches.length) found = matches.at(-1);
    if (comments.length < 100) break;
  }
  if (found) return api(`/repos/${ctx.repository}/issues/comments/${found.id}`, 'PATCH', { body });
  return api(`/repos/${ctx.repository}/issues/${ctx.number}/comments`, 'POST', { body });
}

async function removeLabel(ctx, api, label) {
  try { await api(`/repos/${ctx.repository}/issues/${ctx.number}/labels/${encodeURIComponent(label)}`, 'DELETE'); }
  catch (error) { if (error.status !== 404) throw error; }
}

async function receipt(ctx, api, result, catalog, pageUrl) {
  const issue = await api(`/repos/${ctx.repository}/issues/${ctx.number}`);
  const sameApprovedBody = (issue.body || '') === (ctx.event.issue.body || '');
  await ensureLabels(ctx, api);
  if (result !== 'success' && (issue.labels || []).some(label => label.name === 'published')) {
    // A duplicate/stale approval must not undo an earlier successful publication.
    await upsertBotComment(ctx, api, RETRY_MARKER, `${RETRY_MARKER}\n本次重试未完成；此前已经发布的地点仍然有效。若要修改地图中的资料，请另建补充／更正投稿。\n\n[查看本次运行记录](${ctx.runUrl})`);
    if (sameApprovedBody) await removeLabel(ctx, api, 'publish-approved');
    return;
  }
  const succeeded = result === 'success';
  const link = succeeded ? publishedLink(catalog, ctx.number, pageUrl) : null;
  const approvedHash = crypto.createHash('sha256').update(ctx.event.issue.body || '').digest('hex');
  if (succeeded && (catalog.updates || []).find(item => Number(item.issueNumber) === ctx.number)?.bodyHash !== approvedHash) {
    throw new Error('部署记录与本次批准的正文版本不一致，不能写入成功回执');
  }
  const changedAfterApproval = succeeded && !sameApprovedBody;
  const body = succeeded
    ? `${RECEIPT_MARKER}\n<!-- status: published -->\n<!-- published-body-sha256: ${approvedHash} -->\n${changedAfterApproval
      ? '批准时的版本已发布到巡礼地图；Issue 后来修改的内容尚未发布。此 Issue 保持打开，供维护者核对；如需继续修改地图，请新建补充／更正投稿。'
      : '已审核并发布到巡礼地图。'}\n\n[打开对应地点或作品](${link}) · [查看发布记录](${ctx.runUrl})`
    : `${RECEIPT_MARKER}\n<!-- status: publish-failed -->\n这次发布未完成，投稿仍需维护者处理。\n\n请查看运行记录；如正文在批准后改动、缺少图片或检查未通过，请修正后重新添加 \`publish-approved\` 标签。无需新建重复投稿。\n\n[查看失败或中止的运行记录](${ctx.runUrl})`;
  // A published receipt is written only after the deployment job has succeeded.
  await upsertBotComment(ctx, api, RECEIPT_MARKER, body);
  await api(`/repos/${ctx.repository}/issues/${ctx.number}/labels`, 'POST', { labels: changedAfterApproval ? ['published', 'needs-info'] : [succeeded ? 'published' : 'publish-failed'] });
  // An older queued event must not revoke approval for a newer body.
  const obsoleteLabels = succeeded ? ['publish-failed', ...(changedAfterApproval ? [] : ['needs-info'])] : [];
  if (sameApprovedBody) obsoleteLabels.push('publish-approved');
  for (const label of obsoleteLabels) await removeLabel(ctx, api, label);
  const shouldClose = succeeded && !changedAfterApproval;
  await api(`/repos/${ctx.repository}/issues/${ctx.number}`, 'PATCH', { state: shouldClose ? 'closed' : 'open', ...(shouldClose ? { state_reason: 'completed' } : {}) });
}

async function main() {
  const mode = process.argv[2];
  const ctx = mode === 'labels' ? { repository: repositoryName() } : context();
  const api = apiClient(process.env.GH_TOKEN || process.env.GITHUB_TOKEN);
  if (mode === 'labels') await ensureLabels(ctx, api);
  else if (mode === 'authorize') await authorize(ctx, api);
  else if (mode === 'prepare') {
    await authorize(ctx, api);
    await verifySnapshot(ctx, api, loadCatalog());
    await ensureLabels(ctx, api);
    const target = path.join(process.env.RUNNER_TEMP || '.', 'kdrama-approved-issue.md');
    fs.writeFileSync(target, ctx.event.issue.body || '', 'utf8');
    setOutput(ctx.output, 'body_path', target);
  } else if (mode === 'verify') await verifySnapshot(ctx, api, loadCatalog());
  else if (mode === 'receipt') await receipt(ctx, api, process.env.PUBLICATION_RESULT, loadCatalog(), process.env.PAGE_URL);
  else throw new Error('用法：node tools/submission-status.cjs labels|authorize|prepare|verify|receipt');
}

module.exports = { authorize, verifySnapshot, ensureLabels, publishedLink, upsertBotComment, receipt, RECEIPT_MARKER, RETRY_MARKER };
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
