// 把清单里的场景截图下载、压成 webp 并写回 data/catalog.js。
// 用法：node tools/fetch-scene-images.cjs [清单路径] [--dry-run] [--skip-download]
// 清单格式见 data/scene-sources/*.json：{ workId, scenes: [{ sceneId, source, url }] }。
//
// 注意：这里刻意不调用 tools/optimize-assets.cjs。那个脚本会把 catalog 里所有图片重新压一遍，
// 仓库里现有图片已经是 webp，再跑一次会生成 *-600w-600w.webp 之类的重复文件并改写全部引用。
// 本脚本只处理清单里的新图：写 assets/scenes/<workId>/<sceneId>-1280w.webp，再改这一条场景。

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const catalogPath = path.join(root, 'data', 'catalog.js');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const skipDownload = args.includes('--skip-download');
const manifestArg = args.find(arg => !arg.startsWith('--')) || 'data/scene-sources/love-in-disguise.json';
const manifestPath = path.resolve(root, manifestArg);

const MAX_WIDTH = 1280;
const QUALITIES = [82, 70, 60, 50];
const FILE_LIMIT = 400 * 1024;

const EXTENSIONS = [
  { ext: 'jpg', test: bytes => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
  { ext: 'png', test: bytes => bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { ext: 'webp', test: bytes => bytes.subarray(0, 4).toString('latin1') === 'RIFF' && bytes.subarray(8, 12).toString('latin1') === 'WEBP' }
];

function loadSharp() {
  return require('sharp');
}

function imageExtension(bytes) {
  const match = EXTENSIONS.find(item => bytes.length > 12 && item.test(bytes));
  if (!match) throw new Error('不是 JPG、PNG 或 WebP 图片');
  return match.ext;
}

function allowed(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('链接无效：' + url);
  }
  if (parsed.protocol !== 'https:') throw new Error('只支持 https 链接：' + url);
  if (parsed.username || parsed.password || parsed.port) throw new Error('链接不能带账号或自定义端口：' + url);
  return parsed;
}

async function download(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      accept: 'image/avif,image/webp,image/jpeg,image/png,*/*',
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
      referer: 'https://www.xiaohongshu.com/'
    },
    signal: AbortSignal.timeout(20000)
  });
  if (!response.ok) {
    throw new Error(`下载失败（HTTP ${response.status}）${url}。笔记图片链接有时效，过期后请重新保存原图，用 --skip-download 继续。`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!bytes.length) throw new Error('下载到的文件为空：' + url);
  return bytes;
}

async function toWebp(sharp, bytes) {
  const oriented = await sharp(bytes, { limitInputPixels: 40_000_000, animated: false }).rotate().toBuffer();
  for (const quality of QUALITIES) {
    const buffer = await sharp(oriented).resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality, effort: 6 }).toBuffer();
    if (buffer.length <= FILE_LIMIT) return buffer;
  }
  throw new Error(`压缩后仍超过 ${FILE_LIMIT / 1024} KB，请换一张图`);
}

function readCatalog() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(catalogPath, 'utf8'), context);
  const catalog = context.window.KDRAMA_CATALOG;
  if (!catalog || !Array.isArray(catalog.scenes)) throw new Error('无法读取 data/catalog.js');
  return catalog;
}

