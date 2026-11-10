(() => {
  'use strict';
  const $=id=>document.getElementById(id), catalog=window.KDRAMA_CATALOG, core=window.KdramaMaintenance, repo=window.KDRAMA_REPO;
  let entity='works',operations=[],originalIssue=null,map,marker,editRevision=0;
  const issue=new URLSearchParams(location.search).get('issue'),draftKey='kdrama-maintenance-draft-v1:'+repo+':'+(issue||'new');
  let formDrafts={},saveTimer,restoring=true;
  function rememberEditor(){const item=current();if(item)formDrafts[entity+':'+item.id]=Object.fromEntries([...$('manage-fields').querySelectorAll('[data-field]')].map(input=>[input.dataset.field,input.value]));}
  function saveDraft(){if(restoring)return;clearTimeout(saveTimer);try{localStorage.setItem(draftKey,JSON.stringify({version:1,entity,operations,originalIssue:originalIssue?{number:originalIssue.number,body:originalIssue.body}:null,formDrafts,workId:$('manage-work').value,itemId:$('manage-item').value,search:$('manage-search').value,rights:$('manage-rights').checked,savedAt:new Date().toISOString()}));$('manage-draft-status').textContent='维护草稿已保存到当前浏览器；尚未发布。';}catch{$('manage-draft-status').textContent='浏览器未能保存草稿，请先生成并复制维护正文，再关闭页面。';}}
  function scheduleSave(){if(!restoring){clearTimeout(saveTimer);saveTimer=setTimeout(saveDraft,200);}}

  const labels={title:'中文名',original:'韩文原名',year:'年份',type:'作品类型',color:'作品颜色',poster:'海报地址',aliases:'搜索别名（用逗号分隔）',name:'地点名称',ko:'韩文名称',group:'分组',city:'城市',address:'地址',visit:'到访提示',lat:'纬度',lng:'经度',order:'排序',description:'场景描述',episode:'集数',timeSeconds:'播放时间（秒）',image:'场景图片地址',imageCredit:'署名'};
  const say=(text,error=false)=>{$('manage-status').textContent=text;$('manage-status').style.color=error?'#a33':'';};
  const invalidate=()=>{editRevision++;$('manage-result').hidden=true;$('manage-output').value='';scheduleSave();};
  const current=()=>catalog[entity].find(x=>x.id===(entity==='works'?$('manage-work').value:$('manage-item').value));
  function option(parent,id,title){const e=document.createElement('option');e.value=id;e.textContent=title;parent.append(e);}
  function items(){const id=$('manage-work').value;return entity==='works'?catalog.works.filter(w=>w.id===id):entity==='landmarks'?catalog.landmarks.filter(p=>p.workId===id):catalog.scenes.filter(s=>catalog.landmarks.some(p=>p.id===s.landmarkId&&p.workId===id));}
  function works(){const old=$('manage-work').value,q=$('manage-search').value.toLocaleLowerCase();$('manage-work').replaceChildren();for(const w of catalog.works.filter(w=>[w.title,w.original,...(w.aliases||[])].join(' ').toLocaleLowerCase().includes(q)))option($('manage-work'),w.id,w.title+' · '+w.original);if([...$('manage-work').options].some(o=>o.value===old))$('manage-work').value=old;list();}
  function list(){
    const oldItem=$('manage-item').value;$('manage-item').replaceChildren();
    for(const item of items())option($('manage-item'),item.id,item.name||((catalog.landmarks.find(p=>p.id===item.landmarkId)?.name||'')+' · '+(item.episode?`第 ${item.episode} 集 · `:'')+(item.description||item.id)));
    $('manage-item-label').hidden=entity==='works';$('manage-bulk').hidden=entity!=='landmarks';$('manage-delete').hidden=entity!=='scenes';
    const places=catalog.landmarks.filter(p=>p.workId===$('manage-work').value);
    $('manage-selection').replaceChildren();$('manage-merge-target').replaceChildren();
    for(const p of places){const l=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.value=p.id;l.append(c,document.createTextNode(p.name));$('manage-selection').append(l);option($('manage-merge-target'),p.id,p.name);}
    if([...$('manage-item').options].some(o=>o.value===oldItem))$('manage-item').value=oldItem;
    renderGroups();editor();scheduleSave();
  }
  function editor(){
    $('manage-fields').replaceChildren();const base=current();$('manage-form').hidden=!base;if(!base)return;
    const queued=operations.find(o=>o.entity===entity&&o.id===base.id),item={...base,...queued?.changes};
    for(const [key,max]of Object.entries(core.fields[entity])){
      const l=document.createElement('label');l.textContent=labels[key];let input;
      if(key==='type'){input=document.createElement('select');for(const [id,label]of [['drama','电视剧'],['movie','电影'],['variety','综艺']])option(input,id,label);}
      else {input=document.createElement(['description','visit'].includes(key)?'textarea':'input');if(max)input.maxLength=max;if(input.tagName==='INPUT')input.type=['lat','lng','order','episode','timeSeconds'].includes(key)?'number':key==='color'?'color':'text';if(input.type==='number'){input.step=['lat','lng'].includes(key)?'any':'1';}}
      input.dataset.field=key;input.value=key==='aliases'?(item[key]||[]).join(', '):item[key]??'';if(formDrafts[entity+':'+base.id]&&Object.hasOwn(formDrafts[entity+':'+base.id],key))input.value=formDrafts[entity+':'+base.id][key];input.addEventListener('input',()=>{rememberEditor();invalidate();preview();updateMap(false);});l.append(input);$('manage-fields').append(l);
    }
    preview();updateMap(true);
  }
  function preview(){const input=$('manage-fields').querySelector('[data-field="image"],[data-field="poster"]');const src=input?.value||'';const img=$('manage-image');img.hidden=!src;if(src&&(/^(https:\/\/|\.\/assets\/)/.test(src)))img.src=src;else img.removeAttribute('src');}
  $('manage-image').addEventListener('error',()=>{say('图片无法加载，请检查链接或更换图片。',true);});
  function updateMap(center){
    $('manage-map').hidden=entity!=='landmarks';if(entity!=='landmarks'||!current())return;
    const lat=Number($('manage-fields').querySelector('[data-field=lat]').value),lng=Number($('manage-fields').querySelector('[data-field=lng]').value);if(!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180)return;
    if(!map){map=L.map('manage-map',{minZoom:2,maxZoom:18});L.geoJSON(window.KDRAMA_MAP_DATA.regions).addTo(map);L.control.attribution({prefix:false}).addAttribution('OpenFreeMap / OpenStreetMap · geoBoundaries').addTo(map);marker=L.marker([lat,lng],{draggable:true}).addTo(map);const set=point=>{point=L.latLng(point).wrap();for(const key of ['lat','lng'])$('manage-fields').querySelector(`[data-field=${key}]`).value=point[key].toFixed(6);marker.setLatLng(point);rememberEditor();invalidate();};marker.on('dragend',()=>set(marker.getLatLng()));map.on('click',e=>set(e.latlng));fetch('https://tiles.openfreemap.org/styles/liberty',{signal:AbortSignal.timeout(8000)}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(style=>L.maplibreGL({style}).addTo(map)).catch(()=>say('街道图暂不可用，可输入坐标或使用轮廓图。'));}
    map.invalidateSize();marker.setLatLng([lat,lng]);if(center)map.setView([lat,lng],14);
  }
  function queue(op){delete formDrafts[op.entity+':'+op.id];operations=operations.filter(o=>o.entity!==op.entity||o.id!==op.id);operations.push(op);invalidate();renderChanges();renderGroups();}
  function renderChanges(){
    $('manage-changes').replaceChildren();
    if(!operations.length){$('manage-changes').textContent='还没有待发布变更。';return;}
    operations.forEach((op,i)=>{const row=document.createElement('article');row.className='manage-change';const title=document.createElement('strong');title.textContent=(op.before.title||op.before.name||op.id)+' · '+({update:'修改',delete:'删除场景',merge:'合并地点'}[op.action]);row.append(title);const details=document.createElement('pre');details.textContent=op.action==='update'?Object.entries(op.changes).map(([key,v])=>`${labels[key]}：${JSON.stringify(op.before[key]??'')} → ${JSON.stringify(v)}`).join('\n'):op.action==='merge'?`转移到：${op.beforeTarget.name}（${catalog.scenes.filter(s=>s.landmarkId===op.id).length} 条场景）`:'删除这条场景及其图片引用（不会删除原始附件）';row.append(details);const remove=document.createElement('button');remove.type='button';remove.textContent='撤销此项';remove.onclick=()=>{delete formDrafts[op.entity+':'+op.id];operations.splice(i,1);invalidate();renderChanges();renderGroups();editor();};row.append(remove);$('manage-changes').append(row);});
  }
  $('manage-form').onsubmit=e=>{e.preventDefault();try{const before=current(),changes={};for(const input of $('manage-fields').querySelectorAll('[data-field]')){const key=input.dataset.field;let value=input.value.trim();if(key==='aliases')value=value?value.split(/[,，]/).map(s=>s.trim()).filter(Boolean):[];else if(['episode','timeSeconds','order'].includes(key))value=value===''?(key==='order'?0:null):Number(value);else if(['lat','lng'].includes(key))value=Number(value);if(core.stable(value)!==core.stable(before[key]??(key==='aliases'?[]:key==='order'?0:key==='episode'||key==='timeSeconds'?null:'')))changes[key]=value;}
      if('lat'in changes||'lng'in changes){changes.lat=Number($('manage-fields').querySelector('[data-field=lat]').value);changes.lng=Number($('manage-fields').querySelector('[data-field=lng]').value);}
      if(!Object.keys(changes).length)throw Error('没有修改内容。');queue({entity,id:before.id,action:'update',before:structuredClone(before),changes});say('已加入变更清单。');
    }catch(e){say(e.message,true);}};
  $('manage-delete').onclick=()=>{const before=current();if(before&&confirm('将这条场景加入删除清单？发布后才生效。'))queue({entity:'scenes',id:before.id,action:'delete',before:structuredClone(before)});};

  function effectivePlaces(){return catalog.landmarks.filter(p=>p.workId===$('manage-work').value).filter(p=>!operations.some(o=>o.entity==='landmarks'&&o.id===p.id&&o.action==='merge')).map(p=>({...p,...operations.find(o=>o.entity==='landmarks'&&o.id===p.id)?.changes})).sort((a,b)=>(a.order??100000)-(b.order??100000));}
  function groups(){const result=[];for(const p of effectivePlaces()){const name=p.group||'';let group=result.find(g=>g.name===name);if(!group){group={name,places:[]};result.push(group);}group.places.push(p);}return result.sort((a,b)=>a.name===''?1:b.name===''?-1:0);}
  function stageChanges(updates){
    // Validate the whole batch before staging: never overwrite a pending merge.
    const next=structuredClone(operations);
    for(const [id,fields] of updates){const before=catalog.landmarks.find(p=>p.id===id),old=next.find(o=>o.entity==='landmarks'&&o.id===id);
      if(!before||old&&old.action!=='update'||next.some(o=>o.action==='merge'&&o.targetId===id))throw Error('请先撤销涉及此地点的合并，再修改分组或排序。');
      const changes={...old?.changes,...fields};for(const key of Object.keys(changes))if(core.stable(changes[key])===core.stable(before[key]??(key==='group'?'':key==='order'?0:'')))delete changes[key];
      const index=next.findIndex(o=>o.entity==='landmarks'&&o.id===id);if(index>=0)next.splice(index,1);if(Object.keys(changes).length)next.push({entity:'landmarks',id,action:'update',before:structuredClone(before),changes});
    }
    operations=next;for(const [id,fields]of updates){const draft=formDrafts['landmarks:'+id];if(draft)for(const [key,value]of Object.entries(fields))draft[key]=String(value??'');}invalidate();renderChanges();renderGroups();editor();say('已更新待发布清单；线上内容尚未改变。');
  }
  function reorder(list){stageChanges(list.flatMap(g=>g.places).map((p,i)=>[p.id,{order:i+1}]));}
  function button(title,disabled,action){const b=document.createElement('button');b.type='button';b.textContent=title;b.disabled=disabled;b.onclick=()=>{try{action();}catch(e){say(e.message,true);}};return b;}
  function renderGroups(){
    if(entity!=='landmarks')return;const list=groups(),selected=new Set([...$('manage-selection').querySelectorAll('input:checked')].map(c=>c.value)),old=$('manage-rename-from').value;
    $('manage-selection').replaceChildren();$('manage-rename-from').replaceChildren();$('manage-order').replaceChildren();
    for(const [gi,g]of list.entries()){
      option($('manage-rename-from'),g.name,g.name||'未分组');
      const heading=document.createElement('div');heading.className='manage-group-heading';const title=document.createElement('strong');title.textContent=g.name||'未分组';heading.append(title);
      for(const [text,offset]of [['组上移',-1],['组下移',1]])heading.append(button(text,!g.name||gi+offset<0||gi+offset>=list.length||!list[gi+offset]?.name,()=>{const [item]=list.splice(gi,1);list.splice(gi+offset,0,item);reorder(list);}));$('manage-order').append(heading);
      for(const [pi,p]of g.places.entries()){
        const label=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.value=p.id;c.checked=selected.has(p.id);label.append(c,document.createTextNode((g.name||'未分组')+' · '+p.name));$('manage-selection').append(label);
        const row=document.createElement('div');row.className='manage-order-row';row.dataset.placeId=p.id;const name=document.createElement('span');name.textContent=p.name;row.append(name);
        for(const [text,offset]of [['上移',-1],['下移',1]])row.append(button(text,pi+offset<0||pi+offset>=g.places.length,()=>{const [item]=g.places.splice(pi,1);g.places.splice(pi+offset,0,item);reorder(list);}));$('manage-order').append(row);
      }
    }if(list.some(g=>g.name===old))$('manage-rename-from').value=old;
  }
  $('manage-group-apply').onclick=()=>{try{const selected=[...$('manage-selection').querySelectorAll('input:checked')];if(!selected.length)throw Error('请先勾选需要移动的地点。');stageChanges(selected.map(c=>[c.value,{group:$('manage-group').value.trim()}]));}catch(e){say(e.message,true);}};
  $('manage-rename').onclick=()=>{try{const from=$('manage-rename-from').value,to=$('manage-rename-to').value.trim();if(from===to)throw Error('新旧组名相同。');const targets=effectivePlaces().filter(p=>(p.group||'')===from);if(!targets.length)throw Error('请先选择一个分组。');stageChanges(targets.map(p=>[p.id,{group:to}]));$('manage-rename-to').value='';}catch(e){say(e.message,true);}};
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
  $('manage-search').oninput=works;$('manage-work').onchange=list;$('manage-item').onchange=()=>{editor();scheduleSave();};$('manage-rights').onchange=invalidate;
  document.querySelectorAll('[data-entity]').forEach(b=>b.onclick=()=>{entity=b.dataset.entity;list();});

  let draft=null;try{draft=JSON.parse(localStorage.getItem(draftKey)||'null');}catch{}
  if(draft?.version===1&&Array.isArray(draft.operations)&&draft.operations.every(o=>o&&core.fields[o.entity]&&o.before&&typeof o.id==='string')){
    operations=draft.operations;entity=core.fields[draft.entity]?draft.entity:'works';formDrafts=draft.formDrafts||{};originalIssue=draft.originalIssue||null;$('manage-search').value=draft.search||'';$('manage-rights').checked=draft.rights===true;
  }else draft=null;
  works();if(draft){$('manage-work').value=draft.workId;list();$('manage-item').value=draft.itemId;editor();$('manage-draft-status').textContent='已恢复本机维护草稿，包含待发布清单和未加入清单的编辑。';if(operations.length)try{core.apply(catalog,{version:2,kind:'maintenance',operations,rightsConfirmed:true});}catch(e){say('草稿与现有资料存在冲突，请检查或撤销相关项后再生成：'+e.message,true);}}
  renderChanges();restoring=false;
  $('manage-clear-draft').onclick=()=>{if(!confirm('清空本机维护草稿和待发布清单？不会修改线上内容。'))return;clearTimeout(saveTimer);operations=[];formDrafts={};originalIssue=null;try{localStorage.removeItem(draftKey);}catch{}invalidate();renderChanges();list();saveDraft();$('manage-draft-status').textContent='已清空本机维护草稿。';};
  window.addEventListener('pagehide',saveDraft);
  if(issue&&!draft)(async()=>{try{const number=KdramaSubmission.parseIssueNumber(issue,repo),r=await fetch(`https://api.github.com/repos/${repo}/issues/${number}`,{signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error('无法加载 Issue。');const data=await r.json(),parsed=KdramaSubmission.parseIssue(data.body);if(parsed.payload.kind!=='maintenance')throw Error('此 Issue 不是维护投稿。');if((catalog.updates||[]).some(u=>Number(u.issueNumber)===number)){say('这条维护投稿已经发布；如需继续修改，请在本页创建新的变更清单。');return;}core.apply(catalog,parsed.payload);originalIssue=data;operations=parsed.payload.operations;$('manage-rights').checked=parsed.payload.rightsConfirmed===true;renderChanges();say('已加载维护投稿 #'+number);}catch(e){say(e.message,true);}})();
})();
