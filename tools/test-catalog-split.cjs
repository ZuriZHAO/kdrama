const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),os=require('node:os'),split=require('./catalog-split.cjs');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../data/catalog.js'),'utf8'),context);
const original=JSON.parse(JSON.stringify(context.window.KDRAMA_CATALOG));
// Exercise interleaved ordering and unknown future metadata, not just today's contiguous catalogue.
original.landmarks.reverse();original.scenes.reverse();original.futureMetadata={version:4,nullable:null};
const {manifest,files}=split.pack(original),read=name=>files[name];assert.deepEqual(split.unpack(manifest,read),original);
for(const mutate of [m=>m.version=3,m=>m.files.push(m.files[0]),m=>m.files[0].path='../secret.json',m=>m.order.scenes.pop(),m=>m.catalogSha256='bad']){const bad=structuredClone(manifest);mutate(bad);assert.throws(()=>split.unpack(bad,read));}
assert.throws(()=>split.unpack(manifest,name=>name==='shared.json'?{...files[name],sources:[]}:files[name]));
const parent=fs.mkdtempSync(path.join(os.tmpdir(),'kdrama-split-'));try{const directory=path.join(parent,'export');split.write(directory,original);assert.deepEqual(split.read(directory),original);assert.throws(()=>split.write(directory,original));assert.deepEqual(split.read(directory),original);}finally{if(!path.resolve(parent).startsWith(path.resolve(os.tmpdir())+path.sep))throw Error('Unsafe test cleanup');fs.rmSync(parent,{recursive:true,force:true});}
console.log('Split catalogue: exact round-trip, references/order, corruption, unsafe paths and overwrite protection passed.');
