const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),core=require('../tools/catalog-format.cjs');
const c={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../data/catalog.js'),'utf8'),c);const original=JSON.parse(JSON.stringify(c.window.KDRAMA_CATALOG)),p=core.pack(original);
assert.deepEqual(core.unpack(JSON.parse(JSON.stringify(p))),original);assert.equal(core.hash({b:2,a:1}),core.hash({a:1,b:2}));assert.notEqual(core.hash({a:[1,2]}),core.hash({a:[2,1]}));
assert.throws(()=>core.unpack({...p,version:999}));const bad=structuredClone(p);bad.catalog.works[0].title+='changed';assert.throws(()=>core.unpack(bad));
const dup=structuredClone(original);dup.works.push(dup.works[0]);assert.throws(()=>core.pack(dup));const orphan=structuredClone(original);orphan.scenes[0].landmarkId='missing';assert.throws(()=>core.pack(orphan));
console.log('Catalog round-trip, ordering, version, duplicate ID, references and checksum checks passed.');
