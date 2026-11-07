const catalog = window.KDRAMA_CATALOG;
if (!catalog) throw new Error('取景地数据未能加载');
const series = catalog.works;
const places = catalog.landmarks;
const scenesByLandmark = new Map();
const sourcesById = Object.fromEntries(catalog.sources.map(source => [source.id, source]));
catalog.scenes.forEach(scene => {
  const group = scenesByLandmark.get(scene.landmarkId) || [];
  group.push(scene);
  scenesByLandmark.set(scene.landmarkId, group);
});
const $ = (id) => document.getElementById(id);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const safeColor = value => /^#[0-9a-f]{6}$/i.test(value || '') ? value : '#617d8d';
const initialViewport = new URLSearchParams(location.search);
let selectedSeries = 'all';
let browseMode = 'popular';
let selectedRegion = null;
let workTab = 'group';
let selectedPlace = null;
let favoritesOnly = false;
let thumbnailsOn = false;
const favoriteIds = new Set((() => {
  try { const saved = JSON.parse(localStorage.getItem('kdrama-favorites') || '[]'); return Array.isArray(saved) ? saved.filter(id => typeof id === 'string') : []; }
  catch { return []; }
})());
const visitDates = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem('kdrama-visits') || '{}');
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  } catch { return {}; }
})();
const checkinDates = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem('kdrama-checkins') || '{}');
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  } catch { return {}; }
})();
let map = null;
let locationMarker = null;
let galleryImages = [];
let galleryIndex = 0;
let streetMapReady = false;
let fullMapBounds = null;
const markers = new Map();
const seriesById = Object.fromEntries(series.map(item => [item.id, item]));
const placesById = Object.fromEntries(places.map(item => [item.id, item]));
const regionNames = {Seoul:'首尔特别市',Busan:'釜山广域市',Daegu:'大邱广域市',Incheon:'仁川广域市',Gwangju:'光州广域市',Daejeon:'大田广域市',Ulsan:'蔚山广域市',Sejong:'世宗特别自治市',Gyeonggi:'京畿道',Gangwon:'江原特别自治道','North Chungcheong':'忠清北道','South Chungcheong':'忠清南道','North Jeolla':'全北特别自治道','South Jeolla':'全罗南道','North Gyeongsang':'庆尚北道','South Gyeongsang':'庆尚南道',Jeju:'济州特别自治道'};
const regionFeatures = window.KDRAMA_MAP_DATA?.regions?.features || [];
function insideRing(lng, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i], b = ring[j];
    if ((a[1] > lat) !== (b[1] > lat) && lng < (b[0] - a[0]) * (lat - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}
function inGeometry(lng, lat, geometry) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.type === 'MultiPolygon' ? geometry.coordinates : [];
  return polygons.some(rings => rings.length && insideRing(lng, lat, rings[0]) && !rings.slice(1).some(hole => insideRing(lng, lat, hole)));
}
const regionByPlace = new Map(places.map(place => [place.id, place.region || regionFeatures.find(feature => inGeometry(place.lng, place.lat, feature.geometry))?.properties?.name || 'overseas']));
const approvedUpdates = Array.isArray(catalog.updates) ? catalog.updates : [];
const updatedAtByWork = new Map();
for (const update of approvedUpdates) {
  const workId = update.workId || placesById[update.landmarkId]?.workId;
  if (workId && update.reviewedAt && (!updatedAtByWork.has(workId) || updatedAtByWork.get(workId) < update.reviewedAt)) updatedAtByWork.set(workId, update.reviewedAt);
}
for (const id of favoriteIds) if (!placesById[id]) favoriteIds.delete(id);

function textMatches(place, term) {
  const work = seriesById[place.workId];
  const scenes = scenesByLandmark.get(place.id) || [];
  return [place.name,place.ko,place.city,place.address,work.title,work.original,work.year,...(work.aliases || []),...scenes.map(scene => scene.description)].join(' ').toLocaleLowerCase().includes(term);
}

function visiblePlaces() {
  const term = $('search').value.trim().toLocaleLowerCase();
  return places.filter(p => (selectedSeries === 'all' || p.workId === selectedSeries) && (!selectedRegion || regionByPlace.get(p.id) === selectedRegion) && (!favoritesOnly || favoriteIds.has(p.id)) && (!term || textMatches(p,term)));
}

function visibleWorks() {
  const term = $('search').value.trim().toLocaleLowerCase();
  return series.filter(work => (!selectedRegion || places.some(place => place.workId === work.id && regionByPlace.get(place.id) === selectedRegion))
    && (!favoritesOnly || places.some(place => place.workId === work.id && favoriteIds.has(place.id)))
    && (!term || [work.title, work.original, work.year, ...(work.aliases || [])].join(' ').toLocaleLowerCase().includes(term)
    || places.some(place => place.workId === work.id && textMatches(place, term))));
}

function toggleFavorite(id) {
  if (favoriteIds.has(id)) favoriteIds.delete(id); else favoriteIds.add(id);
  try { localStorage.setItem('kdrama-favorites', JSON.stringify([...favoriteIds])); } catch {}
  const button = $('favorite-place');
  if (button) { button.textContent = favoriteIds.has(id) ? '★ 已收藏' : '☆ 收藏地点'; button.setAttribute('aria-pressed', String(favoriteIds.has(id))); }
  render();
}

