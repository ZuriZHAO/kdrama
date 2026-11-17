// Selecting works keeps the current map view and each landmark's own marker.
window.initMapDiscovery = function () {
  const panel = $('map-discovery'), list = $('discovery-works');
  let lastMarkup = '';
  const workMarkers=new Map();
  function render() {
    if (!map) return;
    const bounds = map.getBounds(), counts = new Map(), candidates=new Map();
    const term = $('search').value.trim().toLocaleLowerCase();
    for (const place of places) {
      if (!bounds.contains([place.lat,place.lng]) || (selectedRegion && regionByPlace.get(place.id)!==selectedRegion) || (favoritesOnly && !favoriteIds.has(place.id)) || (term && !textMatches(place,term))) continue;
      counts.set(place.workId,(counts.get(place.workId)||0)+1);
      if(!candidates.has(place.workId))candidates.set(place.workId,[]);candidates.get(place.workId).push(place);
    }
    // Keep selected works accessible even after panning outside their locations.
    const ids = [...new Set([...selectedWorkIds,...(selectedSeries!=='all'?[selectedSeries]:[]),...counts.keys()])].sort((a,b)=>Number(selectedWorkIds.has(b))-Number(selectedWorkIds.has(a)) || (counts.get(b)||0)-(counts.get(a)||0) || seriesById[a].title.localeCompare(seriesById[b].title,'zh'));
    const markup = ids.map(id=>{
      const work=seriesById[id], poster=safePosterUrl(work.poster), selected=selectedWorkIds.has(id) || (!selectedWorkIds.size && selectedSeries===id);
      return `<button type="button" class="discovery-work" data-discover-work="${escapeHtml(id)}" aria-pressed="${selected}" style="--work-color:${safeColor(work.color)}" title="${escapeHtml(work.title)}：当前视野 ${counts.get(id)||0} 处，点击${selected?'取消选择':'加入地图'}"><span class="discovery-poster">${poster ? `<img src="${escapeHtml(poster)}" alt="" loading="lazy">` : escapeHtml(work.title.slice(0,2))}</span><span class="discovery-name">${escapeHtml(work.title)}</span><small>${counts.get(id)||0} 处</small></button>`;
    }).join('');
    $('discovery-summary').textContent = `当前视野 ${counts.size} 部作品${selectedWorkIds.size ? ' · 已选 '+selectedWorkIds.size+' 部' : ' · 可多选'}`;
    $('discovery-clear').hidden=!selectedWorkIds.size;
    $('discovery-empty').hidden=!!counts.size;
    if (markup !== lastMarkup) {
      const focused=document.activeElement?.dataset?.discoverWork, scroll=list.scrollLeft;
      list.innerHTML=markup;lastMarkup=markup;
      if(focused)[...list.querySelectorAll('[data-discover-work]')].find(b=>b.dataset.discoverWork===focused)?.focus({preventScroll:true});
      list.scrollLeft=scroll;
    }
    renderWorkAnchors(candidates);
  }
  function renderWorkAnchors(candidates){
    const kept=new Set(),occupied=[],rect=map.getContainer().getBoundingClientRect();
    const obstacles=[document.querySelector('.sidebar'),panel,document.querySelector('.map-tools')].filter(Boolean).map(e=>e.getBoundingClientRect()).filter(r=>r.width&&r.height).map(r=>({left:r.left-rect.left,right:r.right-rect.left,top:r.top-rect.top,bottom:r.bottom-rect.top}));
    const overlap=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
    if(selectedSeries==='all'&&!selectedWorkIds.size&&map.getZoom()<12){
      const size=map.getSize(),center=map.getCenter();
      for(const [id,points]of [...candidates].sort((a,b)=>b[1].length-a[1].length||a[0].localeCompare(b[0]))){
        const work=seriesById[id];let chosen;
        // Anchor to an actual visible landmark, never to a synthesized cluster centre.
        for(const place of points.slice().sort((a,b)=>map.distance([a.lat,a.lng],center)-map.distance([b.lat,b.lng],center))){
          const p=map.latLngToContainerPoint([place.lat,place.lng]),box={left:p.x-56,right:p.x+56,top:p.y-64,bottom:p.y-7};
          if(box.left<8||box.right>size.x-8||box.top<8||box.bottom>size.y-8||[...obstacles,...occupied].some(b=>overlap(box,b)))continue;
          chosen=place;occupied.push(box);break;
        }
        if(!chosen)continue;kept.add(id);let marker=workMarkers.get(id);
        if(!marker){const poster=safePosterUrl(work.poster);marker=L.marker([chosen.lat,chosen.lng],{keyboard:true,title:'查看作品：'+work.title,zIndexOffset:50,icon:L.divIcon({className:'map-work-anchor',iconSize:[112,60],iconAnchor:[56,64],html:`<span class="map-work-avatar" style="border-color:${safeColor(work.color)}">${poster?`<img src="${escapeHtml(poster)}" alt="" loading="lazy">`:escapeHtml(work.title.slice(0,2))}</span><span class="map-work-label" style="color:${safeColor(work.color)}">${escapeHtml(work.title)}</span>`})});marker.on('click',()=>selectWork(id));workMarkers.set(id,marker);}
        marker.setLatLng([chosen.lat,chosen.lng]);if(!map.hasLayer(marker))marker.addTo(map);
        const element=marker.getElement();if(element){element.dataset.mapWork=id;element.setAttribute('aria-label','查看作品：'+work.title);}
      }
    }
    for(const [id,marker]of workMarkers)if(!kept.has(id)){marker.remove();workMarkers.delete(id);}
  }
  function applySelection() {
    selectedSeries='all';browseMode='popular';selectedPlace=null;selectedSceneId=null;groupViewInitialized=false;
    hideDetail();map?.closePopup();renderList();renderMarkers();render();saveView(true);
  }
  list.addEventListener('click',event=>{
    const button=event.target.closest('[data-discover-work]');if(!button)return;
    if (!selectedWorkIds.size && selectedSeries!=='all') selectedWorkIds.add(selectedSeries);
    const id=button.dataset.discoverWork;
    if(selectedWorkIds.has(id))selectedWorkIds.delete(id);else selectedWorkIds.add(id);
    applySelection();
  });
  $('discovery-clear').addEventListener('click',()=>{selectedWorkIds.clear();applySelection();});
  $('discovery-toggle').addEventListener('click',()=>{
    const collapsed=panel.classList.toggle('collapsed');
    $('discovery-toggle').setAttribute('aria-expanded',String(!collapsed));
    $('discovery-toggle').textContent=collapsed?'展开':'收起';
  });
  window.renderMapDiscovery=render;
  map?.on('moveend resize',render);
  render();
};
