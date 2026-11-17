"""Review persistence regression. Uses a dedicated CDP profile; never posts to GitHub.
Arguments: local site URL, Chrome debug port. Only the qa/review-drafts namespace is cleared.
"""
from pathlib import Path
exec(Path('tools/test-map-browser.py').read_text(encoding='utf8').split("cmd('Emulation.setDeviceMetricsOverride'")[0])
mock = r"""
Object.defineProperty(window,'KDRAMA_REPO',{get:()=> 'qa/review-drafts',set:()=>{}});
window.qaRequests=0;
window.qaBody=(number)=>{
 const p={version:2,kind:'update',landmarkId:KDRAMA_CATALOG.landmarks[0].id,
  changes:{name:'Remote '+number+(sessionStorage.qaRemote||'')},rightsConfirmed:true,
  scenes:[1,2].map(i=>({key:'s'+i,description:'Scene '+i,episode:i,timeSeconds:i*61,
    imageUrl:'https://github.com/user-attachments/assets/11111111-1111-1111-1111-111111111111',crop:{x:50,y:50}}))};
 return '<!-- KDRAMA_SUBMISSION_V2_START -->\n```json\n'+JSON.stringify(p)+'\n```\n<!-- KDRAMA_SUBMISSION_V2_END -->';
};
const originalFetch=window.fetch;
window.fetch=async function(url,options){
 if(String(url).includes('api.github.com/repos/qa/review-drafts/')){
  window.qaRequests++;
  if(sessionStorage.qaOffline)throw Error('QA offline');
  const number=Number(String(url).match(/issues\/(\d+)/)?.[1]);
  return new Response(JSON.stringify({number,body:qaBody(number),updated_at:'2026-11-17T00:00:00Z'}));
 }
 return originalFetch.call(this,url,options);
};
"""
cmd('Page.enable');cmd('Network.enable');cmd('Network.setCacheDisabled',{'cacheDisabled':True})
injection=cmd('Page.addScriptToEvaluateOnNewDocument',{'source':mock})['identifier']
cmd('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False})
review=base.rstrip('/')+'/review.html'
cmd('Page.navigate',{'url':review});time.sleep(.6)
wait("typeof reviewDrafts!=='undefined' && reviewDrafts")
ev("Object.keys(localStorage).filter(k=>k.startsWith('kdrama-review-draft-v1:qa/review-drafts:')).forEach(k=>localStorage.removeItem(k));delete sessionStorage.qaRemote;delete sessionStorage.qaOffline")
cmd('Page.navigate',{'url':review+'?issue=99001'});time.sleep(.6)
wait("typeof basePayload!=='undefined' && basePayload && !issueLoading")
assert ev('qaRequests===1')
def field(id,text):
    ev(f"$({json.dumps(id)}).value={json.dumps(text)};$({json.dumps(id)}).dispatchEvent(new Event('input',{{bubbles:true}}))")
def multi(key,text,index=0):
    ev(f"window.el=document.querySelectorAll('[data-multi-field={key}]')[{index}];el.value={json.dumps(text)};el.dispatchEvent(new Event('input',{{bubbles:true}}))")
field('review-name','Edited draft');field('review-lat','37.12345')
multi('description','Edited scene 1');multi('timeText','12:');multi('x','17')
field('review-json','{"unfinished":')
ev('reviewDrafts.save()')
cmd('Page.reload');time.sleep(.6);wait("typeof basePayload!=='undefined' && basePayload && !issueLoading")
assert ev("$('review-name').value==='Edited draft' && $('review-lat').value==='37.12345'")
assert ev("KdramaReviewScenes.snapshot()[0].timeText==='12:' && KdramaReviewScenes.snapshot()[0].crop.x===17 && KdramaReviewScenes.snapshot()[0].description==='Edited scene 1'")
assert ev("advancedDirty && $('review-json').value==='{\"unfinished\":' && qaRequests===1")
multi('timeText','12:34');ev("$('review-refresh-json').click();$('review-apply-json').click();reviewDrafts.save()")
# Applying advanced JSON changes the editing baseline but not the original Issue identity.
cmd('Page.reload');time.sleep(.6);wait("typeof basePayload!=='undefined' && basePayload && !issueLoading")
assert ev("$('review-name').value==='Edited draft' && !advancedDirty && ![...$('review-draft-list').options].some(o=>o.value.includes('conflict'))")
ev("$('review-generate').click()")
wait("!$('review-generate').disabled")
assert ev("!$('review-result').hidden"),ev("$('review-status').textContent")
assert ev("KdramaSubmission.parseIssue($('review-output').value).payload.scenes[0].timeSeconds===754")
assert ev("KdramaSubmission.parseIssue($('review-output').value).payload.scenes.length===2")
# Distinct issues retain separate edits.
ev("$('review-issue').value='99002';loadFromGitHub()")
wait("!issueLoading && fetchedIssue.number===99002")
field('review-name','Second draft');ev('reviewDrafts.save()')
ev("$('review-issue').value='99001';loadFromGitHub()")
wait("!issueLoading && fetchedIssue.number===99001")
assert ev("$('review-name').value==='Edited draft'")
# Remote edits load visibly, archiving rather than overwriting the saved local draft.
ev("sessionStorage.qaRemote=' updated'")
cmd('Page.reload');time.sleep(.6);wait("typeof basePayload!=='undefined' && basePayload && !issueLoading")
assert ev("$('review-name').value==='Remote 99001 updated'")
assert ev("[...$('review-draft-list').options].filter(o=>o.value.includes('conflict')).length===1")
ev("$('review-draft-list').value=[...$('review-draft-list').options].find(o=>o.value.includes('conflict')).value;$('review-draft-restore').click();$('review-generate').click()")
wait("!$('review-generate').disabled")
assert ev("$('review-name').value==='Edited draft' && $('review-result').hidden && $('review-status').textContent.includes('原 Issue 正文已被修改')")
# Offline does not silently treat a saved draft as a current remote version.
ev("sessionStorage.qaOffline='1'")
cmd('Page.reload');time.sleep(.6);wait("typeof issueLoading!=='undefined' && !issueLoading && typeof reviewDrafts!=='undefined' && reviewDrafts")
ev("$('review-draft-list').value='issue-99002';$('review-draft-restore').click();$('review-generate').click()")
wait("!$('review-generate').disabled")
assert ev("$('review-name').value==='Second draft' && $('review-result').hidden && $('review-status').textContent.includes('QA offline')")
ev('delete sessionStorage.qaOffline')
# Pasted Issues have an independent original body, and changes archive the previous text.
ev("$('review-input').value=qaBody(99003);$('review-load').click()")
field('review-name','Pasted draft');ev("$('review-refresh-json').click();$('review-apply-json').click();reviewDrafts.save()")
ev("$('review-input').value=qaBody(99003);$('review-load').click()")
assert ev("$('review-name').value==='Pasted draft'")
ev("$('review-input').value=qaBody(99004);$('review-load').click()")
assert ev("$('review-name').value==='Remote 99004 updated' && [...$('review-draft-list').options].some(o=>o.value.startsWith('pasted-conflict-'))")
# Removing an image and editing its replacement must survive reload.
ev("document.querySelector('#review-scene-cards fieldset button').click()")
multi('imageUrl','https://github.com/user-attachments/assets/22222222-2222-2222-2222-222222222222')
ev('reviewDrafts.save()')
cmd('Page.navigate',{'url':review});time.sleep(.6)
wait("typeof basePayload!=='undefined' && basePayload")
assert ev("KdramaReviewScenes.snapshot().length===1 && KdramaReviewScenes.snapshot()[0].imageUrl.includes('22222222')")
# Failed local storage must be visible, with the live form still exportable.
ev("window.qaSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('quota')};reviewDrafts.save()")
assert ev("$('review-draft-status').textContent.includes('保存失败')")
assert ev("(()=>{const e=new Event('beforeunload',{cancelable:true});window.dispatchEvent(e);return e.defaultPrevented})()")
ev('Storage.prototype.setItem=qaSet')
cmd('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':1,'mobile':True})
time.sleep(.2)
assert ev('document.documentElement.scrollWidth<=390')
print('PASS: per-Issue and pasted drafts, raw fields/JSON, timestamps, image/crop removal, refresh recovery, remote conflict archive and guard, offline guard, quota warning, mobile width.')
cmd('Page.removeScriptToEvaluateOnNewDocument',{'identifier':injection})
ws.close()