function toggleVisit(id) {
  if (checkinDates[id]) return;
  if (visitDates[id]) delete visitDates[id];
  else visitDates[id] = localDate();
  try { localStorage.setItem('kdrama-visits', JSON.stringify(visitDates)); } catch {}
  const button = $('visit-place');
  if (button) { button.textContent = visitDates[id] ? `✓ 已到访 ${visitDates[id]}` : '记录到访'; button.setAttribute('aria-pressed', String(!!visitDates[id])); }
  if ($('route-dialog').open) renderRoute();
}

function localDate() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
}

function finishCheckIn(place, position) {
  if (selectedPlace !== place.id) return;
  const status = $('checkin-status');
  const button = $('checkin-place');
  button.disabled = false;
  button.textContent = checkinDates[place.id] ? `✓ 已定位签到 ${checkinDates[place.id]}` : '现场定位签到';
  const accuracy = position.coords.accuracy;
  if (!Number.isFinite(accuracy) || accuracy > 200) {
    status.textContent = `定位误差约 ${Math.round(accuracy || 0)} 米，精度不足；请到室外重试。`;
    return;
  }
  const radius = place.coordinateStatus === 'approximate' ? 700 : 300;
  const distance = straightDistanceKm({lat:position.coords.latitude,lng:position.coords.longitude}, place) * 1000;
  if (distance > radius + accuracy) {
    status.textContent = `当前位置距点位约 ${Math.round(distance)} 米，尚未进入约 ${radius} 米的签到范围。`;
    return;
  }
  const date = localDate();
  checkinDates[place.id] = date;
  if (!visitDates[place.id]) visitDates[place.id] = date;
  try {
    localStorage.setItem('kdrama-checkins', JSON.stringify(checkinDates));
    localStorage.setItem('kdrama-visits', JSON.stringify(visitDates));
  } catch {}
  button.textContent = `✓ 已定位签到 ${date}`;
  $('visit-place').textContent = `✓ 已到访 ${visitDates[place.id]}`;
  $('visit-place').setAttribute('aria-pressed', 'true');
  $('visit-place').disabled = true;
  status.textContent = `本机已记录签到。点位约 ${Math.round(distance)} 米处；此记录不证明拍摄机位准确。`;
}

function checkInPlace(place) {
  const status = $('checkin-status');
  const button = $('checkin-place');
  if (!window.isSecureContext || !navigator.geolocation) {
    status.textContent = '定位签到需要 HTTPS 或 localhost，并且浏览器支持位置权限。';
    return;
  }
  button.disabled = true;
  button.textContent = '定位中…';
  status.textContent = '正在请求当前位置；坐标不会上传或保存。';
  navigator.geolocation.getCurrentPosition(
    position => finishCheckIn(place, position),
    error => { if (selectedPlace !== place.id) return; button.disabled = false; button.textContent = checkinDates[place.id] ? `✓ 已定位签到 ${checkinDates[place.id]}` : '现场定位签到'; status.textContent = `定位失败：${error.message || '请检查浏览器的位置权限'}`; },
    {enableHighAccuracy:true,timeout:15000,maximumAge:0}
  );
}

function routePlaces() {
  return [...favoriteIds].map(id => placesById[id]).filter(Boolean);
}

function straightDistanceKm(a, b) {
  const rad = degrees => degrees * Math.PI / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function naverTransitLink(a, b) {
  const appname = location.protocol === 'https:' || location.protocol === 'http:' ? location.origin + location.pathname : 'https://github.com/';
  const query = new URLSearchParams({ slat:a.lat, slng:a.lng, sname:a.ko || a.name, dlat:b.lat, dlng:b.lng, dname:b.ko || b.name, appname });
  return `nmap://route/public?${query}`;
}

function showNearby(position) {
  if (!map || !places.length) return;
  const point = { lat: position.coords.latitude, lng: position.coords.longitude };
  const nearest = places.map(place => ({place, distance:straightDistanceKm(point, place)})).sort((a,b) => a.distance - b.distance).slice(0,5);
  const closeEnough = nearest[0].distance <= 100;
  if (locationMarker) map.removeLayer(locationMarker);
  if (closeEnough) locationMarker = L.circleMarker([point.lat,point.lng], {radius:7,color:'#fff',weight:2,fillColor:'#315f78',fillOpacity:1}).addTo(map);
  else locationMarker = null;
  const popup = document.createElement('div');
  popup.className = 'nearby-popup';
  const heading = document.createElement('strong');
  heading.textContent = closeEnough ? '当前位置附近的取景地' : '最近的取景地（当前位置较远）';
  popup.append(heading);
  nearest.forEach(({place,distance}) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `${place.name} · 约 ${distance.toFixed(1)} km`;
    button.addEventListener('click', () => openPlace(place.id));
    popup.append(button);
  });
  const center = closeEnough ? [point.lat,point.lng] : [nearest[0].place.lat,nearest[0].place.lng];
  map.setView(center, closeEnough && streetMapReady ? 13 : 9, {animate:true});
  L.popup({maxWidth:280}).setLatLng(center).setContent(popup).openOn(map);
}

