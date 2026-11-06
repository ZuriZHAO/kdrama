const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.resolve(root, 'dist');
if (!dist.startsWith(root + path.sep)) throw new Error('构建目录超出项目范围');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
for (const name of ['index.html', 'styles.css', 'script.js', 'boot.js', 'submit.html', 'submit.css', 'submit.js', 'review.html', 'review.js', 'site-config.js']) {
  fs.copyFileSync(path.join(root, name), path.join(dist, name));
}
fs.mkdirSync(path.join(dist, 'data'));
for (const name of ['catalog.js', 'korea-map.js']) fs.copyFileSync(path.join(root, 'data', name), path.join(dist, 'data', name));
fs.cpSync(path.join(root, 'vendor'), path.join(dist, 'vendor'), { recursive: true });
if (fs.existsSync(path.join(root, 'assets'))) fs.cpSync(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true });
fs.writeFileSync(path.join(dist, '.nojekyll'), '');
console.log(`已生成 GitHub Pages 静态站点：${dist}`);
