const crypto=require('node:crypto');
function validate(c){if(!c||typeof c!=='object')throw Error('目录必须是对象');const sets={};for(const k of ['works','landmarks','scenes','sources']){if(!Array.isArray(c[k]))throw Error(k+' 必须为数组');sets[k]=new Set();for(const i of c[k]){if(!i||typeof i.id!=='string'||!i.id.trim()||sets[k].has(i.id))throw Error(k+' ID 缺失或重复');sets[k].add(i.id);}}
for(const p of c.landmarks){if(!sets.works.has(p.workId))throw Error('地点缺少关联作品');if(!Number.isFinite(p.lat)||!Number.isFinite(p.lng)||Math.abs(p.lat)>90||Math.abs(p.lng)>180)throw Error('坐标格式无效');}
for(const s of c.scenes){if(!sets.landmarks.has(s.landmarkId))throw Error('场景缺少关联地点');for(const k of ['episode','timeSeconds'])if(s[k]!=null&&(!Number.isInteger(s[k])||s[k]<(k==='episode'?1:0)))throw Error('集数或时间格式无效');}
for(const a of [c.landmarks,c.scenes])for(const i of a)for(const k of ['sourceId','episodeSourceId','coordinateSourceId'])if(i[k]&&!sets.sources.has(i[k]))throw Error('引用了不存在的来源');return c;}
function canonical(v){if(Array.isArray(v))return v.map(canonical);if(v&&typeof v==='object')return Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])]));return v;}
const hash=c=>crypto.createHash('sha256').update(JSON.stringify(canonical(c))).digest('hex');
function pack(c){const catalog=JSON.parse(JSON.stringify(validate(c)));return {format:'kdrama.catalog',version:1,sha256:hash(catalog),catalog};}
function unpack(v){if(v?.format!=='kdrama.catalog'||v.version!==1)throw Error('不支持的目录格式或版本');validate(v.catalog);if(hash(v.catalog)!==v.sha256)throw Error('校验和不匹配：目录不完整或已被修改');return v.catalog;}
module.exports={validate,pack,unpack,hash};