function locateNearby() {
  const button = $('nearby-button');
  if (!navigator.geolocation) { button.textContent = '不支持定位'; return; }
  button.disabled = true;
  button.textContent = '定位中…';
  navigator.geolocation.getCurrentPosition(
    position => { button.disabled = false; button.textContent = '附近取景地'; showNearby(position); },
    error => { button.disabled = false; button.textContent = '定位失败，重试'; button.title = error.message; },
    {enableHighAccuracy:false,timeout:10000,maximumAge:60000}
  );
}

function moveRouteStop(id, direction) {
  const order = [...favoriteIds];
  const index = order.indexOf(id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= order.length) return;
  [order[index], order[target]] = [order[target], order[index]];
  favoriteIds.clear();
  order.forEach(item => favoriteIds.add(item));
  try { localStorage.setItem('kdrama-favorites', JSON.stringify(order)); } catch {}
  renderRoute();
}

function renderRoute() {
  const stops = routePlaces();
  $('route-content').innerHTML = stops.length ? stops.map((place, index) => {
    const previous = stops[index - 1];
    const leg = previous
      ? `<div class="route-leg"><span>上一站直线距离约 ${straightDistanceKm(previous, place).toFixed(1)} km</span><a href="${escapeHtml(naverTransitLink(previous, place))}">NAVER App 公交路线 ↗</a></div>` : '';
    return `${leg}<div class="route-stop"><span class="route-number">${index + 1}</span><div class="route-stop-main"><strong>${escapeHtml(place.name)}</strong><small>${escapeHtml(seriesById[place.workId]?.title || '')} · ${escapeHtml(place.city)}${visitDates[place.id] ? ` · 已到访 ${escapeHtml(visitDates[place.id])}` : ''}</small><div class="route-stop-links"><button type="button" data-route-place="${escapeHtml(place.id)}">查看地点</button><a href="https://map.naver.com/p/search/${encodeURIComponent(place.query || place.ko || place.name)}" target="_blank" rel="noopener noreferrer">NAVER 地图 ↗</a></div></div><div class="route-order"><button type="button" data-route-move="${escapeHtml(place.id)}" data-direction="-1" aria-label="上移${escapeHtml(place.name)}" ${index === 0 ? 'disabled' : ''}>↑</button><button type="button" data-route-move="${escapeHtml(place.id)}" data-direction="1" aria-label="下移${escapeHtml(place.name)}" ${index === stops.length - 1 ? 'disabled' : ''}>↓</button></div></div>`;
  }).join('') : '<p class="route-empty">还没有收藏地点。在地点详情点击「收藏地点」即可添加行程站点。</p>';
  $('route-content').querySelectorAll('[data-route-place]').forEach(button => button.addEventListener('click', () => { $('route-dialog').close(); openPlace(button.dataset.routePlace); }));
  $('route-content').querySelectorAll('[data-route-move]').forEach(button => button.addEventListener('click', () => moveRouteStop(button.dataset.routeMove, Number(button.dataset.direction))));
}

const coordinateLabels = {approximate:'示意点',venue:'地点已核实',camera:'机位已核实'};
const coordinateLabel = (place) => coordinateLabels[place.coordinateStatus] || '示意点';
const workTypeLabels = {drama:'电视剧',movie:'电影',variety:'综艺'};
const workType = (work) => ['movie', 'variety'].includes(work.type) ? work.type : 'drama';

