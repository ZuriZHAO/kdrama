(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.KdramaMaintenance=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const fields={works:{title:120,original:120,year:4,type:20,color:7,poster:1000,aliases:0},landmarks:{name:120,ko:120,group:100,city:100,address:240,visit:500,lat:0,lng:0,order:0},scenes:{description:800,episode:0,timeSeconds:0,image:1000,imageCredit:160,order:0}};
  const stable=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
  function image(value){
    if(value==null||value==='')return true;
    if(typeof value!=='string')return false;
    if(/^\.\/assets\/[A-Za-z0-9/_-]+\.(jpg|jpeg|png|webp|avif)$/i.test(value))return true;
    try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}
  }
  function apply(catalog,payload){
    if(payload?.kind!=='maintenance'||payload.version!==2||!Array.isArray(payload.operations)||!payload.operations.length||payload.operations.length>300)throw Error('维护操作应为 1–300 项。');
    const next=JSON.parse(JSON.stringify(catalog)), touched=new Set(), workIds=new Set(), changes=[];
    for(const op of payload.operations){
      if(!op||!Object.hasOwn(fields,op.entity)||typeof op.id!=='string')throw Error('维护对象无效。');
      const list=next[op.entity], item=list.find(x=>x.id===op.id), key=op.entity+':'+op.id;
      if(!item||touched.has(key))throw Error('对象不存在或同一对象被重复修改：'+op.id);
      if(stable(item)!==stable(op.before))throw Error('资料已变化，请刷新后重新编辑：'+op.id);
      touched.add(key);
      const workId=op.entity==='works'?item.id:op.entity==='landmarks'?item.workId:next.landmarks.find(p=>p.id===item.landmarkId)?.workId;
      if(workId)workIds.add(workId);
      if(op.action==='delete'){
        if(op.entity!=='scenes')throw Error('仅支持删除指定场景；重复地点请使用合并。');
        list.splice(list.indexOf(item),1);changes.push({entity:op.entity,id:op.id,before:item,after:null});continue;
      }
      if(op.action==='merge'){
        const target=next.landmarks.find(p=>p.id===op.targetId);
        if(op.entity!=='landmarks'||!target||target.id===item.id||target.workId!==item.workId||stable(target)!==stable(op.beforeTarget))throw Error('合并目标必须是未变化的同作品地点。');
        if(touched.has('landmarks:'+target.id))throw Error('合并目标不能同时修改。');
        touched.add('landmarks:'+target.id);
        next.scenes.forEach(s=>{if(s.landmarkId===item.id)s.landmarkId=target.id;});
        (next.revisions||[]).forEach(s=>{if(s.landmarkId===item.id)s.landmarkId=target.id;});
        (next.updates||[]).forEach(s=>{if(s.landmarkId===item.id)s.landmarkId=target.id;});
        next.redirects ||= {};next.redirects[item.id]=target.id;
        for(const id of Object.keys(next.redirects))if(next.redirects[id]===item.id)next.redirects[id]=target.id;
        list.splice(list.indexOf(item),1);changes.push({entity:op.entity,id:op.id,before:item,after:{mergedInto:target.id}});continue;
      }
      if(op.action!=='update'||!op.changes||typeof op.changes!=='object'||Array.isArray(op.changes)||!Object.keys(op.changes).length)throw Error('维护变更为空或无效。');
      const before=JSON.parse(JSON.stringify(item));
      for(const [key,value]of Object.entries(op.changes)){
        if(!Object.hasOwn(fields[op.entity],key))throw Error('不支持的维护字段：'+key);
        if(key==='aliases'){
          if(!Array.isArray(value)||value.length>30||value.some(v=>typeof v!=='string'||!v.trim()||v.length>120))throw Error('别名格式无效。');
        }else if(['lat','lng','order','episode','timeSeconds'].includes(key)){
          if(!(['episode','timeSeconds'].includes(key)&&value===null)){
            if(typeof value!=='number'||!Number.isFinite(value))throw Error(key+' 必须是数字。');
            const ranges={lat:[-90,90],lng:[-180,180],order:[0,100000],episode:[1,1000],timeSeconds:[0,100000]};
            if(value<ranges[key][0]||value>ranges[key][1]||(!['lat','lng'].includes(key)&&!Number.isInteger(value)))throw Error(key+' 超出范围。');
          }
        }else if(!(value===null&&['poster','image'].includes(key))&&(typeof value!=='string'||value.length>fields[op.entity][key]||/[\u0000-\u001f]/.test(value.replace(/[\n\r\t]/g,''))))throw Error(key+' 格式无效。');
        item[key]=value;
      }
      if(op.entity==='works'){
        if(!item.title?.trim()||(item.year&&!/^\d{4}$/.test(item.year))||!['drama','movie','variety'].includes(item.type||'drama')||!/^#[0-9a-f]{6}$/i.test(item.color)||!image(item.poster))throw Error('作品名称、年份、类型、颜色或海报无效。');
      }else if(op.entity==='landmarks'){
        if(!item.name?.trim()||Object.hasOwn(op.changes,'lat')!==Object.hasOwn(op.changes,'lng'))throw Error('地点名称或坐标不完整。');
        if(Object.hasOwn(op.changes,'lat'))Object.assign(item,{coordinateStatus:'approximate',verifiedAt:null,coordinateSourceId:null,entrance:null,coordinateNote:'维护者调整坐标；具体入口及机位待核实。'});
        item.query=item.ko||item.name;
      }else{
        if(!item.description&&!item.image)throw Error('场景至少保留描述或图片。');
        if(!image(item.image))throw Error('图片地址无效。');
        if(item.image!==before.image){delete item.thumbnail;delete item.mediumImage;delete item.mediaSource;}
      }
      if(stable(before)===stable(item))throw Error('没有实际变化：'+op.id);
      if(((op.entity==='works'&&item.poster!==before.poster&&item.poster)||(op.entity==='scenes'&&item.image!==before.image&&item.image))&&payload.rightsConfirmed!==true)throw Error('替换图片请确认展示许可。');
      changes.push({entity:op.entity,id:op.id,before,after:JSON.parse(JSON.stringify(item))});
    }
    return {catalog:next,workIds:[...workIds],changes};
  }
  return {apply,fields,stable};
});
