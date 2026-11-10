// Selecting works keeps the current map view and each landmark's own marker.
window.initMapDiscovery = function () {
  const panel = $('map-discovery'), list = $('discovery-works');
  let lastMarkup = '';
  function render() {
    if (!map) return;
    const bounds = map.getBounds(), counts = new Map();
    const term = $('search').value.trim().toLocaleLowerCase();
    for (const place of places) {
      if (!bounds.contains([place.lat,place.lng]) || (selectedRegion && regionByPlace.get(place.id)!==selectedRegion) || (favoritesOnly && !favoriteIds.has(place.id)) || (term && !textMatches(place,term))) continue;
      counts.set(place.workId,(counts.get(place.workId)||0)+1);
    }
    // Keep selected works accessible even after panning outside their locations.
    const ids = [...new Set([...selectedWorkIds,...counts.keys()])].sort((a,b)=>Number(selectedWorkIds.has(b))-Number(selectedWorkIds.has(a)) || (counts.get(b)||0)-(counts.get(a)||0) || seriesById[a].title.localeCompare(seriesById[b].title,'zh'));
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
