const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const assetsDir = path.join(root, 'assets');
const catalogPath = path.join(root, 'data', 'catalog.js');
const TOTAL_LIMIT = 150 * 1024 * 1024;
const FILE_LIMIT = 400 * 1024;
const ALLOW_UNREFERENCED = [/^assets\/brand\//, /^assets\/generated\//];

const context = { window: {} };
vm.runInNewContext(fs.readFileSync(catalogPath, 'utf8'), context);
const catalog = context.window.KDRAMA_CATALOG;
if (!catalog || !Array.isArray(catalog.works) || !Array.isArray(catalog.scenes)) {
  throw new Error('无法读取 data/catalog.js');
}

const referenced = new Set();
for (const work of catalog.works) {
  if (typeof work.poster === 'string' && work.poster.startsWith('./assets/')) referenced.add(work.poster.slice(2));
}
for(const change of (catalog.maintenanceLog||[]).flatMap(log=>log.changes||[]))for(const key of ['image','poster','thumbnail','mediumImage']){const value=change.before?.[key];if(typeof value==='string'&&value.startsWith('./assets/'))referenced.add(value.slice(2));}
for (const scene of catalog.scenes) {
  for(const key of ['thumbnail','mediumImage'])if(typeof scene[key]==='string'&&scene[key].startsWith('./assets/'))referenced.add(scene[key].slice(2));
  if (typeof scene.image === 'string' && scene.image.startsWith('./assets/')) referenced.add(scene.image.slice(2));
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

if (!fs.existsSync(assetsDir)) throw new Error('缺少 assets/ 目录');
const files = walk(assetsDir)
  .filter(file => path.basename(file) !== '.gitkeep')
  .map(file => path.relative(root, file).replace(/\\/g, '/'))
  .sort();

const errors = [];
const sizes = new Map(files.map(file => [file, fs.statSync(path.join(root, file)).size]));
const total = [...sizes.values()].reduce((sum, size) => sum + size, 0);
const missing = [...referenced].filter(file => !fs.existsSync(path.join(root, file)));
const unreferenced = files.filter(file => !referenced.has(file) && !ALLOW_UNREFERENCED.some(pattern => pattern.test(file)));
const tooLarge = files.filter(file => sizes.get(file) > FILE_LIMIT);

for (const file of missing) errors.push(`目录引用的图片不存在：${file}`);
for (const file of unreferenced) errors.push(`图片没有被目录引用：${file}`);
for (const file of tooLarge) errors.push(`图片超过 ${Math.round(FILE_LIMIT / 1024)} KB：${file}（${Math.round(sizes.get(file) / 1024)} KB）`);
if (total > TOTAL_LIMIT) errors.push(`assets/ 总量 ${(total / 1048576).toFixed(1)} MB，超过 ${Math.round(TOTAL_LIMIT / 1048576)} MB 上限`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  const largest = files.reduce((top, file) => sizes.get(file) > (sizes.get(top) || 0) ? file : top, files[0]);
  console.log(`图片检查通过：${files.length} 个文件，${(total / 1048576).toFixed(1)} MB，最大 ${Math.round(sizes.get(largest) / 1024)} KB（${largest}）`);
}
