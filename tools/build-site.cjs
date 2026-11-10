const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const dist = path.resolve(root, 'dist');
if (!dist.startsWith(root + path.sep)) throw new Error('构建目录超出项目范围');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
for (const name of ['index.html', 'styles.css', 'script.js', 'discovery.js', 'map-core.js', 'maintenance-core.js', 'manage.html', 'manage.js', 'review-queue.js', 'submission-images.js', 'review-scenes.js', 'image-fallback.js', 'personal-core.js', 'personal-tools.js', 'compare.html', 'compare.js', 'boot.js', 'submit.html', 'submit.css', 'submit.js', 'review.html', 'review.js', 'review.css', 'submission-core.js', 'site-config.js']) {
  fs.copyFileSync(path.join(root, name), path.join(dist, name));
}
fs.mkdirSync(path.join(dist, 'data'));
for (const name of ['catalog.js', 'korea-map.js']) fs.copyFileSync(path.join(root, 'data', name), path.join(dist, 'data', name));
// This manifest is deployed with the site, so it proves visibility rather than just a successful import.
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data/catalog.js'), 'utf8'), context);
const updates = (context.window.KDRAMA_CATALOG.updates || []).map(({ issueNumber, workId, landmarkId, reviewedAt, bodyHash }) => ({ issueNumber, workId, landmarkId, reviewedAt, ...(bodyHash ? { bodyHash } : {}) }));
fs.writeFileSync(path.join(dist, 'data/publication-status.json'), JSON.stringify({ updates }));
fs.cpSync(path.join(root, 'vendor'), path.join(dist, 'vendor'), { recursive: true });
if (fs.existsSync(path.join(root, 'assets'))) fs.cpSync(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true });
fs.writeFileSync(path.join(dist, '.nojekyll'), '');
console.log(`已生成 GitHub Pages 静态站点：${dist}`);
