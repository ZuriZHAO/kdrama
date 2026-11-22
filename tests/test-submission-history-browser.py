"""Local mocked Issues only; never creates or changes a live GitHub Issue."""
from pathlib import Path
exec(Path('tests/test-map-browser.py').read_text(encoding='utf8').split("cmd('Emulation.setDeviceMetricsOverride'")[0])
mock = r"""
Object.defineProperty(window,'KDRAMA_REPO',{get:()=> 'qa/submission-history',set:()=>{}});
window.qaErrors=[];window.addEventListener('error',e=>qaErrors.push(e.message));
window.qaRequests=[];
window.qaBody=()=> '<!-- KDRAMA_SUBMISSION_V2_START -->\n```json\n'+JSON.stringify({version:2,kind:'update',landmarkId:'fixture',changes:{name:'New name'}})+'\n```\n<!-- KDRAMA_SUBMISSION_V2_END -->';
const originalFetch=window.fetch;
window.fetch=async function(url,options){
 const address=String(url);
 if(address.includes('api.github.com/repos/qa/submission-history/')){
  qaRequests.push(address);
  if(sessionStorage.qaOffline)throw Error('QA offline');
  const number=Number(address.match(/issues\/(\d+)/)?.[1]);
  if(number===70)await new Promise(resolve=>window.qaRelease=resolve);
  if(number===404)return new Response('{}',{status:404});
  const issue={number,title:number===12?'<img src=x onerror=alert(1)>':'Fixture '+number,body:qaBody(),state:'open',labels:[]};
  if(number===13)issue.pull_request={};
  if(number===14)issue.labels=['publish-approved'];
  if(number===15)issue.labels=['needs-info'];
  if(number===16)issue.body='unrelated issue';
  return new Response(JSON.stringify(issue));
 }
 if(address.includes('publication-status.json'))return new Response(JSON.stringify({updates:[{issueNumber:17,landmarkId:'test-place'}]}));
 return originalFetch.call(this,url,options);
};
"""
cmd('Page.enable');cmd('Network.enable');cmd('Network.setCacheDisabled',{'cacheDisabled':True})
script=cmd('Page.addScriptToEvaluateOnNewDocument',{'source':mock})['identifier']
cmd('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':1,'mobile':True})
cmd('Page.navigate',{'url':base+'submit.html'})
wait("typeof submissionHistory!=='undefined'")
ev("localStorage.removeItem('kdrama-submission-history-v1:qa/submission-history');sessionStorage.removeItem('qaOffline')")
cmd('Page.reload');wait("typeof submissionHistory!=='undefined'")
def check(number):
    ev("$('issue-number').value="+json.dumps(str(number))+";checkProgress()")
def records():
    return ev("[...document.querySelectorAll('[data-history-issue]')].map(e=>Number(e.dataset.historyIssue))")
assert records()==[]
check(11);check(12);assert records()==[12,11]
assert ev("!$('submission-history').querySelector('img')")
check(11);assert records()==[11,12]
assert ev("document.documentElement.scrollWidth<=innerWidth")
cmd('Page.reload');wait("typeof submissionHistory!=='undefined'")
assert records()==[11,12]
assert ev('qaRequests.length===0'), 'Reload should not consume GitHub API quota automatically'
check(14)
assert ev("$('published-place-link').hidden"), 'An approval label is not proof of deployment'
check(17)
assert ev("!$('published-place-link').hidden && $('published-place-link').href.endsWith('#place=test-place')")
before=records()
for invalid in [13,16,404,'https://github.com/elsewhere/repo/issues/1']:
    check(invalid);assert records()==before
ev("sessionStorage.qaOffline='1'");check(18);assert records()==before
ev("sessionStorage.removeItem('qaOffline');$('issue-number').value='bad input';document.querySelector('[data-history-issue=\"12\"] button:last-child').click()")
assert 12 not in records(), 'Removing history must work with an invalid current input'
assert ev('qaErrors.length===0'),ev('qaErrors')
# A slow earlier response cannot replace a later selected Issue or re-add a removed record.
ev("$('issue-number').value='70';checkProgress();void 0")
wait('window.qaRelease');check(15)
ev('qaRelease();void 0');time.sleep(.15)
assert records()[0]==15 and 70 not in records()
ev("document.querySelector('[data-history-issue=\"15\"] button:last-child').click()")
assert ev("$('issue-number').value==='' && !$('check-progress').disabled")
# Same-origin tabs update the list without an extra query.
ev("localStorage.removeItem('kdrama-submission-history-v1:qa/submission-history');window.dispatchEvent(new StorageEvent('storage',{key:'kdrama-submission-history-v1:qa/submission-history'}))")
assert records()==[]
for number in range(100,132): check(number)
assert len(records())==30 and records()[0]==131 and 100 not in records()
assert ev('qaErrors.length===0'),ev('qaErrors')
# Failure to save still leaves a usable query result and a visible storage warning.
ev("Storage.prototype.setItem=function(){throw Error('QA storage full')}")
check(200)
assert records()[0]==200
assert ev("$('submission-history').querySelector('[role=status]')!==null")
assert ev("!$('progress-issue-link').hidden")
cmd('Page.removeScriptToEvaluateOnNewDocument',{'identifier':script})
print('Submission history: multi-Issue persistence, deduplication, stale-response guard, publication evidence, invalid input, storage failure, safe rendering and mobile layout passed.')
