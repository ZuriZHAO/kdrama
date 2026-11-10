"""UI regression: serve project on 8044 and start test Chrome with CDP on 9246.
Requires Python websocket-client. Optional arguments: base URL, CDP port.
"""
import json
import sys
import time
import urllib.request
import websocket

base = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:8044/'
port = sys.argv[2] if len(sys.argv) > 2 else '9246'
page = next(p for p in json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json')) if p.get('type') == 'page')
ws = websocket.create_connection(page['webSocketDebuggerUrl'], origin='http://localhost', http_proxy_host=None, timeout=20)
seq = 0

def cmd(method, params=None):
    global seq
    seq += 1
    ws.send(json.dumps({'id': seq, 'method': method, 'params': params or {}}))
    while True:
        result = json.loads(ws.recv())
        if result.get('id') == seq:
            assert 'error' not in result, result
            return result.get('result', {})

def ev(code):
    result = cmd('Runtime.evaluate', {'expression': code, 'returnByValue': True, 'awaitPromise': True})
    assert 'exceptionDetails' not in result, result
    return result.get('result', {}).get('value')

def wait(code):
    for _ in range(150):
        if ev('Boolean(' + code + ')'):
            return
        time.sleep(.1)
    raise AssertionError('Timeout: ' + code)

cmd('Emulation.setDeviceMetricsOverride', {'width': 1440, 'height': 1000, 'deviceScaleFactor': 1, 'mobile': False})
cmd('Page.navigate', {'url': base})
wait("typeof map !== 'undefined' && map && typeof clusterLayer !== 'undefined'")
# Use temporary browser-only group labels, never modify the published catalogue.
ev("""window.fixtureWork=places.find(p=>places.filter(x=>x.workId===p.workId).length>=3).workId;
window.fixturePlaces=places.filter(p=>p.workId===fixtureWork);
window.originalGroups=fixturePlaces.map(p=>p.group);
fixturePlaces.forEach((p,i)=>p.group=i%2?'测试组乙':'测试组甲');selectWork(fixtureWork);""")
time.sleep(1)
assert ev("document.querySelectorAll('[data-collapse]').length===2")
assert ev("[...document.querySelectorAll('[data-collapse]')].every(b=>b.getAttribute('aria-expanded')==='true')")
ev("window.beforeIds=visiblePlaces().map(p=>p.id).join();window.beforeView=JSON.stringify([map.getCenter(),map.getZoom()]);document.querySelector('[data-collapse]').click()")
assert ev("document.querySelector('[data-collapse]').getAttribute('aria-expanded')==='false'")
assert ev("visiblePlaces().map(p=>p.id).join()===beforeIds && JSON.stringify([map.getCenter(),map.getZoom()])===beforeView")
assert ev("document.activeElement.matches('[data-collapse]')")
cmd('Page.reload')
wait("typeof groupViewInitialized !== 'undefined' && groupViewInitialized && map")
assert ev("collapsedGroups.has('测试组甲')")
# Recreate browser-only fixture after reload; persisted folder state remains valid.
ev("window.fixtureWork=selectedSeries;window.fixturePlaces=places.filter(p=>p.workId===fixtureWork);window.originalGroups=fixturePlaces.map(p=>p.group);fixturePlaces.forEach((p,i)=>p.group=i%2?'测试组乙':'测试组甲');renderList();")
ev("$('collapse-groups').click()")
assert ev("[...document.querySelectorAll('[data-collapse]')].every(b=>b.getAttribute('aria-expanded')==='false')")
ev("$('expand-groups').click()")
assert ev("[...document.querySelectorAll('[data-collapse]')].every(b=>b.getAttribute('aria-expanded')==='true')")
ev("window.beforeIds=visiblePlaces().map(p=>p.id).join();window.beforeView=JSON.stringify([map.getCenter(),map.getZoom()]);document.querySelector('[data-work-tab=episode]').click()")
assert ev("visiblePlaces().map(p=>p.id).join()===beforeIds && JSON.stringify([map.getCenter(),map.getZoom()])===beforeView")
ev("history.back()")
wait("workTab==='group'")
# A landmark in several episodes uses that episode's screenshot and never
# appears under Ungrouped merely because another screenshot has no episode.
ev("""window.sceneFixtureId=fixturePlaces[0].id;window.savedScenes=scenesByLandmark.get(sceneFixtureId);
scenesByLandmark.set(sceneFixtureId,[{episode:1,image:'./assets/episode-one.jpg'},{episode:2,image:'./assets/episode-two.jpg'},{episode:null,image:'./assets/unassigned.jpg'}]);
document.querySelector('[data-work-tab=episode]').click();""")
assert ev("""[1,2].every(n=>{
const heading=[...document.querySelectorAll('[data-collapse]')].find(b=>b.dataset.collapse===`第 ${n} 集`);
return heading?.nextElementSibling.querySelector(`[data-place="${sceneFixtureId}"] img`)?.getAttribute('src')===`./assets/episode-${n===1?'one':'two'}.jpg`;
})""")
assert ev("![...document.querySelectorAll('[data-collapse]')].find(b=>b.dataset.collapse==='未分组')?.nextElementSibling.querySelector(`[data-place=\"${sceneFixtureId}\"]`)")
ev("scenesByLandmark.set(sceneFixtureId,savedScenes||[]);document.querySelector('[data-work-tab=group]').click()")
ev("$('expand-groups').click();document.querySelector('[data-place]').click()")
assert ev("!!selectedPlace && !detailMode && !!document.querySelector('.place-popup')")
ev("document.querySelector('.place-popup-actions button').click()")
assert ev('detailMode')
ev("hideDetail();$('collapse-groups').click();focusPlace(selectedPlace)")
assert ev("!document.querySelector('.place-card.active').parentElement.hidden")
# 100+ landmarks default to the first folder open, independent of map filtering.
ev("""window.fixtureAdded=[];for(let i=0;i<101;i++){const p={...fixturePlaces[0],id:'browser-test-'+i,group:'大组'+i};fixtureAdded.push(p);places.push(p);}
groupViewInitialized=false;renderList();""")
assert ev("[...document.querySelectorAll('[data-collapse]')].filter(b=>b.getAttribute('aria-expanded')==='true').length===1")
ev("places.splice(places.length-fixtureAdded.length);fixturePlaces.forEach((p,i)=>p.group=originalGroups[i]);groupViewInitialized=false;render();")
cmd('Emulation.setDeviceMetricsOverride', {'width': 390, 'height': 844, 'deviceScaleFactor': 1, 'mobile': True})
ev("document.querySelector('[data-panel-mode=half]').click()")
time.sleep(.4)
assert ev('document.documentElement.scrollWidth<=390')
assert ev("$('work-tabs').getBoundingClientRect().right<=390")
ev("document.querySelector('[data-panel-mode=collapsed]').click()")
time.sleep(.4)
assert ev("document.querySelector('.map-panel').getBoundingClientRect().height>780")
print('PASS: folds preserve map, bulk controls, restored state, tab/back navigation, episode screenshots, landmark popup, large lists and mobile layout.')
ws.close()