function wireScene(text, sceneId, imagePath) {
  const index = text.indexOf(`{ id: '${sceneId}'`);
  if (index === -1) throw new Error(`data/catalog.js 里找不到场景 ${sceneId}`);
  const end = text.indexOf('\n', index);
  const line = text.slice(index, end === -1 ? text.length : end);
  if (!/image: null\b/.test(line)) throw new Error(`场景 ${sceneId} 已经有图片，未覆盖`);
  return text.slice(0, index) + line.replace(/image: null\b/, `image: '${imagePath}'`) + text.slice(end === -1 ? text.length : end);
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const workId = manifest.workId;
  const entries = Array.isArray(manifest.scenes) ? manifest.scenes : [];
  if (!workId || !/^[a-z0-9-]+$/.test(workId)) throw new Error('清单缺少合法的 workId');
  if (!entries.length) throw new Error('清单里没有场景');

  const catalog = readCatalog();
  if (!catalog.works.some(work => work.id === workId)) throw new Error(`作品 ${workId} 不存在`);

  const relativeDir = `assets/scenes/${workId}`;
  const targetDir = path.join(root, relativeDir);
  if (!dryRun) fs.mkdirSync(targetDir, { recursive: true });

  let catalogText = fs.readFileSync(catalogPath, 'utf8');
  const written = [];
  const skipped = [];
  const failures = [];

  for (const entry of entries) {
    const { sceneId, url, source } = entry;
    const scene = catalog.scenes.find(item => item.id === sceneId);
    if (!scene) {
      failures.push(`${sceneId}：catalog 里没有这条场景`);
      continue;
    }
    if (scene.image) {
      skipped.push(`${sceneId}：已经有图片（${scene.image}），未覆盖`);
      continue;
    }

    let bytes = null;
    let sourceFile = null;
    try {
      if (skipDownload) {
        const existing = fs.existsSync(targetDir)
          ? fs.readdirSync(targetDir).find(name => new RegExp(`^${sceneId}\\.(jpg|jpeg|png|webp)$`, 'i').test(name))
          : null;
        if (!existing) throw new Error('本地没有同名原图，--skip-download 无法继续');
        sourceFile = path.join(targetDir, existing);
        bytes = fs.readFileSync(sourceFile);
        imageExtension(bytes);
      } else {
        allowed(url);
        if (dryRun) {
          console.log(`[演练] ${sceneId} ← ${source || '截图'} ${url}`);
          continue;
        }
        bytes = await download(url);
        imageExtension(bytes);
      }
    } catch (error) {
      failures.push(`${sceneId}（${source || '截图'}）：${error.message}`);
      continue;
    }

    const fileName = `${sceneId}-${MAX_WIDTH}w.webp`;
    const imagePath = `./${relativeDir}/${fileName}`;
    const webp = await toWebp(loadSharp(), bytes);
    if (!dryRun) fs.writeFileSync(path.join(targetDir, fileName), webp);
    if (sourceFile && !dryRun) fs.rmSync(sourceFile, { force: true });
    catalogText = wireScene(catalogText, sceneId, imagePath);
    written.push({ sceneId, fileName, before: bytes.length, after: webp.length });
    console.log(`${dryRun ? '[演练] ' : ''}${sceneId} → ${fileName}  ${Math.round(bytes.length / 1024)} → ${Math.round(webp.length / 1024)} KB`);
  }

  if (dryRun) {
    console.log(`\n这是演练：清单共 ${entries.length} 张，没有下载或改文件。`);
    if (skipped.length) console.log('\n已有图片：\n- ' + skipped.join('\n- '));
    if (failures.length) console.log('\n问题：\n- ' + failures.join('\n- '));
    return;
  }

  if (!written.length) {
    if (skipped.length) console.log('清单里的场景都已有图片：\n- ' + skipped.join('\n- '));
    if (failures.length) console.error('没有写入任何图片：\n- ' + failures.join('\n- '));
    if (failures.length) process.exitCode = 1;
    return;
  }

  const tempCatalog = `${catalogPath}.fetch.tmp`;
  fs.writeFileSync(tempCatalog, catalogText, 'utf8');
  fs.renameSync(tempCatalog, catalogPath);

  console.log(`\n已写入 ${written.length} 张 webp 到 ${relativeDir}/，并更新 data/catalog.js。`);
  if (skipped.length) console.log('\n已有图片、未覆盖：\n- ' + skipped.join('\n- '));
  if (failures.length) console.log('\n跳过：\n- ' + failures.join('\n- '));
  console.log('接下来运行：node tools/check-catalog.cjs && node tools/check-assets.cjs && node tools/build-site.cjs');
  console.log('（不要对全仓库跑 tools/optimize-assets.cjs：现有图片已是 webp，会重复压缩并改写全部引用。）');
}

module.exports = { wireScene, imageExtension, allowed, toWebp };

if (require.main === module) {
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
