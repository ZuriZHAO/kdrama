const assert=require('node:assert/strict');
const core=require('../compare-core.js');
assert.equal(core.normalize().mode,'vertical');
assert.equal(core.normalize({gap:-1,mode:'invalid',background:'url(bad)'}).gap,0);
assert.equal(core.normalize({gap:999}).gap,60);
for(const mode of ['vertical','side'])for(const ratios of [[2,1],[.5,3],[.001,1]]){
 const l=core.layout({mode,gap:20},ratios);
 assert(l.width>0&&l.height<=8000);
 l.boxes.forEach(([x,y,w,h],i)=>{assert(x>=0&&y>=0&&x+w<=l.width+1&&y+h<=l.height+1);assert(Math.abs(w/h-ratios[i])<1e-8,'Keep entire image aspect ratio');});
}
assert.equal(core.layout({mode:'vertical'},[2,1]).height,2400);
assert.equal(core.layout({mode:'side'},[2,1]).height,533);
console.log('Comparison: full-image aspect ratios, vertical/horizontal layout, bounds and safe canvas limits passed.');