function renderList() {
  const showingWorks = selectedSeries === 'all';
  $('result-count').hidden = showingWorks;
  $('back-to-works').hidden = showingWorks;
  $('browse-tabs').hidden = !showingWorks;
  $('work-tabs').hidden = showingWorks;
  document.querySelectorAll('[data-browse]').forEach(button => button.classList.toggle('active', button.dataset.browse === browseMode));
  document.querySelectorAll('[data-work-tab]').forEach(button => button.classList.toggle('active', button.dataset.workTab === workTab));
  $('list-title').innerHTML = showingWorks
    ? escapeHtml(selectedRegion ? (regionNames[selectedRegion] || '韩国境外') : '作品')
    : `<span class="work-title-dot" style="background:${safeColor(seriesById[selectedSeries].color)}"></span><span class="work-title-name">${escapeHtml(seriesById[selectedSeries].title)}</span>`;
  if (showingWorks) {
    if (browseMode === 'regions' && !selectedRegion) {
      const regions = [...Object.keys(regionNames), 'overseas'];
      $('result-count').textContent = `${regions.length} 区域`;
      $('place-list').innerHTML = regions.map(id => {
        const count = places.filter(place => regionByPlace.get(place.id) === id).length;
        return `<button type="button" class="region-card" data-region="${escapeHtml(id)}"><span>${escapeHtml(regionNames[id] || '韩国境外')}</span><small>${count}取景地</small></button>`;
      }).join('');
      $('place-list').querySelectorAll('[data-region]').forEach(button => button.addEventListener('click', () => { selectedRegion = button.dataset.region; render(); fitVisible(); }));
      return;
    }
    let filtered = visibleWorks();
    if (browseMode === 'recent' && !selectedRegion) filtered = filtered.filter(work => updatedAtByWork.has(work.id)).sort((a,b) => updatedAtByWork.get(b.id).localeCompare(updatedAtByWork.get(a.id)));
    else filtered.sort((a,b) => places.filter(place => place.workId === b.id && (!selectedRegion || regionByPlace.get(place.id) === selectedRegion)).length - places.filter(place => place.workId === a.id && (!selectedRegion || regionByPlace.get(place.id) === selectedRegion)).length || a.title.localeCompare(b.title, 'zh'));
    $('result-count').textContent = `${filtered.length} 部`;
    $('place-list').innerHTML = filtered.length ? filtered.map(work => {
      const workPlaces = places.filter(place => place.workId === work.id && (!selectedRegion || regionByPlace.get(place.id) === selectedRegion) && (!favoritesOnly || favoriteIds.has(place.id)));
      const screenshots = workPlaces.reduce((n, place) => n + (scenesByLandmark.get(place.id) || []).filter(scene => sceneImageUrl(scene)).length, 0);
      const poster = safePosterUrl(work.poster);
      const type = workType(work);
      return `<button type="button" class="work-card" data-work="${escapeHtml(work.id)}" aria-label="查看${escapeHtml(work.title)}，${workTypeLabels[type]}"><span class="work-accent" style="background:${safeColor(work.color)}"></span><span class="work-poster" style="background:${safeColor(work.color)}">${poster ? `<img src="${escapeHtml(poster)}" alt="" loading="lazy">` : `<span>${escapeHtml(work.title.slice(0, 2))}</span>`}</span><span class="work-main"><strong>${escapeHtml(work.title)}</strong><small>${escapeHtml(work.original)}</small><small>${workPlaces.length}取景地 · ${screenshots}截图</small></span><span class="work-type work-type-${type}">${workTypeLabels[type]}</span><span class="work-arrow" aria-hidden="true">›</span></button>`;
    }).join('') : `<div class="empty-state">${browseMode === 'recent' && !selectedRegion ? '还没有审核通过的更新投稿。' : '没有找到相关作品。'}</div>`;
    $('place-list').querySelectorAll('[data-work]').forEach(button => button.addEventListener('click', () => selectWork(button.dataset.work)));
    return;
  }
  const filtered = visiblePlaces();
  $('result-count').textContent = `${filtered.length} 处`;
  const groups = new Map();
  for (const place of filtered) {
    const scenes = scenesByLandmark.get(place.id) || [];
    const episodeKeys = [...new Set(scenes.filter(scene => scene.episode != null).map(scene => `第 ${scene.episode} 集`))];
    const keys = workTab === 'group' ? [place.group || '未分组'] : episodeKeys.length ? episodeKeys : ['未分组'];
    for (const key of keys.length ? keys : ['未分组']) { if (!groups.has(key)) groups.set(key, []); groups.get(key).push(place); }
  }
  const entries = [...groups].sort((a,b) => a[0] === '未分组' ? 1 : b[0] === '未分组' ? -1 : workTab === 'episode' ? Number(a[0].match(/\d+/)?.[0] || 0) - Number(b[0].match(/\d+/)?.[0] || 0) : a[0].localeCompare(b[0], 'zh'));
  $('place-list').innerHTML = entries.length ? entries.map(([heading, items]) => `<section class="place-group"><h3>${escapeHtml(heading)} <small>${items.length}</small></h3>${items.map(place => {
    const firstImage = (scenesByLandmark.get(place.id) || []).map(scene => sceneImageUrl(scene)).find(Boolean);
    return `<button type="button" class="place-card ${selectedPlace === place.id ? 'active' : ''}" data-place="${escapeHtml(place.id)}" aria-label="查看${escapeHtml(place.name)}详情，${coordinateLabel(place)}">${firstImage ? `<img class="place-card-image" src="${escapeHtml(firstImage)}" alt="${escapeHtml(place.name)}场景截图" loading="lazy" referrerpolicy="no-referrer">` : ''}<span class="card-main">${place.coordinateStatus === 'approximate' ? '<span class="card-status">示意点</span>' : ''}<span class="card-title">${escapeHtml(place.name)}</span><span class="card-sub">${escapeHtml(place.ko)} · ${escapeHtml(place.city)}</span></span></button>`;
  }).join('')}</section>`).join('') : '<div class="empty-state">这部作品还没有地点，欢迎投稿。</div>';
  $('place-list').querySelectorAll('[data-place]').forEach(button => button.addEventListener('click', () => openPlace(button.dataset.place)));
}

