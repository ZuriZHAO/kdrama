const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'kdrama-flow-'));
const catalogFile = path.join(temp, 'catalog.js');
const issueFile = path.join(temp, 'issue.md');
const initial = fs.readFileSync(path.join(root, 'data', 'catalog.js'), 'utf8');
fs.writeFileSync(catalogFile, initial);

function run(payload, issueNumber, extra = '') {
  const body = payload.version === 2
    ? `投稿资料\n\n<!-- KDRAMA_SUBMISSION_V2_START -->\n\`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\`\n<!-- KDRAMA_SUBMISSION_V2_END -->\n${extra}`
    : `投稿资料\n\n<!-- KDRAMA_SUBMISSION_V1:${Buffer.from(JSON.stringify(payload)).toString('base64url')} -->\n`;
  fs.writeFileSync(issueFile, body);
  return spawnSync(process.execPath, [path.join(root, 'tools', 'import-issue.cjs'), issueFile, String(issueNumber), catalogFile], { encoding: 'utf8' });
}

function read() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(catalogFile, 'utf8'), context);
  return context.window.KDRAMA_CATALOG;
}

try {
  const base = read();
  const payload = {
    version: 1, kind: 'place', contributor: '测试投稿者', workId: 'new',
    newWork: { title: '测试剧', original: '테스트', year: '2026' },
    name: '测试取景地', ko: '테스트 장소', city: '首尔', lat: 37.5, lng: 127,
    address: '서울', visit: null, description: '主角在这里相遇', episode: null,
    timeSeconds: null, sourceTitle: '测试资料', sourceUrl: 'https://example.org/source',
    imageUrl: 'https://example.org/photo.jpg', imageCredit: '测试作者', rightsConfirmed: true
  };
  assert.equal(run(payload, 9001).status, 0, '合法投稿应成功导入');
  let catalog = read();
  assert.equal(catalog.works.length, base.works.length + 1);
  assert.equal(catalog.landmarks.length, base.landmarks.length + 1);
  assert.equal(catalog.scenes.length, base.scenes.length + 1);
  assert.equal(catalog.landmarks.at(-1).coordinateStatus, 'approximate');
  assert.equal(catalog.scenes.at(-1).image, payload.imageUrl);
  assert.equal(run(payload, 9001).status, 0, '同一 Issue 重试应可跳过');
  assert.equal(read().scenes.length, base.scenes.length + 1);

  const correction = {
    version: 1, kind: 'correction', landmarkId: 'issue-9001-place',
    changes: { lat: 37.51, lng: 127.01, address: '서울 새 주소' },
    reason: '依据公开地址更正点位', sourceTitle: '更正依据', sourceUrl: 'https://example.org/new-address'
  };
  assert.equal(run(correction, 9003).status, 0, '合法更正应成功导入');
  catalog = read();
  const corrected = catalog.landmarks.find(place => place.id === correction.landmarkId);
  assert.equal(corrected.lat, correction.changes.lat);
  assert.equal(corrected.coordinateStatus, 'approximate');
  assert.equal(catalog.revisions.at(-1).reason, correction.reason);
  assert.equal(run(correction, 9003).status, 0, '更正 Issue 重试应可跳过');
  assert.equal(read().revisions.length, 1);

  const reviewed = { ...correction, version: 2, changes: { visit: '审核后补充的开放提示' }, reason: '维护者核对后修订说明' };
  assert.equal(run(reviewed, 9005).status, 0, '可编辑 JSON 投稿应成功导入');
  assert.equal(read().landmarks.find(place => place.id === correction.landmarkId).visit, reviewed.changes.visit);
  assert.equal(read().revisions.length, 2);

  const attachment = {
    version: 2, kind: 'scene', landmarkId: correction.landmarkId,
    description: '审核通过的附件场景', episode: null, timeSeconds: null,
    sourceTitle: '附件场景来源', sourceUrl: 'https://example.org/scene',
    imageUrl: null, imageAttachment: true, imageCredit: '投稿作者', rightsConfirmed: true
  };
  const imageUrl = 'https://github.com/user-attachments/assets/12345678-1234-1234-1234-123456789012';
  assert.equal(run(attachment, 9007, `\n## 投稿图片\n![Image](${imageUrl})\n`).status, 0, 'GitHub Issue 图片附件应导入');
  assert.equal(read().scenes.at(-1).image, imageUrl);

  const imageOnly = { ...attachment, kind: 'update', description: '', changes: {}, episode: null, sourceUrl: '' };
  assert.equal(run(imageOnly, 9009, `\n<!-- KDRAMA_IMAGE_START -->\n![Image](${imageUrl})\n<!-- KDRAMA_IMAGE_END -->\n`).status, 0, '仅补充图片应成功导入');
  catalog = read();
  assert.equal(catalog.scenes.at(-1).description, '');
  assert.equal(catalog.scenes.at(-1).image, imageUrl);
  assert.equal(catalog.updates.at(-1).workId, catalog.landmarks.find(place => place.id === correction.landmarkId).workId, '近期更新应关联作品');
  assert.ok(catalog.updates.at(-1).reviewedAt, '近期更新应记录审核时间');

  const poster = { ...payload, version: 2, workId: 'new', newWork: { title: '海报测试电影', original: '포스터 테스트', type: 'movie' }, imageUrl: null, imageAttachment: false, posterAttachment: true };
  assert.equal(run(poster, 9010, `\n<!-- KDRAMA_POSTER_START -->\n![Poster](${imageUrl})\n<!-- KDRAMA_POSTER_END -->\n`).status, 0, '新作品海报附件应导入');
  assert.equal(read().works.at(-1).poster, imageUrl);
  assert.equal(read().works.at(-1).type, 'movie', '新作品的电影类型应保留');

  const before = fs.readFileSync(catalogFile, 'utf8');
  assert.notEqual(run({ ...poster, rightsConfirmed: false }, 9011, `\n<!-- KDRAMA_POSTER_START -->\n![Poster](${imageUrl})\n<!-- KDRAMA_POSTER_END -->\n`).status, 0, '未确认海报许可应拒绝');
  assert.notEqual(run({ ...poster, imageAttachment: true }, 9012, `\n<!-- KDRAMA_POSTER_START -->\n![Poster](${imageUrl})\n<!-- KDRAMA_POSTER_END -->\n`).status, 0, '海报不能代替场景图片');
  assert.equal(fs.readFileSync(catalogFile, 'utf8'), before, '无效附件不能修改目录');
  assert.notEqual(run({ ...payload, imageUrl: 'javascript:alert(1)' }, 9002).status, 0);
  assert.equal(fs.readFileSync(catalogFile, 'utf8'), before, '无效链接不能修改目录');
  assert.notEqual(run({ ...correction, changes: { lat: 36 } }, 9004).status, 0);
  assert.equal(fs.readFileSync(catalogFile, 'utf8'), before, '无效更正不能修改目录');
  assert.notEqual(run(attachment, 9008).status, 0, '缺少 GitHub 附件应拒绝');
  assert.equal(fs.readFileSync(catalogFile, 'utf8'), before, '缺少图片附件不能修改目录');
  fs.writeFileSync(issueFile, '<!-- KDRAMA_SUBMISSION_V2_START -->\n```json\n{invalid}\n```\n<!-- KDRAMA_SUBMISSION_V2_END -->');
  const malformed = spawnSync(process.execPath, [path.join(root, 'tools', 'import-issue.cjs'), issueFile, '9006', catalogFile], { encoding: 'utf8' });
  assert.notEqual(malformed.status, 0, '无效 JSON 投稿应拒绝');
  assert.equal(fs.readFileSync(catalogFile, 'utf8'), before, '无效投稿不能修改目录');
  console.log('旧版投稿、可编辑投稿、GitHub 图片与海报、仅补图片、近期更新、更正及非法内容检查通过');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
