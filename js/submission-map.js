(() => {
  const $=id=>document.getElementById(id);let map,proposed,original,line,context='';
  const icon=kind=>L.divIcon({className:'pick-marker '+kind,html:'<span></span>',iconSize:[20,20],iconAnchor:[10,10]});
  const isUpdate=()=>$('kind').value==='update';
  const fields=()=>isUpdate()?['correction-lat','correction-lng']:['lat','lng'];
  function point(){const values=fields().map(id=>$(id).value.trim());if(values.some(v=>!v))return null;const [lat,lng]=values.map(Number);return Number.isFinite(lat)&&Number.isFinite(lng)&&Math.abs(lat)<=90&&Math.abs(lng)<=180?[lat,lng]:null;}
  function origin(){const p=window.KDRAMA_CATALOG.landmarks.find(p=>p.id===$('landmark-id').value);return isUpdate()&&p?[p.lat,p.lng]:null;}
  function setPoint(p){p=L.latLng(p).wrap();if(Math.abs(p.lat)>90)return;fields().forEach((id,i)=>$(id).value=(i?p.lng:p.lat).toFixed(6));sync(false);$(fields()[0]).dispatchEvent(new Event('input',{bubbles:true}));}
  function init(){
    if(map)return;map=L.map('submission-map',{minZoom:2,maxZoom:19,worldCopyJump:true}).setView([36.3,127.8],6);
    L.geoJSON(window.KDRAMA_MAP_DATA.regions,{style:{color:'#8aabb8',weight:1,fillOpacity:.12}}).addTo(map);
    map.attributionControl.setPrefix(false).addAttribution('OpenFreeMap / OpenStreetMap · geoBoundaries');map.on('click',e=>setPoint(e.latlng));
    fetch('https://tiles.openfreemap.org/styles/liberty',{signal:AbortSignal.timeout(8000)}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(style=>{const layer=L.maplibreGL({style}).addTo(map);layer.getMaplibreMap().on('error',()=>{$('pick-map-status').textContent='部分街道图未能加载，仍可选点或填写坐标。';});}).catch(()=>{$('pick-map-status').textContent='街道图暂不可用，仍可使用轮廓图或填写全球经纬度。';});
  }
  function sync(center=true){
    if(document.querySelector('[data-step="1"]').hidden)return;init();map.invalidateSize();
    const from=origin(),to=point(),key=$('kind').value+':'+$('landmark-id').value;
    if(original){map.removeLayer(original);original=null;}if(line){map.removeLayer(line);line=null;}
    if(from)original=L.marker(from,{icon:icon('original'),interactive:false,zIndexOffset:-10}).addTo(map).bindTooltip('原位置');
    const target=to||from;
    if(target){if(!proposed){proposed=L.marker(target,{icon:icon('proposed'),draggable:true}).addTo(map).bindTooltip('拖动调整位置');proposed.on('dragend',()=>setPoint(proposed.getLatLng()));}else proposed.setLatLng(target);}
    else if(proposed){map.removeLayer(proposed);proposed=null;}
    if(from&&to)line=L.polyline([from,to],{color:'#7252b5',dashArray:'5 5',weight:2}).addTo(map);
    $('pick-original-label').hidden=!from;$('pick-reset').hidden=!from;$('pick-proposed-label').textContent=from?'蓝色：修改后位置（未调整时与原位置重合）':'蓝色：投稿位置';
    if(center||key!==context){if(from&&to&&from.some((v,i)=>Math.abs(v-to[i])>.00001))map.fitBounds([from,to],{padding:[30,30],maxZoom:16});else if(target)map.setView(target,15);}
    context=key;
  }
  ['lat','lng','correction-lat','correction-lng'].forEach(id=>$(id).addEventListener('input',()=>sync(true)));
  $('pick-reset').onclick=()=>{fields().forEach(id=>$(id).value='');sync(true);$(fields()[0]).dispatchEvent(new Event('input',{bubbles:true}));};
  window.KdramaPickMap={sync};
})();