function safePosterUrl(value) { return typeof value === 'string' && (/^https:\/\//.test(value) || /^\.\/assets\//.test(value)) ? value : ''; }

function selectWork(id) {
  if (!seriesById[id]) return;
  selectedSeries = id;
  $('search').value = '';
  render();
  fitVisible();
  history.replaceState(null, '', `#work=${encodeURIComponent(id)}`);
}

function showAllWorks() {
  selectedSeries = 'all';
  $('search').value = '';
  render();
  fitVisible();
  history.replaceState(null, '', '#explore');
}

function renderMarkers() {
  if (!map) return;
  const ids = new Set(visiblePlaces().map(p => p.id));
  places.forEach(place => {
    const marker = markers.get(place.id);
    if (!marker) return;
    if (ids.has(place.id)) marker.addTo(map); else marker.remove();
    marker.setIcon(iconFor(place));
  });
}

function iconFor(place) {
  const color = selectedPlace === place.id ? '#1d2a2a' : seriesById[place.workId].color;
  const imageScene = (scenesByLandmark.get(place.id) || []).find(scene => sceneImageUrl(scene));
  if (thumbnailsOn && imageScene && map && map.getZoom() >= 12) {
    return L.divIcon({className:'scene-thumbnail-marker',html:`<span class="thumbnail-frame" style="border-color:${safeColor(color)}"><img src="${escapeHtml(sceneImageUrl(imageScene))}" alt="" loading="lazy" referrerpolicy="no-referrer"></span>`,iconSize:[70,58],iconAnchor:[35,58]});
  }
  return L.divIcon({className:'place-marker',html:`<span class="pin ${selectedPlace === place.id ? 'selected' : ''}" style="background:${safeColor(color)}"></span>`,iconSize:[24,24],iconAnchor:[12,12]});
}

function placePopup(place) {
  const work = seriesById[place.workId];
  const scenes = scenesByLandmark.get(place.id) || [];
  const scene = scenes[0];
  const image = scenes.find(item => sceneImageUrl(item));
  const imageUrl = image && sceneImageUrl(image);
  const card = document.createElement('div');
  card.className = 'place-popup';
  card.innerHTML = `${imageUrl
    ? `<img class="place-popup-image" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(image.description || `${place.name} 场景图片`)}" loading="lazy" referrerpolicy="no-referrer">`
    : '<div class="place-popup-placeholder">暂无截图</div>'}
    <div class="place-popup-body"><small>${escapeHtml(work?.title || '')} · ${escapeHtml(place.city || '')}</small>
    <strong>${escapeHtml(place.name)}</strong>
    <p>${escapeHtml(scene?.description || place.coordinateNote || '查看地点资料与导航信息')}</p>
    <div class="place-popup-actions"><button type="button">查看详情</button><a href="https://map.naver.com/p/search/${encodeURIComponent(place.query || place.ko || place.name)}" target="_blank" rel="noopener noreferrer">NAVER 地图 ↗</a></div></div>`;
  card.querySelector('button').addEventListener('click', () => { map.closePopup(); openPlace(place.id); });
  return card;
}

function render() { renderList(); renderMarkers(); }

function fitVisible() {
  if (!map) return;
  const filtered = visiblePlaces();
  if (selectedSeries === 'all' && !selectedRegion && !$('search').value.trim() && fullMapBounds) map.fitBounds(fullMapBounds,{padding:[28,28],animate:true});
  else if (filtered.length === 1) map.setView([filtered[0].lat,filtered[0].lng],streetMapReady ? 15 : 9,{animate:true});
  else if (filtered.length > 1) map.fitBounds(L.latLngBounds(filtered.map(p => [p.lat,p.lng])).pad(.25),{animate:true,maxZoom:selectedSeries === 'all' ? 9 : 14});
}

function saveMapView() {
  if (!map) return;
  const center = map.getCenter();
  const url = new URL(location.href);
  url.searchParams.set('mLat', center.lat.toFixed(5));
  url.searchParams.set('mLng', center.lng.toFixed(5));
  url.searchParams.set('mZoom', String(map.getZoom()));
  history.replaceState(null, '', url.pathname + url.search + url.hash);
}

function restoreMapView() {
  if (!map) return;
  const lat = Number(initialViewport.get('mLat'));
  const lng = Number(initialViewport.get('mLng'));
  const zoom = Number(initialViewport.get('mZoom'));
  if (!initialViewport.has('mLat') || !initialViewport.has('mLng') || !initialViewport.has('mZoom')) return;
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isInteger(zoom) || Math.abs(lat) > 90 || Math.abs(lng) > 180 || zoom < 2 || zoom > 18) return;
  map.setView([lat,lng], zoom, {animate:false});
}

function navLinks(place) {
  const q = encodeURIComponent(place.query);
  return `<div class="nav-links"><a href="https://map.naver.com/p/search/${q}" target="_blank" rel="noopener noreferrer">NAVER 地图 <span>↗</span></a><a href="https://map.kakao.com/?q=${q}" target="_blank" rel="noopener noreferrer">Kakao 地图 <span>↗</span></a></div>`;
}

function sceneMeta(scene) {
  const parts = [];
  if (scene.episode !== null) parts.push(typeof scene.episode === 'number' ? `第 ${scene.episode} 集` : scene.episode);
  if (scene.timeSeconds !== null) {
    const minutes = Math.floor(scene.timeSeconds / 60);
    const seconds = String(scene.timeSeconds % 60).padStart(2,'0');
    parts.push(`${minutes}:${seconds}`);
  }
  return parts.length ? parts.join(' · ') : '集数与时间点待核实';
}

function sceneImageUrl(scene) {
  if (typeof scene.image !== 'string') return '';
  if (/^\.\/assets\//.test(scene.image)) return scene.image;
  try { const url = new URL(scene.image); return url.protocol === 'https:' ? url.href : ''; }
  catch { return ''; }
}

function showGalleryImage() {
  const scene = galleryImages[galleryIndex];
  if (!scene) return;
  $('large-scene-image').src = sceneImageUrl(scene);
  $('large-scene-image').alt = scene.description;
  $('image-caption').textContent = [scene.description || '场景图片', scene.imageCredit].filter(Boolean).join(' · ');
  $('image-position').textContent = `${galleryIndex + 1} / ${galleryImages.length}`;
  $('previous-image').disabled = galleryIndex === 0;
  $('next-image').disabled = galleryIndex === galleryImages.length - 1;
}

function openGallery(place, sceneId) {
  galleryImages = (scenesByLandmark.get(place.id) || []).filter(scene => sceneImageUrl(scene));
  galleryIndex = galleryImages.findIndex(scene => scene.id === sceneId);
  if (galleryIndex < 0) return;
  showGalleryImage();
  $('image-dialog').showModal();
}

function renderScenes(place) {
  const scenes = scenesByLandmark.get(place.id) || [];
  return scenes.map((scene,index) => {
    const source = sourcesById[scene.sourceId];
    const episodeSource = sourcesById[scene.episodeSourceId];
    const separateSource = source && scene.sourceId !== place.sourceId
      ? `<a class="source-link" href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">场景来源：${escapeHtml(source.title)} ↗</a>` : '';
    const separateEpisodeSource = episodeSource
      ? `<a class="source-link" href="${escapeHtml(episodeSource.url)}" target="_blank" rel="noopener noreferrer">集数依据：${escapeHtml(episodeSource.title)} ↗</a>` : '';
    const imageUrl = sceneImageUrl(scene);
    const image = imageUrl
      ? `<figure class="scene-image"><button class="scene-image-open" type="button" data-scene-image="${escapeHtml(scene.id)}" aria-label="放大查看场景图片"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(scene.description)}" loading="lazy" referrerpolicy="no-referrer"></button><figcaption>${escapeHtml(scene.imageCredit || '')}</figcaption></figure>` : '';
    const description = scene.description ? `<p class="detail-description">${escapeHtml(scene.description)}</p>` : '';
    return `<section class="scene-record"><p class="scene-meta">场景 ${String(index+1).padStart(2,'0')} · ${escapeHtml(sceneMeta(scene))}</p>${image}${description}${separateSource}${separateEpisodeSource}</section>`;
  }).join('');
}

