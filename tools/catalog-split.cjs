// Versioned, per-work storage. The public page can continue using catalog.js.
const fs=require('node:fs'),path=require('node:path'),core=require('./catalog-format.cjs');
const collections=['works','landmarks','scenes'];
function pack(catalog){
  core.validate(catalog);
  const files={'shared.json':Object.fromEntries(Object.entries(catalog).filter(([key])=>!collections.includes(key)))};
  for(const work of catalog.works){
    const landmarks=catalog.landmarks.filter(p=>p.workId===work.id),ids=new Set(landmarks.map(p=>p.id));
    files[`works/${core.hash(work.id)}.json`]={work,landmarks,scenes:catalog.scenes.filter(s=>ids.has(s.landmarkId))};
  }
  return {manifest:{format:'kdrama.catalog.split',version:2,catalogSha256:core.hash(catalog),order:Object.fromEntries(collections.map(key=>[key,catalog[key].map(item=>item.id)])),files:Object.entries(files).map(([name,data])=>({path:name,sha256:core.hash(data)}))},files};
}
function unpack(manifest,read){
  if(manifest?.format!=='kdrama.catalog.split'||manifest.version!==2||!Array.isArray(manifest.files)||!manifest.order)throw Error('不支持的分文件目录格式');
  const seen=new Set(),items={works:[],landmarks:[],scenes:[]};let shared;
  for(const entry of manifest.files){
    if(!entry||typeof entry.path!=='string'||! /^(shared\.json|works\/[a-f0-9]{64}\.json)$/.test(entry.path)||seen.has(entry.path))throw Error('分文件路径无效或重复');
    seen.add(entry.path);const data=read(entry.path);if(core.hash(data)!==entry.sha256)throw Error('文件校验失败：'+entry.path);
    if(entry.path==='shared.json'){if(!data||typeof data!=='object'||Array.isArray(data)||collections.some(k=>Object.hasOwn(data,k)))throw Error('共享资料格式无效');shared=data;}
    else {if(!data?.work||!Array.isArray(data.landmarks)||!Array.isArray(data.scenes)||entry.path!==`works/${core.hash(data.work.id)}.json`)throw Error('作品分文件格式无效');
      if(data.landmarks.some(p=>p.workId!==data.work.id)||data.scenes.some(s=>!data.landmarks.some(p=>p.id===s.landmarkId)))throw Error('分文件包含其他作品的资料');
      items.works.push(data.work);items.landmarks.push(...data.landmarks);items.scenes.push(...data.scenes);
    }
  }
  if(!shared)throw Error('缺少共享资料');const catalog={...shared};
  for(const key of collections){const order=manifest.order[key],byId=new Map(items[key].map(item=>[item.id,item]));
    if(!Array.isArray(order)||order.length!==items[key].length||byId.size!==items[key].length||new Set(order).size!==order.length||order.some(id=>!byId.has(id)))throw Error('目录顺序索引不完整：'+key);
    catalog[key]=order.map(id=>byId.get(id));
  }
  core.validate(catalog);if(core.hash(catalog)!==manifest.catalogSha256)throw Error('整体目录校验失败');return catalog;
}
function write(directory,catalog){
  const packed=pack(catalog);fs.mkdirSync(directory);fs.mkdirSync(path.join(directory,'works'));
  for(const [name,data]of Object.entries(packed.files))fs.writeFileSync(path.join(directory,name),JSON.stringify(data,null,2)+'\n',{flag:'wx'});
  // Write the manifest last so an incomplete export cannot be mistaken for a complete one.
  fs.writeFileSync(path.join(directory,'manifest.json'),JSON.stringify(packed.manifest,null,2)+'\n',{flag:'wx'});return packed.manifest;
}
function read(directory){return unpack(JSON.parse(fs.readFileSync(path.join(directory,'manifest.json'),'utf8')),name=>JSON.parse(fs.readFileSync(path.join(directory,name),'utf8')));}
module.exports={pack,unpack,write,read};
