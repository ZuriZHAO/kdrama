const assert=require('node:assert/strict'),core=require('../compare-core.js');
for(const mode of ['side','vertical','overlay','blend'])for(const size of [800,1600,2400])for(const gap of [0,60]){const l=core.layout({mode,size,gap});for(const [x,y,w,h]of l.boxes){assert(w>0&&h>0);assert(x>=0&&y>=0&&x+w<=l.width&&y+h<=l.height);}}
assert.deepEqual(core.crop(2000,1000,100,100,100,50),[1000,0,1000,1000]);
assert.deepEqual(core.crop(1000,2000,100,100,50,100),[0,1000,1000,1000]);
assert.equal(core.normalize({size:999999,gap:-4,background:'javascript:bad',mode:'bad'}).size,2400);
assert.equal(core.normalize({gap:-4}).gap,0);
assert.equal(core.normalize({background:'bad'}).background,'#eeeeee');
console.log('Comparison layout bounds, crop positioning and saved-setting validation passed.');

assert.deepEqual(core.crop(2000,1000,100,100,50,50,200),[750,250,500,500]);
assert.equal(core.normalize({photoZoom:999,sceneZoom:-5,opacity:200}).photoZoom,300);
assert.equal(core.normalize({sceneZoom:-5}).sceneZoom,100);
assert.equal(core.normalize({opacity:200}).opacity,100);