function openPlace(id) {
  const place = places.find(p => p.id === id);
  if (!place) return;
  if (selectedSeries !== place.workId) {
    selectedSeries = place.workId;
    $('search').value = '';
  }
  selectedPlace = id;
  const work = seriesById[place.workId];
  const source = sourcesById[place.sourceId];
  const coordinateSource = sourcesById[place.coordinateSourceId];
  const latestRevision = (catalog.revisions || []).filter(item => item.landmarkId === place.id).at(-1);
  const revisionSource = latestRevision && sourcesById[latestRevision.sourceId];
  const revisionEvidence = latestRevision && revisionSource
    ? `<div class="detail-row"><b>最近更正</b><span>${escapeHtml(latestRevision.date)} · ${escapeHtml(latestRevision.reason)}<br><a class="source-link" href="${escapeHtml(revisionSource.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(revisionSource.title)} ↗</a></span></div>` : '';
  const coordinateEvidence = coordinateSource
    ? `<a class="source-link" href="${escapeHtml(coordinateSource.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(coordinateSource.title)} ↗</a>`
    : '坐标依据待核实';
  const coordinateNote = place.coordinateStatus === 'approximate'
    ? '地图点位仅用于探索地点附近，不代表精确拍摄机位。出发前请在导航地图中核对位置与开放情况。'
    : '请按资料来源与现场情况核对入口、拍摄位置和开放状态。';
  const updateLink = `./submit.html?${new URLSearchParams({kind:'update',landmarkId:place.id})}`;
  const sourceEvidence = source
    ? `<a class="source-link" href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)} ↗</a>`
    : '暂无来源，待核实';
  $('detail-content').innerHTML = `<p class="detail-overline">${escapeHtml(work.year)} · ${escapeHtml(work.title)}</p><h2 id="detail-title">${escapeHtml(place.name)}</h2><p class="detail-hangul">${escapeHtml(place.ko)} · ${escapeHtml(place.city)}</p><div class="detail-actions"><button id="favorite-place" type="button" aria-pressed="${favoriteIds.has(place.id)}">${favoriteIds.has(place.id) ? '★ 已收藏' : '☆ 收藏地点'}</button><button id="visit-place" type="button" aria-pressed="${!!visitDates[place.id]}">${visitDates[place.id] ? `✓ 已到访 ${escapeHtml(visitDates[place.id])}` : '记录到访'}</button><button id="share-place" type="button">复制地点链接</button><a href="${escapeHtml(updateLink)}">补充／更正</a></div>${renderScenes(place)}<div class="detail-grid"><div class="detail-row"><b>韩文地址</b><span>${escapeHtml(place.address)}</span></div><div class="detail-row"><b>到访提示</b><span>${escapeHtml(place.visit)}</span></div></div>${navLinks(place)}<details class="detail-evidence"><summary>资料来源与点位核验</summary><div class="detail-grid"><div class="detail-row"><b>点位状态</b><span>${coordinateLabel(place)}</span></div><div class="detail-row"><b>取景来源</b><span>${sourceEvidence}</span></div><div class="detail-row"><b>坐标依据</b><span>${coordinateEvidence}</span></div><div class="detail-row"><b>核验日期</b><span>${escapeHtml(place.verifiedAt || '待核实')}</span></div>${revisionEvidence}</div><p class="detail-note">${escapeHtml(place.coordinateNote || coordinateNote)}</p></details>`;
  $('favorite-place').addEventListener('click', () => toggleFavorite(place.id));
  $('visit-place').addEventListener('click', () => toggleVisit(place.id));
  $('visit-place').disabled = !!checkinDates[place.id];
  const checkinButton = document.createElement('button');
  checkinButton.id = 'checkin-place';
  checkinButton.type = 'button';
  checkinButton.textContent = checkinDates[place.id] ? `✓ 已定位签到 ${checkinDates[place.id]}` : '现场定位签到';
  const checkinStatus = document.createElement('p');
  checkinStatus.id = 'checkin-status';
  checkinStatus.className = 'checkin-status';
  checkinStatus.setAttribute('role', 'status');
  checkinStatus.textContent = checkinDates[place.id] ? '本机已保存定位签到记录，不作为公开点位核验。' : '定位签到只记录日期。示意点范围约 700 米，已核实地点范围约 300 米。';
  $('detail-content').querySelector('.detail-actions').append(checkinButton);
  $('detail-content').querySelector('.detail-actions').after(checkinStatus);
  checkinButton.addEventListener('click', () => checkInPlace(place));
  $('detail-content').querySelectorAll('[data-scene-image]').forEach(button => button.addEventListener('click', () => openGallery(place, button.dataset.sceneImage)));
  $('share-place').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(new URL(`#place=${encodeURIComponent(place.id)}`, location.href).href);
      $('share-place').textContent = '链接已复制';
    } catch {
      $('share-place').textContent = '请复制浏览器地址';
    }
  });
  $('detail-overlay').hidden = false;
  document.body.style.overflow = 'hidden';
  if (map) { map.setView([place.lat,place.lng],streetMapReady ? 15 : 9,{animate:true}); renderMarkers(); }
  renderList();
  $('detail-overlay').querySelector('.detail-drawer').focus();
  history.replaceState(null,'',`#place=${place.id}`);
}

