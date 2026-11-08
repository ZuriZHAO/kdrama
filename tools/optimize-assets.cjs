const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const sharp = require('../api-site/node_modules/sharp');

const root = path.resolve(__dirname, '..');
const catalogPath = path.join(root, 'data', 'catalog.js');
const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const limitArg = [...args].find(value => value.startsWith('--limit='));
const limit = limitArg ? Number(limitArg.split('=')[1]) : Infinity;

const context = { window: {} };
vm.runInNewContext(fs.readFileSync(catalogPath, 'utf8'), context);
const catalog = context.window.KDRAMA_CATALOG;
if (!catalog || !Array.isArray(catalog.works) || !Array.isArray(catalog.scenes)) {
  throw new Error('无法读取 data/catalog.js');
}

const refs = [];
for (const work of catalog.works) {
  if (typeof work.poster === 'string' && work.poster.startsWith('./assets/')) {
    refs.push({ kind: 'poster', owner: work.id, old: work.poster.slice(2) });
  }
}
for (const scene of catalog.scenes) {
  if (typeof scene.image === 'string' && scene.image.startsWith('./assets/')) {
    refs.push({ kind: 'scene', owner: scene.id, old: scene.image.slice(2) });
  }
}
const unique = [...new Map(refs.map(ref => [ref.old, ref])).values()];

let catalogText = fs.readFileSync(catalogPath, 'utf8');
const conversions = [];
const skipped = [];
const planned = new Set();
let beforeBytes = 0;
let afterBytes = 0;

function uniqueOutput(dir, base, width, source) {
  let candidate = path.join(dir, `${base}-${width}w.webp`);
  let index = 2;
  while (planned.has(candidate) || fs.existsSync(candidate) || candidate === source) {
    candidate = path.join(dir, `${base}-${width}w-${index++}.webp`);
  }
  planned.add(candidate);
  return candidate;
}

(async () => {
  for (const [index, ref] of unique.slice(0, limit).entries()) {
    const source = path.join(root, ref.old);
    if (!fs.existsSync(source)) {
      skipped.push({ ...ref, reason: '文件不存在' });
      continue;
    }
    const stat = fs.statSync(source);
    beforeBytes += stat.size;

    const isPoster = ref.kind === 'poster';
    const maxWidth = isPoster ? 600 : 1280;
    const quality = isPoster ? 80 : 82;
    const dir = path.dirname(source);
    const base = path.basename(source, path.extname(source));
    const temp = path.join(dir, `.tmp-${base}-${process.pid}-${index}.webp`);

    try {
      const info = await sharp(source)
        .rotate()
        .resize({ width: maxWidth, withoutEnlargement: true })
        .webp({ quality, alphaQuality: 90, effort: 6 })
        .toFile(temp);
      const nextSize = fs.statSync(temp).size;

      if (nextSize >= stat.size * 0.98) {
        fs.rmSync(temp, { force: true });
        skipped.push({ ...ref, reason: `收益不足（${Math.round(stat.size / 1024)} → ${Math.round(nextSize / 1024)} KB）` });
        afterBytes += stat.size;
        continue;
      }

      const target = uniqueOutput(dir, base, info.width, source);
      conversions.push({
        ...ref,
        source,
        temp,
        target,
        width: info.width,
        height: info.height,
        before: stat.size,
        after: nextSize,
        newRel: path.relative(root, target).replace(/\\/g, '/')
      });
      afterBytes += nextSize;
      console.log(`${dryRun ? '[演练] ' : ''}${ref.old} → ${path.relative(root, target)}  ${Math.round(stat.size / 1024)} → ${Math.round(nextSize / 1024)} KB`);
    } catch (error) {
      fs.rmSync(temp, { force: true });
      skipped.push({ ...ref, reason: `处理失败：${error.message}` });
      afterBytes += stat.size;
    }
  }

  console.log(`\n共 ${unique.length} 个本地图片引用；本次处理 ${Math.min(unique.length, limit)} 个。`);
  console.log(`可替换 ${conversions.length} 张：${(beforeBytes / 1048576).toFixed(1)} MB → ${(afterBytes / 1048576).toFixed(1)} MB（按已处理部分估算）。`);

  if (skipped.length) {
    console.log(`\n跳过 ${skipped.length} 张：`);
    for (const item of skipped) console.log(`- ${item.old}：${item.reason}`);
  }

  if (dryRun) {
    for (const item of conversions) fs.rmSync(item.temp, { force: true });
    console.log('\n这是演练，没有改文件。去掉 --dry-run 才会真正写入。');
    return;
  }
  if (!conversions.length) {
    console.log('\n没有可替换的图片，数据未改动。');
    return;
  }

  for (const item of conversions) {
    if (!catalogText.includes(`'./${item.old}'`) && !catalogText.includes(`"./${item.old}"`)) {
      throw new Error(`目录里找不到引用：${item.old}`);
    }
  }

  for (const item of conversions) fs.renameSync(item.temp, item.target);

  for (const item of conversions) {
    for (const quote of ["'", '"']) {
      const oldToken = `${quote}./${item.old}${quote}`;
      const newToken = `${quote}./${item.newRel}${quote}`;
      catalogText = catalogText.split(oldToken).join(newToken);
    }
  }

  const tempCatalog = `${catalogPath}.optimize.tmp`;
  fs.writeFileSync(tempCatalog, catalogText, 'utf8');
  fs.renameSync(tempCatalog, catalogPath);

  for (const item of conversions) {
    if (path.resolve(item.source) !== path.resolve(item.target)) fs.rmSync(item.source, { force: true });
  }

  const remaining = unique.filter(ref => fs.existsSync(path.join(root, ref.old)) && !conversions.some(item => item.old === ref.old));
  console.log(`\n已更新 data/catalog.js，并删除 ${conversions.length} 张旧图。剩余未替换 ${remaining.length} 张。`);
  console.log('接下来运行：node data/check-catalog.cjs && node tools/check-assets.cjs && node tools/build-site.cjs');
})();
