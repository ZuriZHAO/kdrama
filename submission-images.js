(() => {
  const $=id=>document.getElementById(id);let records=[],saved=[];
  const changed=()=>{$('submission-form').dispatchEvent(new Event('input',{bubbles:true}));};
  function render(){
    $('multi-images').replaceChildren();
    $('scene-details').hidden=records.length>0;
    $('image-credit').closest('label').hidden=records.length>0;
    records.forEach((record,index)=>{
      const card=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=`场景 ${index+1} · ${record.file.name}`;card.append(legend);
      const frame=document.createElement('div');frame.className='image-preview-frame';const img=document.createElement('img');img.src=record.url;img.alt='地图卡片裁剪预览';img.style.objectPosition=`${record.crop.x}% ${record.crop.y}%`;frame.append(img);card.append(frame);img.onerror=()=>{$('form-status').textContent='有图片无法解码，请移除后换一张图片。';record.invalid=true;};
      for(const key of ['x','y']){const label=document.createElement('label');label.textContent=key==='x'?'裁剪位置：左右':'裁剪位置：上下';const input=document.createElement('input');input.type='range';input.min=0;input.max=100;input.value=record.crop[key];input.oninput=()=>{record.crop[key]=Number(input.value);img.style.objectPosition=`${record.crop.x}% ${record.crop.y}%`;changed();};label.append(input);card.append(label);}
      const fields=document.createElement('div');fields.className='two';
      for(const [key,title]of [['episode','集数（可选）'],['timeSeconds','时间，秒（可选）'],['description','场景描述（可选）'],['imageCredit','图片署名（可选）']]){const label=document.createElement('label');label.textContent=title;const input=document.createElement('input');input.type=['episode','timeSeconds'].includes(key)?'number':'text';input.value=record[key]??'';input.maxLength=key==='description'?800:160;input.dataset.sceneField=key;input.oninput=()=>{record[key]=input.type==='number'?(input.value===''?null:Number(input.value)):input.value;changed();};label.append(input);fields.append(label);}
      card.append(fields);const remove=document.createElement('button');remove.type='button';remove.textContent='移除这张';remove.onclick=()=>{URL.revokeObjectURL(record.url);records.splice(index,1);render();changed();$('submission-form').dispatchEvent(new Event('change',{bubbles:true}));};card.append(remove);$('multi-images').append(card);
    });
    $('image-preview').hidden=true;
  }
  function clear(){records.forEach(r=>URL.revokeObjectURL(r.url));records=[];saved=[];render();}
  function select(files){
    if(files.length>12)throw Error('一次最多选择 12 张图片。');
    for(const f of files)if(f.size>5000000||!['image/jpeg','image/png','image/webp'].includes(f.type))throw Error('每张图片需为 JPG、PNG 或 WebP，且不超过 5 MB。');
    records.forEach(r=>URL.revokeObjectURL(r.url));records=files.map((file,i)=>{const old=saved.find(r=>r.filename===file.name)||{};return {file,url:URL.createObjectURL(file),description:old.description??$('description').value,episode:Object.hasOwn(old,'episode')?old.episode:($('episode').value?Number($('episode').value):null),timeSeconds:Object.hasOwn(old,'timeSeconds')?old.timeSeconds:($('time-seconds').value?Number($('time-seconds').value):null),imageCredit:old.imageCredit??$('image-credit').value,crop:old.crop||{x:50,y:50}};});render();
  }
  window.KdramaImages={select,clear,files:()=>records.map(r=>r.file),draft:()=>records.length?records.map(({file,description,episode,timeSeconds,imageCredit,crop})=>({filename:file.name,description,episode,timeSeconds,imageCredit,crop})):saved,restore:data=>{clear();saved=Array.isArray(data)?data:[];},payload:()=>records.map((r,i)=>{if(r.invalid)throw Error('请移除无法解码的图片。');for(const [key,min,max]of [['episode',1,1000],['timeSeconds',0,100000]])if(r[key]!=null&&(!Number.isInteger(r[key])||r[key]<min||r[key]>max))throw Error(`场景 ${i+1} 的集数或时间无效。`);return {key:'s'+(i+1),attachment:true,filename:r.file.name,description:r.description,episode:r.episode,timeSeconds:r.timeSeconds,imageCredit:r.imageCredit,crop:r.crop};})};
})();
