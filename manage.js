(() => {
  'use strict';
  const $=id=>document.getElementById(id), catalog=window.KDRAMA_CATALOG, core=window.KdramaMaintenance, repo=window.KDRAMA_REPO;
  let entity='works',operations=[],originalIssue=null,map,marker,editRevision=0;
  const labels={title:'中文名',original:'韩文原名',year:'年份',type:'作品类型',color:'作品颜色',poster:'海报地址',aliases:'搜索别名（用逗号分隔）',name:'地点名称',ko:'韩文名称',group:'分组',city:'城市',address:'地址',visit:'到访提示',lat:'纬度',lng:'经度',order:'排序',description:'场景描述',episode:'集数',timeSeconds:'播放时间（秒）',image:'场景图片地址',imageCredit:'署名'};
  const say=(text,error=false)=>{$('manage-status').textContent=text;$('manage-status').style.color=error?'#a33':'';};
  const invalidate=()=>{editRevision++;$('manage-result').hidden=true;$('manage-output').value='';};
  const current=()=>catalog[entity].find(x=>x.id===(entity==='works'?$('manage-work').value:$('manage-item').value));
  function option(parent,id,title){const e=document.createElement('option');e.value=id;e.textContent=title;parent.append(e);}
  function items(){const id=$('manage-work').value;return entity==='works'?catalog.works.filter(w=>w.id===id):entity==='landmarks'?catalog.landmarks.filter(p=>p.workId===id):catalog.scenes.filter(s=>catalog.landmarks.some(p=>p.id===s.landmarkId&&p.workId===id));}
  function works(){const old=$('manage-work').value,q=$('manage-search').value.toLocaleLowerCase();$('manage-work').replaceChildren();for(const w of catalog.works.filter(w=>[w.title,w.original,...(w.aliases||[])].join(' ').toLocaleLowerCase().includes(q)))option($('manage-work'),w.id,w.title+' · '+w.original);if([...$('manage-work').options].some(o=>o.value===old))$('manage-work').value=old;list();}
  function list(){
    $('manage-item').replaceChildren();
    for(const item of items())option($('manage-item'),item.id,item.name||((catalog.landmarks.find(p=>p.id===item.landmarkId)?.name||'')+' · '+(item.episode?`第 ${item.episode} 集 · `:'')+(item.description||item.id)));
    $('manage-item-label').hidden=entity==='works';$('manage-bulk').hidden=entity!=='landmarks';$('manage-delete').hidden=entity!=='scenes';
    const places=catalog.landmarks.filter(p=>p.workId===$('manage-work').value);
    $('manage-selection').replaceChildren();$('manage-merge-target').replaceChildren();
    for(const p of places){const l=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.value=p.id;l.append(c,document.createTextNode(p.name));$('manage-selection').append(l);option($('manage-merge-target'),p.id,p.name);}
    editor();
  }
  function editor(){
    $('manage-fields').replaceChildren();const base=current();$('manage-form').hidden=!base;if(!base)return;
    const queued=operations.find(o=>o.entity===entity&&o.id===base.id),item={...base,...queued?.changes};
    for(const [key,max]of Object.entries(core.fields[entity])){
      const l=document.createElement('label');l.textContent=labels[key];let input;
      if(key==='type'){input=document.createElement('select');for(const [id,label]of [['drama','电视剧'],['movie','电影'],['variety','综艺']])option(input,id,label);}
      else {input=document.createElement(['description','visit'].includes(key)?'textarea':'input');if(max)input.maxLength=max;input.type=['lat','lng','order','episode','timeSeconds'].includes(key)?'number':key==='color'?'color':'text';if(input.type==='number'){input.step=['lat','lng'].includes(key)?'any':'1';}}
      input.dataset.field=key;input.value=key==='aliases'?(item[key]||[]).join(', '):item[key]??'';input.addEventListener('input',()=>{invalidate();preview();updateMap(false);});l.append(input);$('manage-fields').append(l);
    }
    preview();updateMap(true);
  }
  function preview(){const input=$('manage-fields').querySelector('[data-field="image"],[data-field="poster"]');const src=input?.value||'';const img=$('manage-image');img.hidden=!src;if(src&&(/^(https:\/\/|\.\/assets\/)/.test(src)))img.src=src;else img.removeAttribute('src');}
  $('manage-image').addEventListener('error',()=>{say('图片无法加载，请检查链接或更换图片。',true);});
  function updateMap(center){
    $('manage-map').hidden=entity!=='landmarks';if(entity!=='landmarks'||!current())return;
    const lat=Number($('manage-fields').querySelector('[data-field=lat]').value),lng=Number($('manage-fields').querySelector('[data-field=lng]').value);if(!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180)return;
    if(!map){map=L.map('manage-map',{minZoom:2,maxZoom:18});L.geoJSON(window.KDRAMA_MAP_DATA.regions).addTo(map);L.control.attribution({prefix:false}).addAttribution('OpenFreeMap / OpenStreetMap · geoBoundaries').addTo(map);marker=L.marker([lat,lng],{draggable:true}).addTo(map);const set=point=>{point=L.latLng(point).wrap();for(const key of ['lat','lng'])$('manage-fields').querySelector(`[data-field=${key}]`).value=point[key].toFixed(6);marker.setLatLng(point);invalidate();};marker.on('dragend',()=>set(marker.getLatLng()));map.on('click',e=>set(e.latlng));fetch('https://tiles.openfreemap.org/styles/liberty',{signal:AbortSignal.timeout(8000)}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(style=>L.maplibreGL({style}).addTo(map)).catch(()=>say('街道图暂不可用，可输入坐标或使用轮廓图。'));}
    map.invalidateSize();marker.setLatLng([lat,lng]);if(center)map.setView([lat,lng],14);
  }
  function queue(op){operations=operations.filter(o=>o.entity!==op.entity||o.id!==op.id);operations.push(op);invalidate();renderChanges();}
  function renderChanges(){
    $('manage-changes').replaceChildren();
    if(!operations.length){$('manage-changes').textContent='还没有待发布变更。';return;}
    operations.forEach((op,i)=>{const row=document.createElement('article');row.className='manage-change';const title=document.createElement('strong');title.textContent=(op.before.title||op.before.name||op.id)+' · '+({update:'修改',delete:'删除场景',merge:'合并地点'}[op.action]);row.append(title);const details=document.createElement('pre');details.textContent=op.action==='update'?Object.entries(op.changes).map(([key,v])=>`${labels[key]}：${JSON.stringify(op.before[key]??'')} → ${JSON.stringify(v)}`).join('\n'):op.action==='merge'?`转移到：${op.beforeTarget.name}（${catalog.scenes.filter(s=>s.landmarkId===op.id).length} 条场景）`:'删除这条场景及其图片引用（不会删除原始附件）';row.append(details);const remove=document.createElement('button');remove.type='button';remove.textContent='撤销此项';remove.onclick=()=>{operations.splice(i,1);invalidate();renderChanges();editor();};row.append(remove);$('manage-changes').append(row);});
  }
  $('manage-form').onsubmit=e=>{e.preventDefault();try{const before=current(),changes={};for(const input of $('manage-fields').querySelectorAll('[data-field]')){const key=input.dataset.field;let value=input.value.trim();if(key==='aliases')value=value?value.split(/[,，]/).map(s=>s.trim()).filter(Boolean):[];else if(['episode','timeSeconds','order'].includes(key))value=value===''?(key==='order'?0:null):Number(value);else if(['lat','lng'].includes(key))value=Number(value);if(core.stable(value)!==core.stable(before[key]??(key==='aliases'?[]:key==='order'?0:key==='episode'||key==='timeSeconds'?null:'')))changes[key]=value;}
      if('lat'in changes||'lng'in changes){changes.lat=Number($('manage-fields').querySelector('[data-field=lat]').value);changes.lng=Number($('manage-fields').querySelector('[data-field=lng]').value);}
      if(!Object.keys(changes).length)throw Error('没有修改内容。');queue({entity,id:before.id,action:'update',before:structuredClone(before),changes});say('已加入变更清单。');
    }catch(e){say(e.message,true);}};
  $('manage-delete').onclick=()=>{const before=current();if(before&&confirm('将这条场景加入删除清单？发布后才生效。'))queue({entity:'scenes',id:before.id,action:'delete',before:structuredClone(before)});};
  $('manage-group-apply').onclick=()=>{for(const c of $('manage-selection').querySelectorAll('input:checked')){const before=catalog.landmarks.find(p=>p.id===c.value),pending=operations.find(o=>o.entity==='landmarks'&&o.id===before.id);if((before.group||'')!==$('manage-group').value)queue({entity:'landmarks',id:before.id,action:'update',before:structuredClone(before),changes:{...pending?.changes,group:$('manage-group').value}});}say('已将选中地点加入变更清单。');};
  $('manage-merge').onclick=()=>{const before=current(),target=catalog.landmarks.find(p=>p.id===$('manage-merge-target').value);if(!before||!target||before.id===target.id)return say('请选择另一个目标地点。',true);queue({entity:'landmarks',id:before.id,action:'merge',before:structuredClone(before),targetId:target.id,beforeTarget:structuredClone(target)});};
  $('manage-generate').onclick=async()=>{invalidate();const revision=editRevision;try{
    const payload={version:2,kind:'maintenance',operations,rightsConfirmed:$('manage-rights').checked};core.apply(catalog,payload);
    if(originalIssue){const r=await fetch(`https://api.github.com/repos/${repo}/issues/${originalIssue.number}`,{cache:'no-store',signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error('无法检查原 Issue 的最新版本，请稍后重试。');const current=await r.json();if(current.body!==originalIssue.body)throw Error('原 Issue 已变化，请重新打开后处理。');}
    const body=originalIssue?KdramaSubmission.serializeIssue(KdramaSubmission.parseIssue(originalIssue.body),payload):'维护已发布内容，共 '+operations.length+' 项变更。\n\n<!-- KDRAMA_SUBMISSION_V2_START -->\n```json\n'+JSON.stringify(payload,null,2)+'\n```\n<!-- KDRAMA_SUBMISSION_V2_END -->';
    if(body.length>60000)throw Error('变更过多，请分批提交（正文上限 60000 字符）。');
    if(revision!==editRevision)throw Error('生成期间内容已修改，请重新检查并生成。');
    $('manage-output').value=body;const url=new URL(`https://github.com/${repo}/issues/new`);url.searchParams.set('title','维护：'+(catalog.works.find(w=>w.id===$('manage-work').value)?.title||'批量变更'));if(body.length<5500)url.searchParams.set('body',body);
    $('manage-github').href=originalIssue?`https://github.com/${repo}/issues/${originalIssue.number}`:url.href;
    $('manage-instructions').textContent=originalIssue?'复制完整正文，回原 Issue 编辑保存，然后添加 publish-approved 标签。':'复制完整正文，打开 GitHub 后粘贴到正文并提交 Issue；核对后添加 publish-approved 标签。';$('manage-result').hidden=false;say('检查通过，尚未发布。');
  }catch(e){say(e.message,true);}};
  $('manage-copy').onclick=async()=>{try{await navigator.clipboard.writeText($('manage-output').value);say('已复制。');}catch{say('请手动全选正文复制。',true);}};
  $('manage-search').oninput=works;$('manage-work').onchange=list;$('manage-item').onchange=editor;$('manage-rights').onchange=invalidate;
  document.querySelectorAll('[data-entity]').forEach(b=>b.onclick=()=>{entity=b.dataset.entity;list();});
  works();renderChanges();
  const issue=new URLSearchParams(location.search).get('issue');if(issue)(async()=>{try{const number=KdramaSubmission.parseIssueNumber(issue,repo),r=await fetch(`https://api.github.com/repos/${repo}/issues/${number}`,{signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error('无法加载 Issue。');const data=await r.json(),parsed=KdramaSubmission.parseIssue(data.body);if(parsed.payload.kind!=='maintenance')throw Error('此 Issue 不是维护投稿。');if((catalog.updates||[]).some(u=>Number(u.issueNumber)===number)){say('这条维护投稿已经发布；如需继续修改，请在本页创建新的变更清单。');return;}core.apply(catalog,parsed.payload);originalIssue=data;operations=parsed.payload.operations;$('manage-rights').checked=parsed.payload.rightsConfirmed===true;renderChanges();say('已加载维护投稿 #'+number);}catch(e){say(e.message,true);}})();
})();
