(() => {
  const $=id=>document.getElementById(id);let records=[],saved=[],loading=false,epoch=0; const time=window.KdramaTime;
  const changed=()=>{$('submission-form').dispatchEvent(new Event('change',{bubbles:true}));};
  let dbPromise;
  function database(){return dbPromise ||= new Promise((resolve,reject)=>{const r=indexedDB.open('kdrama-submission-files',1);r.onupgradeneeded=()=>r.result.createObjectStore('draft');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
  async function storage(write,files){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('draft',write?'readwrite':'readonly'),r=write?tx.objectStore('draft').put(files,'images'):tx.objectStore('draft').get('images');tx.oncomplete=()=>resolve(r.result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}
  const fileKey=f=>[f.name,f.size,f.lastModified].join(':');
  function persist(){if(!loading)storage(true,records.map(r=>r.file)).catch(()=>{$('image-draft-status').textContent='图片副本未能保存在浏览器；下次打开请重新选图，文字仍会保存。';});}
  function make(file,old={}){return {file,url:URL.createObjectURL(file),description:old.description??$('description').value,episode:Object.hasOwn(old,'episode')?old.episode:($('episode').value?Number($('episode').value):null),timeText:old.timeText??(Object.hasOwn(old,'timeSeconds')?time.format(old.timeSeconds):time.format(time.filename(file.name))||$('time-seconds').value),imageCredit:old.imageCredit??$('image-credit').value,crop:old.crop?{...old.crop}:{x:50,y:50}};}
  const matches=(old,file)=>old.fileKey?old.fileKey===fileKey(file):old.filename===file.name;
  const missing=()=>saved.filter(old=>!records.some(r=>matches(old,r.file)));
  function move(index,offset){const target=index+offset;if(target<0||target>=records.length)return;const [record]=records.splice(index,1);records.splice(target,0,record);render();persist();changed();}

  function render(){
    $('multi-images').replaceChildren();
    $('scene-details').hidden=records.length>0;
    $('image-credit').closest('label').hidden=records.length>0;
    records.forEach((record,index)=>{
      const card=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=`场景 ${index+1} · ${record.file.name}`;card.append(legend);
      const actions=document.createElement('div');actions.className='image-actions';for(const [title,offset]of [['上移',-1],['下移',1]]){const b=document.createElement('button');b.type='button';b.textContent=title;b.disabled=index+offset<0||index+offset>=records.length;b.onclick=()=>move(index,offset);actions.append(b);}card.append(actions);
      const frame=document.createElement('div');frame.className='image-preview-frame';const img=document.createElement('img');img.src=record.url;img.alt='地图卡片裁剪预览';img.style.objectPosition=`${record.crop.x}% ${record.crop.y}%`;frame.append(img);card.append(frame);img.onerror=()=>{$('form-status').textContent='有图片无法解码，请移除后换一张图片。';record.invalid=true;};
      for(const key of ['x','y']){const label=document.createElement('label');label.textContent=key==='x'?'裁剪位置：左右':'裁剪位置：上下';const input=document.createElement('input');input.type='range';input.min=0;input.max=100;input.value=record.crop[key];input.oninput=()=>{record.crop[key]=Number(input.value);img.style.objectPosition=`${record.crop.x}% ${record.crop.y}%`;changed();};label.append(input);card.append(label);}
      const fields=document.createElement('div');fields.className='two';
      for(const [key,title]of [['episode','集数（可选）'],['timeText','时间（分:秒或秒数，可选）'],['description','场景描述（可选）'],['imageCredit','图片署名（可选）']]){const label=document.createElement('label');label.textContent=title;const input=document.createElement('input');input.type=key==='episode'?'number':'text';input.value=record[key]??'';input.maxLength=key==='description'?800:160;input.dataset.sceneField=key;input.oninput=()=>{record[key]=input.type==='number'?(input.value===''?null:Number(input.value)):input.value;changed();};label.append(input);fields.append(label);}
      card.append(fields);const remove=document.createElement('button');remove.type='button';remove.textContent='移除这张';remove.onclick=()=>{URL.revokeObjectURL(record.url);saved=saved.filter(old=>!matches(old,record.file));records.splice(index,1);render();persist();changed();$('submission-form').dispatchEvent(new Event('change',{bubbles:true}));};card.append(remove);$('multi-images').append(card);
    });
    $('image-preview').hidden=true;
  }

  function reset(){epoch++;records.forEach(r=>URL.revokeObjectURL(r.url));records=[];saved=[];render();}
  function clear(){reset();loading=false;$('image').disabled=false;persist();}
  function select(files){
    if(loading)throw Error('正在恢复图片，请稍后添加。');if(!files.length)return;
    if(records.length+files.length>12)throw Error('每次投稿最多 12 张图片，请先移除部分图片再添加。');
    for(const f of files)if(f.size>5000000||!['image/jpeg','image/png','image/webp'].includes(f.type))throw Error('每张图片需为 JPG、PNG 或 WebP，且不超过 5 MB；已有图片已保留。');
    records.push(...files.map(file=>make(file,saved.find(r=>r.fileKey===fileKey(file))||saved.find(r=>!r.fileKey&&r.filename===file.name))));render();persist();changed();
  }
  function add(files){try{select(files);$('form-status').textContent='';}catch(e){$('form-status').textContent=e.message;}}
  const zone=$('image-dropzone');zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('dragover');});zone.addEventListener('dragleave',()=>zone.classList.remove('dragover'));zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('dragover');add([...e.dataTransfer.files]);});
  document.addEventListener('paste',e=>{if(document.querySelector('[data-step="2"]').hidden)return;const files=[...(e.clipboardData?.files||[])].filter(f=>f.type.startsWith('image/'));if(files.length){e.preventDefault();add(files);}});
  window.KdramaImages={select,clear,ready:()=>!loading,missing:()=>missing().map(r=>r.filename),discardMissing:()=>{saved=saved.filter(old=>records.some(r=>matches(old,r.file)));changed();},files:()=>records.map(r=>r.file),draft:()=>[...records.map(({file,description,episode,timeText,imageCredit,crop})=>({filename:file.name,fileKey:fileKey(file),description,episode,timeText,imageCredit,crop})),...missing()],
    restore:async data=>{reset();saved=Array.isArray(data)?data:[];const version=epoch;if(!saved.length){loading=false;$('image').disabled=false;return;}loading=true;$('image').disabled=true;$('image-draft-status').textContent='正在恢复本机图片草稿…';
      try{const files=await storage(false);if(version!==epoch)return;records=saved.map(old=>{const file=(files||[]).find(f=>old.fileKey?fileKey(f)===old.fileKey:f.name===old.filename);return file?make(file,old):null;}).filter(Boolean);render();$('image-draft-status').textContent=records.length===saved.length?'已恢复本机图片副本；尚未上传到 GitHub。':'部分图片副本不可用，请重新选择缺少的图片。';document.dispatchEvent(new Event('submission-images-restored'));}
      catch{$('image-draft-status').textContent='图片副本不可用，请重新选图；对应说明和裁剪草稿已保留。';}
      finally{if(version===epoch){loading=false;$('image').disabled=false;}}
    },payload:()=>records.map((r,i)=>{if(r.invalid)throw Error('请移除无法解码的图片。');if(r.episode!=null&&(!Number.isInteger(r.episode)||r.episode<1||r.episode>1000))throw Error(`场景 ${i+1} 的集数无效。`);let timeSeconds;try{timeSeconds=time.parse(r.timeText);}catch(e){throw Error(`场景 ${i+1}：${e.message}`);}return {key:'s'+(i+1),attachment:true,filename:r.file.name,description:r.description,episode:r.episode,timeSeconds,imageCredit:r.imageCredit,crop:r.crop};})};
})();
