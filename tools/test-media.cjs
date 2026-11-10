const assert=require('node:assert/strict'),sharp=require('sharp');const media=require('./prepare-media.cjs');
(async()=>{
 const raw=Buffer.alloc(100*100*3);for(let y=0;y<100;y++)for(let x=0;x<100;x++){const i=(y*100+x)*3;raw[i]=y<50?255:0;raw[i+2]=y>=50?255:0;}
 const source=await sharp(raw,{raw:{width:100,height:100,channels:3}}).png().toBuffer();
 const top=await media.render(source,{x:50,y:0}),bottom=await media.render(source,{x:50,y:100});
 const meta=await sharp(top.thumb).metadata();assert.equal(meta.width,320);assert.equal(meta.height,164);assert.notDeepEqual(top.thumb,bottom.thumb);assert(top.medium.length<400*1024);
 assert(!media.allowed('http://github.com/user-attachments/assets/abc'));assert(!media.allowed('https://127.0.0.1/a'));assert(!media.allowed('https://github.com.attacker.com/a'));assert(!media.allowed('https://user:pass@github.com/a'));
 await assert.rejects(media.download('https://github.com/user-attachments/assets/12345678',async()=>new Response(null,{status:302,headers:{location:'http://127.0.0.1/'}})),/主机/);
 await assert.rejects(media.download('https://github.com/user-attachments/assets/12345678',async()=>new Response('x',{headers:{'content-length':'5000001'}})),/5 MB/);
 const downloaded=await media.download('https://github.com/user-attachments/assets/12345678',async()=>new Response(source));assert.deepEqual(downloaded,source);
 const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),dir=fs.mkdtempSync(path.join(os.tmpdir(),'kdrama-media-'));
 try{fs.mkdirSync(path.join(dir,'assets'));fs.writeFileSync(path.join(dir,'assets/source.png'),source);const catalog={scenes:[{id:'issue-99-scene',image:'./assets/source.png',crop:{x:0,y:100}}]};await media.prepare(dir,catalog,99);assert(fs.existsSync(path.join(dir,catalog.scenes[0].thumbnail)));const snapshot=JSON.stringify(catalog);await media.prepare(dir,catalog,99);assert.equal(JSON.stringify(catalog),snapshot);}finally{fs.rmSync(dir,{recursive:true,force:true});}
 console.log('Image crop output, thumbnail sizes, redirect allowlist and download limit passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
