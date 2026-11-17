(() => {
  const $=id=>document.getElementById(id),core=KdramaCompare,c=$('compare-preview'),ctx=c.getContext('2d'),key='kdrama-compare-settings-v1';
  const catalog=window.KDRAMA_CATALOG,scene=catalog.scenes.find(s=>s.id===new URLSearchParams(location.search).get('scene')),place=catalog.landmarks.find(p=>p.id===scene?.landmarkId),work=catalog.works.find(w=>w.id===place?.workId);
  const title=place?`${work?.title||''} · ${place.name}`:'巡礼对比图';$('compare-title').textContent=place?title:'选择场景截图与实拍照片';
  if(place)$('compare-back').href='./index.html?scene='+encodeURIComponent(scene.id)+'#place='+encodeURIComponent(place.id);
  let settings=core.normalize(),images={scene:null,photo:null},urls={},generation={scene:0,photo:0},renderVersion=0;
  const ids={mode:'mode',gap:'gap',background:'background',size:'size',divider:'divider',sceneX:'sceneX',sceneY:'sceneY',photoX:'x',photoY:'y',credit:'credit',caption:'caption',swap:'swap',format:'format',opacity:'opacity',sceneZoom:'sceneZoom',photoZoom:'photoZoom'};
  try{const draft=JSON.parse(localStorage.getItem(key)||'null');if(draft?.version===1)settings=core.normalize(draft.settings);}catch{}
  function controls(){for(const [name,id]of Object.entries(ids)){const e=$('compare-'+id);if(e.type==='checkbox')e.checked=settings[name];else e.value=settings[name];}}
  function save(){try{localStorage.setItem(key,JSON.stringify({version:1,settings}));}catch{$('compare-status').textContent='浏览器无法保存排版设置，仍可导出图片。';}}
  function paint(img,box,x,y,zoom){if(!img)return;ctx.drawImage(img,...core.crop(img.naturalWidth,img.naturalHeight,box[2],box[3],x,y,zoom),...box);}
  function render(){renderVersion++;const layout=core.layout(settings);c.width=layout.width;c.height=layout.height;ctx.fillStyle=settings.background;ctx.fillRect(0,0,c.width,c.height);
    const pair=settings.swap?['photo','scene']:['scene','photo'];
    const draw=(kind,box)=>paint(images[kind],box,settings[kind+'X'],settings[kind+'Y'],settings[kind+'Zoom']);
    draw(pair[0],layout.boxes[0]);
    if(settings.mode==='overlay'){const split=c.width*settings.divider/100;ctx.save();ctx.beginPath();ctx.rect(split,0,c.width-split,layout.boxes[0][3]);ctx.clip();draw(pair[1],layout.boxes[1]);ctx.restore();ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(split,0);ctx.lineTo(split,layout.boxes[0][3]);ctx.stroke();}else if(settings.mode==='blend'){ctx.save();ctx.globalAlpha=settings.opacity/100;draw(pair[1],layout.boxes[1]);ctx.restore();}else draw(pair[1],layout.boxes[1]);
    if(settings.caption){const rgb=settings.background.match(/\w{2}/g).map(v=>parseInt(v,16));ctx.fillStyle=rgb[0]*.299+rgb[1]*.587+rgb[2]*.114>150?'#26343c':'#ffffff';ctx.font='22px sans-serif';ctx.fillText(title,20,layout.captionY+30,c.width-40);ctx.font='16px sans-serif';ctx.fillText(['场景截图'+(scene?.imageCredit?'：'+scene.imageCredit:''),'实拍'+(settings.credit?'：'+settings.credit:'')].join(' / '),20,layout.captionY+60,c.width-40);}
    $('compare-divider-label').hidden=settings.mode!=='overlay';$('compare-opacity-label').hidden=settings.mode!=='blend';$('compare-drag-label').hidden=!['overlay','blend'].includes(settings.mode);$('compare-gap').disabled=['overlay','blend'].includes(settings.mode);$('compare-download').disabled=$('compare-share').disabled=!images.scene||!images.photo;
  }
  function load(src){return new Promise((resolve,reject)=>{const img=new Image();if(!src.startsWith('blob:'))img.crossOrigin='anonymous';img.onload=()=>img.naturalWidth*img.naturalHeight>40_000_000?reject(Error('图片超过 4000 万像素，请先缩小。')):resolve(img);img.onerror=()=>reject(Error('图片无法加载，请选择本地截图。'));img.src=src;});}
  async function choose(file,kind){if(!file)return;const token=++generation[kind];let url;try{if(file.size>12_000_000||!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('请选择 12 MB 以内的 JPG、PNG 或 WebP 图片。');url=URL.createObjectURL(file);const img=await load(url);if(token!==generation[kind]){URL.revokeObjectURL(url);return;}if(urls[kind])URL.revokeObjectURL(urls[kind]);urls[kind]=url;images[kind]=img;settings[kind+'X']=settings[kind+'Y']=50;controls();render();save();$('compare-status').textContent='图片已更新，仅在当前浏览器处理。';}catch(e){if(url)URL.revokeObjectURL(url);if(token===generation[kind])$('compare-status').textContent=e.message;}}
  for(const kind of ['scene','photo']){const input=$('compare-'+kind),zone=input.closest('label');zone.style.border='1px dashed #a5bac3';zone.style.padding='12px';input.onchange=()=>{choose(input.files[0],kind);input.value='';};zone.ondragover=e=>e.preventDefault();zone.ondrop=e=>{e.preventDefault();choose(e.dataTransfer.files[0],kind);};}
  document.addEventListener('paste',e=>{const file=[...(e.clipboardData?.files||[])].find(f=>f.type.startsWith('image/'));if(file){e.preventDefault();choose(file,$('compare-paste-target').value);}});
  for(const [name,id]of Object.entries(ids))$('compare-'+id).oninput=()=>{const e=$('compare-'+id);settings=core.normalize({...settings,[name]:e.type==='checkbox'?e.checked:e.value});render();save();};
  let drag=null;
  c.style.touchAction='none';c.style.cursor='grab';
  c.onpointerdown=e=>{
    if(e.button!==0)return;const rect=c.getBoundingClientRect(),scale=c.width/rect.width,x=(e.clientX-rect.left)*scale,y=(e.clientY-rect.top)*scale,layout=core.layout(settings),pair=settings.swap?['photo','scene']:['scene','photo'];
    const index=layout.boxes.findIndex(([bx,by,w,h])=>x>=bx&&x<=bx+w&&y>=by&&y<=by+h);if(index<0)return;
    const kind=['overlay','blend'].includes(settings.mode)?$('compare-drag-target').value:pair[index],img=images[kind];if(!img)return;
    const box=layout.boxes[index],crop=core.crop(img.naturalWidth,img.naturalHeight,box[2],box[3],settings[kind+'X'],settings[kind+'Y'],settings[kind+'Zoom']);
    drag={id:e.pointerId,kind,x:e.clientX,y:e.clientY,startX:settings[kind+'X'],startY:settings[kind+'Y'],scale,box,crop,img};c.setPointerCapture(e.pointerId);c.style.cursor='grabbing';
  };
  c.onpointermove=e=>{if(!drag||drag.id!==e.pointerId)return;const d=drag;for(const [axis,delta,room,source,dest]of [['X',e.clientX-d.x,d.img.naturalWidth-d.crop[2],d.crop[2],d.box[2]],['Y',e.clientY-d.y,d.img.naturalHeight-d.crop[3],d.crop[3],d.box[3]]])if(room>0)settings[d.kind+axis]=Math.max(0,Math.min(100,d['start'+axis]-delta*d.scale*source/dest/room*100));controls();render();};
  function endDrag(){if(drag){drag=null;c.style.cursor='grab';save();}}
  c.onpointerup=c.onpointercancel=c.onlostpointercapture=endDrag;
  $('compare-reset').onclick=()=>{settings=core.normalize();controls();render();save();};
  const encode=()=>new Promise((resolve,reject)=>{try{c.toBlob(blob=>blob?resolve(blob):reject(Error('导出失败，请改用本地截图。')),'image/'+settings.format,.92);}catch{reject(Error('图片来源不允许导出，请选择本地截图后重试。'));}});
  const filename=()=>`kdrama-${place?.id||'compare'}.${settings.format==='jpeg'?'jpg':'png'}`;
  function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  $('compare-download').onclick=async()=>{const name=filename();try{download(await encode(),name);$('compare-status').textContent='对比图已生成。';}catch(e){$('compare-status').textContent=e.message;}};
  $('compare-share').onclick=async()=>{const version=renderVersion,name=filename();try{const blob=await encode();if(version!==renderVersion)throw Error('预览已变化，请重新点击分享。');const file=new File([blob],name,{type:blob.type});if(navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title});$('compare-status').textContent='已交给系统分享。';}else{download(blob,name);$('compare-status').textContent='当前浏览器不支持直接分享，已下载图片，请在需要的应用中发送。';}}catch(e){$('compare-status').textContent=e.name==='AbortError'?'已取消分享。':e.message;}};
  controls();render();if(scene?.image){const token=++generation.scene;load(scene.mediumImage||scene.image).then(img=>{if(token!==generation.scene)return;images.scene=img;const crop=scene.mediumImage?{x:50,y:50}:scene.crop||{x:50,y:50};settings.sceneX=crop.x;settings.sceneY=crop.y;controls();render();}).catch(e=>{if(token===generation.scene)$('compare-status').textContent=e.message;});}
  window.addEventListener('pagehide',e=>{if(!e.persisted)Object.values(urls).forEach(URL.revokeObjectURL);});
})();
