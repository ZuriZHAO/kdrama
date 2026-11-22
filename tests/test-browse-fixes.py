from pathlib import Path
exec(Path(__file__).with_name('test-map-browser.py').read_text(encoding='utf-8').split("cmd('Emulation.setDeviceMetricsOverride'")[0])
cmd('Page.enable');cmd('Network.enable');cmd('Network.setCacheDisabled',{'cacheDisabled':True})
cmd('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False})
cmd('Page.navigate',{'url':base});wait("typeof markers!=='undefined' && map")
ev("selectWork('itaewon');$('search').value=seriesById['queen-of-tears'].title;$('search').dispatchEvent(new Event('input',{bubbles:true}));")
time.sleep(.4)
assert ev("selectedSeries==='all' && $('place-list').textContent.includes(seriesById['queen-of-tears'].title)")
ev("$('search').value='';window.savedFit=map.fitBounds.bind(map);map.fitBounds=(b,o)=>savedFit(b,{...o,animate:false});")
failures=ev("(()=>{const bad=[];for(const w of catalog.works.filter(w=>places.filter(p=>p.workId===w.id).length>1)){selectWork(w.id);map.stop();const edge=document.querySelector('.sidebar').getBoundingClientRect().right;for(const p of visiblePlaces()){const point=map.latLngToContainerPoint([p.lat,p.lng]);if(point.x<edge)bad.push([w.id,p.id,point.x,edge]);}}return bad;})()")
assert not failures,failures
ev("map.fitBounds=savedFit;selectWork('queen-of-tears');const p=places.find(p=>p.workId==='queen-of-tears'&&(scenesByLandmark.get(p.id)||[]).some(s=>s.image));focusPlace(p.id);void 0")
assert ev("!!document.querySelector('.place-popup-actions a[href*=\"compare.html?scene=\"]')")
print('Global work search, desktop sidebar avoidance across works and direct comparison entry passed.')
