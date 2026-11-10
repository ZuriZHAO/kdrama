const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { authorize, verifySnapshot, publishedLink, receipt, RECEIPT_MARKER, RETRY_MARKER } = require('./submission-status.cjs');

const ctx = {
  repository: 'owner/map', number: 42, runUrl: 'https://github.com/owner/map/actions/runs/100',
  event: { sender: { login: 'editor' }, issue: { body: 'approved body' } },
};
const approvedHash = crypto.createHash('sha256').update('approved body').digest('hex');
const catalog = { updates: [{ issueNumber: 42, landmarkId: 'issue-42-place', workId: 'a-work', bodyHash: approvedHash }] };
const approvedIssue = () => ({ number: 42, body: 'approved body', state: 'open', labels: [{ name: 'publish-approved' }] });

function fakeGitHub(issue = approvedIssue(), comments = []) {
  const calls = [];
  const labels = new Set(['publish-approved', 'needs-info', 'published', 'publish-failed']);
  const api = async (route, method = 'GET', data) => {
    calls.push({ route, method, data });
    if (route.includes('/collaborators/')) return { permission: 'write' };
    if (/\/labels\/[^/]+$/.test(route) && !route.includes('/issues/')) {
      const name = decodeURIComponent(route.split('/').at(-1));
      if (labels.has(name)) return { name };
      throw Object.assign(new Error('not found'), { status: 404 });
    }
    if (route === '/repos/owner/map/labels' && method === 'POST') { labels.add(data.name); return data; }
    if (route === '/repos/owner/map/issues/42') {
      if (method === 'PATCH') Object.assign(issue, data);
      return issue;
    }
    if (route.includes('/issues/42/comments?')) return comments;
    if (route === '/repos/owner/map/issues/42/comments' && method === 'POST') {
      const comment = { id: comments.length + 1, user: { login: 'github-actions[bot]', type: 'Bot' }, body: data.body };
      comments.push(comment);
      return comment;
    }
    if (route.includes('/issues/comments/') && method === 'PATCH') {
      const id = Number(route.split('/').at(-1));
      const comment = comments.find(item => item.id === id);
      comment.body = data.body;
      return comment;
    }
    if (route === '/repos/owner/map/issues/42/labels' && method === 'POST') {
      for (const name of data.labels) if (!issue.labels.some(item => item.name === name)) issue.labels.push({ name });
      return issue.labels;
    }
    if (route.includes('/issues/42/labels/') && method === 'DELETE') {
      const name = decodeURIComponent(route.split('/').at(-1));
      issue.labels = issue.labels.filter(item => item.name !== name);
      return null;
    }
    throw new Error(`Unexpected API request: ${method} ${route}`);
  };
  return { api, issue, comments, calls };
}

