(() => {
  const $=id=>document.getElementById(id),core=KdramaCompare,c=$('compare-preview'),ctx=c.getContext('2d'),key='kdrama-compare-simple-v1';
  const catalog=window.KDRAMA_CATALOG,scene=catalog.scenes.find(s=>s.id===new URLSearchParams(location.search).get('scene')),place=catalog.landmarks.find(p=>p.id===scene?.landmarkId),work=catalog.works.find(w=>w.id===place?.workId);
  const title=place?`${work?.title||''} · ${place.name}`:'巡礼对比图';if(place){$('compare-title').textContent=title;$('compare-back').href='./index.html?scene='+encodeURIComponent(scene.id)+'#place='+encodeURIComponent(place.id);}
  let settings=core.normalize(),images={scene:null,photo:null},urls={},generation={scene:0,photo:0},pasteTarget='photo',resultUrl='',version=0;
  try{settings=core.normalize(JSON.parse(localStorage.getItem(key)||'{}'));}catch{}
  function save(){try{localStorage.setItem(key,JSON.stringify(settings));}catch{}}
  function render(){
    version++;const pair=['scene','photo'],ratios=pair.map(k=>images[k]?images[k].naturalWidth/images[k].naturalHeight:16/9),layout=core.layout(settings,ratios);
    c.width=layout.width;c.height=layout.height;ctx.fillStyle=settings.background;ctx.fillRect(0,0,c.width,c.height);
    pair.forEach((kind,i)=>{if(images[kind])ctx.drawImage(images[kind],...layout.boxes[i]);const el=$(kind+'-image');el.hidden=!images[kind];$(kind+'-zone').classList.toggle('empty',!images[kind]);$(kind+'-zone').style.flex=settings.mode==='side'?String(ratios[i]):'';});
    const area=$('compare-pictures');area.classList.toggle('horizontal',settings.mode==='side');area.style.background=settings.background;const gap=settings.gap*area.clientWidth/1600;area.style.padding=gap+'px';area.style.gap=gap+'px';
    $('compare-gap').value=settings.gap;$('gap-value').value=settings.gap;$('compare-background').value=settings.background;
    document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===settings.mode)));
    $('compare-download').disabled=$('compare-share').disabled=!images.scene||!images.photo;
  }
  function load(src){return new Promise((resolve,reject)=>{const img=new Image();if(!src.startsWith('blob:'))img.crossOrigin='anonymous';img.onload=()=>img.naturalWidth*img.naturalHeight>40_000_000?reject(Error('图片超过 4000 万像素，请先缩小。')):resolve(img);img.onerror=()=>reject(Error('图片无法加载，请点击图片区域重新选择。'));img.src=src;});}
  async function choose(file,kind){if(!file)return;const token=++generation[kind];let url;try{if(file.size>12_000_000||!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('请选择 12 MB 以内的 JPG、PNG 或 WebP 图片。');url=URL.createObjectURL(file);const img=await load(url);if(token!==generation[kind]){URL.revokeObjectURL(url);return;}if(urls[kind])URL.revokeObjectURL(urls[kind]);urls[kind]=url;images[kind]=img;$(kind+'-image').src=url;render();$('compare-status').textContent='';}catch(e){if(url)URL.revokeObjectURL(url);if(token===generation[kind])$('compare-status').textContent=e.message;}}
  for(const kind of ['scene','photo']){const input=$('compare-'+kind),zone=$(kind+'-zone');input.onchange=()=>{choose(input.files[0],kind);input.value='';};zone.addEventListener('pointerdown',()=>pasteTarget=kind);zone.addEventListener('focusin',()=>pasteTarget=kind);zone.ondragover=e=>{e.preventDefault();zone.classList.add('dragover');};zone.ondragleave=()=>zone.classList.remove('dragover');zone.ondrop=e=>{e.preventDefault();zone.classList.remove('dragover');pasteTarget=kind;choose(e.dataTransfer.files[0],kind);};}
  document.addEventListener('paste',e=>{const file=[...(e.clipboardData?.files||[])].find(f=>f.type.startsWith('image/'));if(file){e.preventDefault();choose(file,pasteTarget);}});
  for(const name of ['gap','background'])$('compare-'+name).oninput=e=>{settings=core.normalize({...settings,[name]:e.target.value});render();save();};
  document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{settings.mode=b.dataset.mode;render();save();});
  window.addEventListener('resize',render);
  const encode=()=>new Promise((resolve,reject)=>{try{c.toBlob(blob=>blob?resolve(blob):reject(Error('生成失败，请重新选择图片。')),'image/png');}catch{reject(Error('图片来源不允许导出，请选择本地截图后重试。'));}});
  const filename=()=>`kdrama-${place?.id||'compare'}.png`;
  function showResult(blob){if(resultUrl)URL.revokeObjectURL(resultUrl);resultUrl=URL.createObjectURL(blob);$('compare-result').src=resultUrl;$('save-file').href=resultUrl;$('save-file').download=filename();if(!$('compare-save-dialog').open)$('compare-save-dialog').showModal();}
  $('compare-download').onclick=async()=>{const at=version;try{const blob=await encode();if(at!==version)throw Error('图片已变化，请重新保存。');showResult(blob);}catch(e){$('compare-status').textContent=e.message;}};
  $('compare-share').onclick=async()=>{const at=version;try{const blob=await encode();if(at!==version)throw Error('图片已变化，请重新分享。');const file=new File([blob],filename(),{type:'image/png'});if(navigator.canShare?.({files:[file]}))await navigator.share({files:[file],title});else showResult(blob);}catch(e){$('compare-status').textContent=e.name==='AbortError'?'已取消分享。':e.message;}};
  $('close-save').onclick=()=>$('compare-save-dialog').close();
  render();if(scene?.image){const token=++generation.scene;load(scene.image).then(img=>{if(token!==generation.scene)return;images.scene=img;$('scene-image').src=scene.image;render();}).catch(e=>{if(token===generation.scene)$('compare-status').textContent=e.message;});}
  window.addEventListener('pagehide',e=>{if(!e.persisted){Object.values(urls).forEach(URL.revokeObjectURL);if(resultUrl)URL.revokeObjectURL(resultUrl);}});
})();