function closePlace() {
  $('detail-overlay').hidden = true;
  document.body.style.overflow = '';
  selectedPlace = null;
  renderList(); renderMarkers();
  if (location.hash.startsWith('#place=')) history.replaceState(null,'',`#work=${encodeURIComponent(selectedSeries)}`);
}

function preferChineseLabels(style) {
  style.layers.forEach(layer => {
    const original = layer.layout?.['text-field'];
    if (layer.type !== 'symbol' || !original || !JSON.stringify(original).includes('name')) return;
    layer.layout['text-field'] = [
      'coalesce',
      ['get', 'name:zh-Hans'],
      ['get', 'name:zh'],
      ['get', 'name'],
      original
    ];
  });
  return style;
}

async function initStreetMap(cityMarkers, attribution) {
  const sourceLabel = $('map-source');
  if (!window.maplibregl || !L.maplibreGL) {
    sourceLabel.textContent = '本地轮廓地图';
    return;
  }

  let streetLayer;
  let streetMap;
  let finished = false;
  let errors = 0;
  let lastError = '';
  let timeout;
  const controller = new AbortController();
  const fallback = (reason = lastError || 'timeout') => {
    if (finished) return;
    finished = true;
    clearTimeout(timeout);
    controller.abort();
    if (streetLayer && map.hasLayer(streetLayer)) map.removeLayer(streetLayer);
    sourceLabel.textContent = '本地轮廓地图（街道图暂不可用）';
    sourceLabel.dataset.error = reason;
  };

  try {
    timeout = setTimeout(fallback, 15000);
    const response = await fetch('https://tiles.openfreemap.org/styles/liberty', {signal: controller.signal});
    if (!response.ok) throw new Error(`地图样式请求失败：${response.status}`);
    const style = preferChineseLabels(await response.json());
    if (finished) return;
    streetLayer = L.maplibreGL({style}).addTo(map);
    streetMap = streetLayer.getMaplibreMap();
    streetMap.on('error', event => {
      errors += 1;
      lastError = event.error?.message || 'map resource error';
      console.warn('OpenFreeMap 资源加载失败：', lastError);
      if (errors >= 3) fallback(lastError);
    });
    streetMap.once('idle', () => {
      if (finished) return;
      finished = true;
      streetMapReady = true;
      clearTimeout(timeout);
      cityMarkers.forEach(marker => map.removeLayer(marker));
      attribution.removeAttribution('地图边界：Natural Earth / geoBoundaries');
      sourceLabel.textContent = 'OpenFreeMap 街道地图';
    });
  } catch (error) {
    console.warn('OpenFreeMap 街道图加载失败，使用本地轮廓地图。', error);
    fallback(error.message);
  }
}