async function main() {
  await authorize(ctx, fakeGitHub().api);
  await assert.rejects(() => authorize(ctx, async () => ({ permission: 'read' })), /维护者/);
  await assert.rejects(() => verifySnapshot(ctx, fakeGitHub({ ...approvedIssue(), body: 'edited afterwards' }).api), /正文在批准后发生变化/);
  await assert.rejects(() => verifySnapshot(ctx, fakeGitHub({ ...approvedIssue(), labels: [] }).api), /标签已被移除/);
  await assert.rejects(() => verifySnapshot(ctx, fakeGitHub({ ...approvedIssue(), state: 'closed' }).api), /投稿已经关闭/);
  await assert.rejects(() => verifySnapshot(ctx, fakeGitHub().api, { updates: [{ issueNumber: 42 }] }), /已导入/);
  await assert.rejects(() => verifySnapshot(ctx, fakeGitHub().api, { updates: [{ issueNumber: 42, bodyHash: 'different' }] }), /已导入/);
  await verifySnapshot(ctx, fakeGitHub().api, { updates: [{ issueNumber: 42, bodyHash: crypto.createHash('sha256').update('approved body').digest('hex') }] });
  assert.equal(publishedLink(catalog, 42, 'https://owner.github.io/map/'), 'https://owner.github.io/map/#place=issue-42-place');
  assert.throws(() => publishedLink(catalog, 99, 'https://owner.github.io/map/'), /未找到/);
  assert.throws(() => publishedLink(catalog, 42, 'javascript:alert(1)'), /部署地址/);

  const success = fakeGitHub();
  await receipt(ctx, success.api, 'success', catalog, 'https://owner.github.io/map/');
  assert.equal(success.issue.state, 'closed');
  assert(success.issue.labels.some(label => label.name === 'published'));
  assert(!success.issue.labels.some(label => ['publish-approved', 'publish-failed', 'needs-info'].includes(label.name)));
  assert(success.comments[0].body.startsWith(RECEIPT_MARKER));
  assert(success.comments[0].body.includes('#place=issue-42-place'));
  await receipt(ctx, success.api, 'success', catalog, 'https://owner.github.io/map/');
  assert.equal(success.comments.length, 1, 'retry updates the existing bot receipt');
  await receipt(ctx, success.api, 'failure', catalog, 'https://owner.github.io/map/');
  assert.equal(success.issue.state, 'closed', 'failed repeat does not reopen a published submission');
  assert(success.issue.labels.some(label => label.name === 'published'));
  assert(success.comments.some(comment => comment.body.startsWith(RETRY_MARKER)));
  assert(!success.issue.labels.some(label => label.name === 'publish-failed'));

  const changed = fakeGitHub({ ...approvedIssue(), body: 'new unapproved version' });
  await receipt(ctx, changed.api, 'success', catalog, 'https://owner.github.io/map/');
  assert.equal(changed.issue.state, 'open', 'a post-approval edit is not closed as though it was published');
  assert(changed.issue.labels.some(label => label.name === 'published'));
  assert(changed.issue.labels.some(label => label.name === 'needs-info'));
  assert(changed.issue.labels.some(label => label.name === 'publish-approved'), 'old success does not revoke a later approval');
  assert(!changed.issue.labels.some(label => label.name === 'publish-failed'));
  assert(changed.comments[0].body.includes('后来修改的内容尚未发布'));
  assert(changed.comments[0].body.includes(`published-body-sha256: ${approvedHash}`));
  await assert.rejects(() => receipt(ctx, fakeGitHub().api, 'success', { updates: [{ issueNumber: 42, landmarkId: 'issue-42-place', bodyHash: 'another version' }] }, 'https://owner.github.io/map/'), /版本不一致/);

  const failed = fakeGitHub();
  await receipt(ctx, failed.api, 'skipped', catalog, '');
  assert.equal(failed.issue.state, 'open');
  assert(failed.issue.labels.some(label => label.name === 'publish-failed'));
  assert(!failed.issue.labels.some(label => label.name === 'publish-approved'));
  assert(!failed.comments[0].body.includes('status: published'));
  assert(failed.comments[0].body.includes('status: publish-failed'));

  const queued = fakeGitHub({ ...approvedIssue(), body: 'newly approved replacement' });
  await receipt(ctx, queued.api, 'failure', catalog, '');
  assert(queued.issue.labels.some(label => label.name === 'publish-approved'), 'failed old event does not revoke a new body approval');
  queued.issue.labels.push({ name: 'published' });
  await receipt(ctx, queued.api, 'failure', catalog, '');
  assert(queued.issue.labels.some(label => label.name === 'publish-approved'), 'published retry guard also preserves later approval');

  const forged = fakeGitHub(approvedIssue(), [{ id: 50, body: RECEIPT_MARKER + '\nforged', user: { login: 'visitor', type: 'User' } }]);
  await receipt(ctx, forged.api, 'success', catalog, 'https://owner.github.io/map/');
  assert.equal(forged.comments[0].body, RECEIPT_MARKER + '\nforged');
  assert.equal(forged.comments.length, 2);
  console.log('发布权限、批准正文快照、幂等重试、成功/失败回执检查通过');
}

void main().catch(error => { console.error(error); process.exitCode = 1; });
