const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const sharp=require('sharp');
const {isGitHubImage}=require('../submission-core');
const LIMIT=5_000_000;
function allowed(url){const u=new URL(url);return u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&(u.hostname==='github.com'||u.hostname.endsWith('.githubusercontent.com')||/^github-production-user-asset-[a-z0-9-]+\.s3\.amazonaws\.com$/.test(u.hostname));}
async function download(url,fetcher=fetch){
  let current=url;
  for(let redirects=0;redirects<5;redirects++){
    if(!allowed(current))throw Error('图片跳转到不支持的主机。');
    const response=await fetcher(current,{redirect:'manual',signal:AbortSignal.timeout(15000)});
    if([301,302,303,307,308].includes(response.status)){await response.body?.cancel();current=new URL(response.headers.get('location'),current).href;continue;}
    if(!response.ok)throw Error('图片下载失败：'+response.status);
    if(Number(response.headers.get('content-length'))>LIMIT){await response.body?.cancel();throw Error('图片超过 5 MB。');}
    const parts=[];let size=0;for await(const chunk of response.body){size+=chunk.length;if(size>LIMIT)throw Error('图片超过 5 MB。');parts.push(chunk);}return Buffer.concat(parts);
  }throw Error('图片重定向次数过多。');
}
async function render(buffer,crop={x:50,y:50}){
  const inputInfo=await sharp(buffer,{limitInputPixels:40_000_000,animated:false}).metadata();
  if(!['jpeg','png','webp'].includes(inputInfo.format))throw Error('只支持 JPG、PNG、WebP 图片。');
  const oriented=await sharp(buffer,{limitInputPixels:40_000_000,animated:false}).rotate().toBuffer();
  const info=await sharp(oriented).metadata();
  if(!['jpeg','png','webp'].includes(info.format))throw Error('只支持 JPG、PNG、WebP 图片。');
  const ratio=125/64,width=Math.min(info.width,Math.floor(info.height*ratio)),height=Math.min(info.height,Math.floor(width/ratio));
  const x=Number.isFinite(crop.x)?Math.max(0,Math.min(100,crop.x)):50,y=Number.isFinite(crop.y)?Math.max(0,Math.min(100,crop.y)):50;
  const area={left:Math.round((info.width-width)*x/100),top:Math.round((info.height-height)*y/100),width,height};
  const thumb=await sharp(oriented).extract(area).resize(320,164,{fit:'fill'}).webp({quality:75}).toBuffer();
  let medium;for(const quality of [80,65,50,35]){medium=await sharp(oriented).extract(area).resize({width:1000,withoutEnlargement:true}).webp({quality}).toBuffer();if(medium.length<=400*1024)break;}
  if(medium.length>400*1024)throw Error('压缩后图片仍过大，请换一张图片。');
  return {thumb,medium};
}
async function prepare(root,catalog,issueNumber){
  const changedIds=new Set((catalog.maintenanceLog||[]).filter(l=>Number(l.issueNumber)===Number(issueNumber)).flatMap(l=>l.changes.filter(c=>c.entity==='scenes').map(c=>c.id)));
  const scenes=catalog.scenes.filter(s=>s.id===`issue-${issueNumber}-scene`||s.id.startsWith(`issue-${issueNumber}-scene-`)||changedIds.has(s.id));
  for(const scene of scenes){
    if(!scene.image)continue;
    const signature=crypto.createHash('sha256').update(JSON.stringify([scene.image,scene.crop||{x:50,y:50}])).digest('hex').slice(0,24);
    if(scene.mediaSource===signature&&scene.thumbnail&&scene.mediumImage&&[scene.thumbnail,scene.mediumImage].every(f=>fs.existsSync(path.join(root,f))))continue;
    let bytes;
    if(/^\.\/assets\/[A-Za-z0-9/_-]+\.(jpg|jpeg|png|webp)$/i.test(scene.image))bytes=fs.readFileSync(path.join(root,scene.image));
    else if(isGitHubImage(scene.image))bytes=await download(scene.image);
    else continue; // Existing third-party links remain usable; never fetch arbitrary hosts in Actions.
    const {thumb,medium}=await render(bytes,scene.crop);
    const relative=`assets/generated/${signature}`;fs.mkdirSync(path.join(root,'assets/generated'),{recursive:true});
    fs.writeFileSync(path.join(root,relative+'-320.webp'),thumb);fs.writeFileSync(path.join(root,relative+'-1000.webp'),medium);
    scene.thumbnail='./'+relative+'-320.webp';scene.mediumImage='./'+relative+'-1000.webp';scene.mediaSource=signature;
  }
  return scenes.length;
}
async function main(){const root=path.resolve(__dirname,'..'),issue=process.argv[2];if(!/^\d+$/.test(issue||''))throw Error('用法：node tools/prepare-media.cjs <Issue 编号>');const file=path.join(root,'data/catalog.js'),ctx={window:{}};vm.runInNewContext(fs.readFileSync(file,'utf8'),ctx);const catalog=ctx.window.KDRAMA_CATALOG;await prepare(root,catalog,issue);fs.writeFileSync(file,'// 作品 → 地标 → 场景。通过 GitHub 投稿并经维护者审核后更新。\nwindow.KDRAMA_CATALOG = '+JSON.stringify(catalog,null,2)+';\n');console.log('投稿图片缩略图处理完成。');}
module.exports={render,download,prepare,allowed};if(require.main===module)main().catch(e=>{console.error(e.message);process.exitCode=1;});
