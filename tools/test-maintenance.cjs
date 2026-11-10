const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const core=require('../maintenance-core'),sub=require('../submission-core');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../data/catalog.js'),'utf8'),ctx);const cat=JSON.parse(JSON.stringify(ctx.window.KDRAMA_CATALOG));
const work=cat.works[0],place=cat.landmarks.find(p=>p.workId===work.id),target=cat.landmarks.find(p=>p.workId===work.id&&p.id!==place.id),scene=cat.scenes.find(s=>s.landmarkId===place.id);
const payload={version:2,kind:'maintenance',operations:[{entity:'works',id:work.id,action:'update',before:work,changes:{color:'#123456'}},{entity:'landmarks',id:place.id,action:'update',before:place,changes:{group:'测试分组',lat:0,lng:0,order:2}}]};
const result=core.apply(cat,payload);assert.equal(result.catalog.landmarks.find(p=>p.id===place.id).lat,0);assert.equal(cat.landmarks.find(p=>p.id===place.id).lat,place.lat);
assert.throws(()=>core.apply(result.catalog,payload),/资料已变化/);
assert.throws(()=>core.apply(cat,{...payload,operations:[{...payload.operations[0],changes:{id:'override'}}]}),/不支持/);
assert.throws(()=>core.apply(cat,{...payload,operations:[{...payload.operations[0],changes:{poster:'javascript:alert(1)'}}]}),/无效/);
const merge={version:2,kind:'maintenance',operations:[{entity:'landmarks',id:place.id,action:'merge',before:place,targetId:target.id,beforeTarget:target}]};
const merged=core.apply(cat,merge).catalog;assert(!merged.landmarks.some(p=>p.id===place.id));assert(merged.scenes.filter(s=>s.id===scene.id).every(s=>s.landmarkId===target.id));assert.equal(merged.redirects[place.id],target.id);
const del=core.apply(cat,{version:2,kind:'maintenance',operations:[{entity:'scenes',id:scene.id,action:'delete',before:scene}]}).catalog;assert(!del.scenes.some(s=>s.id===scene.id));
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'kdrama-maint-'));
try{
 const body='<!-- KDRAMA_SUBMISSION_V2_START -->\n```json\n'+JSON.stringify(payload)+'\n```\n<!-- KDRAMA_SUBMISSION_V2_END -->';
 sub.validateSubmission(sub.parseIssue(body).payload,body,cat);
 const file=path.join(dir,'issue.md'),catalogFile=path.join(dir,'catalog.js');fs.writeFileSync(file,body);fs.writeFileSync(catalogFile,'window.KDRAMA_CATALOG='+JSON.stringify(cat));
 execFileSync(process.execPath,[path.join(__dirname,'import-issue.cjs'),file,'99951',catalogFile]);
 const once=fs.readFileSync(catalogFile,'utf8');execFileSync(process.execPath,[path.join(__dirname,'import-issue.cjs'),file,'99951',catalogFile]);assert.equal(fs.readFileSync(catalogFile,'utf8'),once);
}finally{fs.rmSync(dir,{recursive:true,force:true});}
console.log('Maintenance validation, atomic updates, stale snapshots, scene deletion, merges and idempotent publishing passed.');
