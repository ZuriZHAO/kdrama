(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.KdramaCompare=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
  const defaults={mode:'vertical',gap:0,background:'#eeeeee',size:1600};
  function normalize(value={}){return {mode:value.mode==='side'?'side':'vertical',gap:Number.isFinite(Number(value.gap))?Math.round(Math.max(0,Math.min(60,Number(value.gap)))):0,background:/^#[0-9a-f]{6}$/i.test(value.background||'')?value.background:defaults.background,size:1600};}
  function layout(value,ratios=[16/9,16/9]){
    const o=normalize(value),r=ratios.map(n=>Number.isFinite(n)&&n>0?n:16/9),g=o.gap;
    let boxes,height;
    if(o.mode==='side'){const h=(o.size-3*g)/(r[0]+r[1]);height=h+2*g;boxes=[[g,g,h*r[0],h],[2*g+h*r[0],g,h*r[1],h]];}
    else{const w=o.size-2*g,h1=w/r[0],h2=w/r[1];height=h1+h2+3*g;boxes=[[g,g,w,h1],[g,2*g+h1,w,h2]];}
    // Keep unusually tall/skinny photos within a safe canvas size without cropping.
    const scale=Math.min(1,8000/height);return {width:Math.max(1,Math.round(o.size*scale)),height:Math.max(1,Math.round(height*scale)),boxes:boxes.map(b=>b.map(n=>n*scale))};
  }
  return {defaults,normalize,layout};
});
