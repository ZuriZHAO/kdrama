(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.KdramaPersonal=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const safeId=id=>typeof id==='string'&&/^[A-Za-z0-9_-]{1,120}$/.test(id);
  function normalize(data,landmarks,redirects={}){
    if(!data||data.format!=='kdrama-personal'||data.version!==1||!Array.isArray(data.favorites)||data.favorites.length>5000)throw Error('不是有效的个人记录备份文件。');
    const known=new Set(landmarks.map(p=>p.id)),missing=new Set();
    const resolve=id=>{if(!safeId(id))throw Error('备份含无效地点编号。');const next=Object.hasOwn(redirects,id)?redirects[id]:id;if(!known.has(next)){missing.add(id);return null;}return next;};
    const favorites=[...new Set(data.favorites.map(resolve).filter(Boolean))];
    function dates(value){if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length>5000)throw Error('到访记录格式无效。');const result={};for(const [id,date]of Object.entries(value)){if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date+'T00:00:00Z'))||new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date)throw Error('到访日期无效。');const key=resolve(id);if(key)Object.defineProperty(result,key,{value:date,enumerable:true,writable:true,configurable:true});}return result;}
    const visits=dates(data.visits||{}),checkins=dates(data.checkins||{});
    for(const [id,date]of Object.entries(checkins))if(!Object.hasOwn(visits,id))Object.defineProperty(visits,id,{value:date,enumerable:true,writable:true,configurable:true});
    return {format:'kdrama-personal',version:1,favorites,visits,checkins,missing:[...missing]};
  }
  function merge(current,incoming,replace=false){return {format:'kdrama-personal',version:1,favorites:replace?[...incoming.favorites]:[...new Set([...current.favorites,...incoming.favorites])],visits:replace?{...incoming.visits}:{...incoming.visits,...current.visits},checkins:replace?{...incoming.checkins}:{...incoming.checkins,...current.checkins}};}
  function share(ids){if(!Array.isArray(ids)||!ids.length||ids.length>100||ids.some(id=>!safeId(id)))throw Error('分享行程需要 1–100 个有效地点。');const encoded=btoa(JSON.stringify([...new Set(ids)])).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');if(encoded.length>7000)throw Error('行程较长，请拆成多条行程分享。');return encoded;}
  function readShare(encoded,landmarks,redirects={}){if(typeof encoded!=='string'||encoded.length>7000||!/^[A-Za-z0-9_-]+$/.test(encoded))throw Error('行程分享链接无效。');let ids;try{ids=JSON.parse(atob(encoded.replace(/-/g,'+').replace(/_/g,'/')));}catch{throw Error('行程分享内容无法读取。');}if(!Array.isArray(ids)||!ids.length||ids.length>100||ids.some(id=>!safeId(id)))throw Error('行程分享内容无效。');return normalize({format:'kdrama-personal',version:1,favorites:ids},landmarks,redirects);}
  return {normalize,merge,share,readShare};
});