function initMap() {
  if (!window.L || !window.KDRAMA_MAP_DATA) { $('map-fallback').hidden = false; return; }
  const geography = window.KDRAMA_MAP_DATA;
  map = L.map('map',{zoomControl:true,scrollWheelZoom:true,touchZoom:true,minZoom:2,maxZoom:18,attributionControl:false});
  map.createPane('fallbackPane').style.zIndex = 180;
  L.geoJSON(geography.neighbors,{pane:'fallbackPane',interactive:false,style:{color:'#bbc8c1',weight:1,fillColor:'#d9e0d9',fillOpacity:1}}).addTo(map);
  const regions = L.geoJSON(geography.regions,{pane:'fallbackPane',interactive:false,style:{color:'#aebfb3',weight:1.15,fillColor:'#f4f0e7',fillOpacity:1}}).addTo(map);
  fullMapBounds = regions.getBounds().pad(.12);
  for (const place of places) fullMapBounds.extend([place.lat, place.lng]);
  const cityLabels = [
    ['首尔',37.5665,126.9780],['仁川',37.4563,126.7052],['江陵',37.7519,128.8761],
    ['大田',36.3504,127.3845],['大邱',35.8714,128.6014],['浦项',36.0190,129.3435],
    ['釜山',35.1796,129.0756],['济州',33.4996,126.5312]
  ];
  const cityMarkers = cityLabels.map(([name,lat,lng]) => L.marker([lat,lng],{interactive:false,icon:L.divIcon({className:'city-label',html:name,iconSize:[46,20],iconAnchor:[0,10]})}).addTo(map));
  places.forEach(place => {
    const marker = L.marker([place.lat,place.lng],{icon:iconFor(place),title:place.name});
    marker.bindPopup(() => placePopup(place), {maxWidth:280, minWidth:240, className:'place-popup-shell', offset:[0,-8]});
    markers.set(place.id,marker);
  });
  map.on('click', event => {
    const query = new URLSearchParams({ lat: event.latlng.lat.toFixed(6), lng: event.latlng.lng.toFixed(6) });
    if (selectedSeries !== 'all') query.set('workId', selectedSeries);
    L.popup().setLatLng(event.latlng).setContent(`<a class="map-submit-popup" href="./submit.html?${query}">在此提交取景地 ↗</a>`).openOn(map);
  });
  const attribution = L.control.attribution({prefix:false}).addAttribution('地图边界：Natural Earth / geoBoundaries').addTo(map);
  renderMarkers();
  map.fitBounds(fullMapBounds,{padding:[28,28],animate:false});
  map.on('moveend', saveMapView);
  map.on('zoomend', renderMarkers);
  initStreetMap(cityMarkers, attribution);
}

$('search').addEventListener('input', () => {renderList();renderMarkers();fitVisible();});
document.querySelectorAll('[data-browse]').forEach(button => button.addEventListener('click', () => { browseMode = button.dataset.browse; selectedRegion = null; selectedSeries = 'all'; render(); fitVisible(); }));
document.querySelectorAll('[data-work-tab]').forEach(button => button.addEventListener('click', () => { workTab = button.dataset.workTab; renderList(); }));
$('favorites-filter').addEventListener('click', () => {
  favoritesOnly = !favoritesOnly;
  $('favorites-filter').setAttribute('aria-pressed', String(favoritesOnly));
  $('favorites-filter').textContent = favoritesOnly ? '★ 收藏中' : '☆ 收藏';
  render(); fitVisible();
});
$('nearby-button').addEventListener('click', locateNearby);
const thumbnailButton = $('thumbnail-toggle');
thumbnailButton.disabled = !catalog.scenes.some(scene => sceneImageUrl(scene));
if (!thumbnailButton.disabled) thumbnailButton.title = '放大地图后显示场景图片标点';
thumbnailButton.addEventListener('click', () => {
  thumbnailsOn = !thumbnailsOn;
  thumbnailButton.setAttribute('aria-pressed', String(thumbnailsOn));
  thumbnailButton.textContent = thumbnailsOn ? '● 场景缩略图' : '场景缩略图';
  renderMarkers();
});
$('open-route').addEventListener('click', () => { renderRoute(); $('route-dialog').showModal(); });
$('close-route').addEventListener('click', () => $('route-dialog').close());
$('route-dialog').addEventListener('click', event => { if (event.target === $('route-dialog')) $('route-dialog').close(); });
$('reset-map').addEventListener('click',showAllWorks);
$('back-to-works').addEventListener('click',showAllWorks);
$('close-detail').addEventListener('click',closePlace);
$('close-image').addEventListener('click', () => $('image-dialog').close());
$('previous-image').addEventListener('click', () => { galleryIndex -= 1; showGalleryImage(); });
$('next-image').addEventListener('click', () => { galleryIndex += 1; showGalleryImage(); });
$('image-dialog').addEventListener('click', event => { if (event.target === $('image-dialog')) $('image-dialog').close(); });
$('detail-overlay').addEventListener('click',e => {if(e.target.dataset.close) closePlace();});
document.addEventListener('keydown',e => {if(e.key === 'Escape' && !$('image-dialog').open && !$('detail-overlay').hidden) closePlace();});
render(); initMap();
const initialPlace = location.hash.match(/^#place=([\w-]+)$/);
if (initialPlace) openPlace(initialPlace[1]);
else {
  const initialWork = location.hash.match(/^#work=([\w-]+)$/);
  if (initialWork) selectWork(initialWork[1]);
  restoreMapView();
}
