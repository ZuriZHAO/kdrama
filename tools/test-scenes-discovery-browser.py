"""Browser regression using temporary in-memory scenes, never writes catalogue data.
Run with Python websocket-client; arguments are base URL and Chrome CDP port.
"""
from pathlib import Path
exec(Path('tools/test-map-browser.py').read_text(encoding='utf8').split("cmd('Emulation.setDeviceMetricsOverride'")[0])
fixture = r"""
Object.defineProperty(window,'KDRAMA_CATALOG',{configurable:true,set(c){
  const original=c.scenes.find(s=>s.image), p=c.landmarks.find(p=>p.id===original.landmarkId);
  const pictures=c.scenes.filter(s=>s.image).slice(0,3);
  const scenes=[1,2,3].map((n,i)=>({...original,id:'qa-scene-'+n,landmarkId:p.id,episode:n===1?1:5,timeSeconds:n*61,description:'QA scene '+n,image:pictures[i]?.image||original.image,thumbnail:null,mediumImage:null,order:n}));
  scenes.push({...scenes[0],id:'qa-no-image',episode:8,timeSeconds:null,description:'QA text only',image:null,order:4});
  c.scenes=c.scenes.filter(s=>s.landmarkId!==p.id).concat(scenes);
  window.qa={placeId:p.id,workId:p.workId,scenes};
  Object.defineProperty(window,'KDRAMA_CATALOG',{value:c,writable:true,configurable:true});
}});
"""
cmd('Page.enable')
cmd('Page.addScriptToEvaluateOnNewDocument',{'source':fixture})
cmd('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False})
cmd('Page.navigate',{'url':base})
wait("typeof qa!=='undefined' && typeof selectedSceneId!=='undefined' && typeof window.renderMapDiscovery==='function'")
ev("selectWork(qa.workId);document.querySelector('[data-work-tab=episode]').click()")
wait("document.querySelector('[data-scene=qa-scene-2]')")
assert ev("[...document.querySelectorAll('[data-collapse]')].find(b=>b.dataset.collapse==='第 5 集').nextElementSibling.querySelectorAll('[data-scene^=qa-scene]').length===2")
ev("document.querySelector('[data-scene=qa-scene-2]').click()")
wait("selectedSceneId==='qa-scene-2'")
assert ev("document.querySelector('.popup-scene-meta').textContent==='第 5 集 · 2:02'")
assert ev("document.querySelector('.place-popup p').textContent==='QA scene 2'")
assert ev("document.querySelector('.place-popup-image').getAttribute('src')===qa.scenes[1].image")
time.sleep(.3)
assert ev("markers.get(qa.placeId).getElement().querySelector('img').getAttribute('src')===qa.scenes[1].image")
assert ev("new URL(location.href).searchParams.get('scene')==='qa-scene-2'")
ev("document.querySelector('[data-scene-step=\"1\"]').click()")
assert ev("selectedSceneId==='qa-scene-3' && document.querySelector('.place-popup p').textContent==='QA scene 3'")
ev('history.back()');wait("selectedSceneId==='qa-scene-2'")
cmd('Page.reload');wait("typeof selectedSceneId!=='undefined' && selectedSceneId==='qa-scene-2' && document.querySelector('.place-popup-image')")
assert ev("document.querySelector('.place-popup p').textContent==='QA scene 2'")
# A fresh navigation to a copied URL must also restore the same screenshot.
shared=ev('location.href');cmd('Page.navigate',{'url':shared})
wait("typeof selectedSceneId!=='undefined' && selectedSceneId==='qa-scene-2' && document.querySelector('.place-popup-image')")
ev("document.querySelector('.popup-image-open').click();$('next-image').click()")
assert ev("selectedSceneId==='qa-scene-3' && $('image-caption').textContent.includes('3:03')")
ev("$('close-image').click();document.querySelector('[data-scene-step=\"1\"]').click()")
assert ev("selectedSceneId==='qa-no-image' && !document.querySelector('.place-popup-image') && document.querySelector('.place-popup p').textContent==='QA text only'")
ev("document.querySelector('[data-popup-detail]').click()")
assert ev("document.querySelector('.scene-record.active').dataset.sceneRecord==='qa-no-image'")
# Foreign/deleted scene IDs fall back to a scene of this landmark.
ev("const u=new URL(location.href);u.searchParams.set('scene','missing-scene');history.replaceState(null,'',u);restoreView()")
assert ev("selectedSceneId==='qa-scene-1'")
ev("showAllWorks();map.stop();map.setView([37.55,126.99],10,{animate:false});renderMapDiscovery()")
time.sleep(.6)
wait("document.querySelectorAll('[data-discover-work]').length>2")
ev("window.beforeView=JSON.stringify([map.getCenter(),map.getZoom()]);window.chosen=[...document.querySelectorAll('[data-discover-work]')].slice(0,2).map(b=>b.dataset.discoverWork);document.querySelector('[data-discover-work=\"'+chosen[0]+'\"]').click();document.querySelector('[data-discover-work=\"'+chosen[1]+'\"]').click()")
assert ev("selectedWorkIds.size===2 && visiblePlaces().every(p=>chosen.includes(p.workId))")
assert ev("JSON.stringify([map.getCenter(),map.getZoom()])===beforeView")
assert ev("document.querySelectorAll('.cluster-marker').length===0")
ev("selectWork(chosen[0])")
assert ev("selectedWorkIds.size===2 && [...document.querySelectorAll('[data-place]')].every(b=>placesById[b.dataset.place].workId===chosen[0])")
ev("$('back-to-works').click()")
assert ev("selectedWorkIds.size===2 && selectedSeries==='all'")
cmd('Page.reload');wait("typeof selectedWorkIds!=='undefined' && selectedWorkIds.size===2 && typeof renderMapDiscovery==='function'")
ev("window.chosen=[...selectedWorkIds];map.setView([0,0],8,{animate:false});renderMapDiscovery()")
assert ev("!$('discovery-empty').hidden && chosen.every(id=>!!document.querySelector('[data-discover-work=\"'+id+'\"]'))")
ev("document.querySelector('[data-discover-work=\"'+chosen[0]+'\"]').click()")
assert ev('selectedWorkIds.size===1')
ev('history.back()');wait('selectedWorkIds.size===2')
ev("$('discovery-clear').click();map.setView([35.18,129.07],11,{animate:false});renderMapDiscovery()")
assert ev("[...document.querySelectorAll('[data-discover-work]')].every(b=>places.some(p=>p.workId===b.dataset.discoverWork && map.getBounds().contains([p.lat,p.lng])))")
cmd('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':1,'mobile':True})
time.sleep(.3)
assert ev("document.documentElement.scrollWidth<=390 && $('map-discovery').getBoundingClientRect().right<=390")
ev("$('discovery-toggle').click()")
assert ev("getComputedStyle($('discovery-content')).display==='none'")
print('PASS: exact scene image/metadata, popup switching, gallery, sharing/reload/back, missing scenes, viewport discovery, multi-work selection and mobile controls.')
# Count requests without creating an Issue or contacting GitHub.
mock = r"""window.qaRequests=0;const originalFetch=window.fetch;window.fetch=async function(url,options){
if(String(url).includes('api.github.com/repos/') && String(url).endsWith('/issues/99123')){
 window.qaRequests++;await new Promise(r=>setTimeout(r,700));return new Response('{}',{status:404});
}return originalFetch.call(this,url,options);};"""
cmd('Page.addScriptToEvaluateOnNewDocument',{'source':mock})
cmd('Page.navigate',{'url':base.rstrip('/')+'/review.html?issue=99123'})
wait("window.qaRequests===1 && typeof loadFromGitHub==='function'")
ev("loadFromGitHub();loadFromGitHub()")
time.sleep(1)
assert ev("qaRequests===1 && document.getElementById('review-status').textContent.includes('未找到')")
ev('loadFromGitHub()');time.sleep(1)
assert ev('qaRequests===2')
print('PASS: review initial load once, duplicate submissions suppressed, failure remains retryable.')
ws.close()
