(() => {
  const $=id=>document.getElementById(id),repo=window.KDRAMA_REPO;let page=1,loading=false;
  async function load(){if(loading)return;loading=true;$('queue-status').textContent='正在读取…';$('queue-list').replaceChildren();$('queue-next').disabled=true;$('queue-prev').disabled=true;
    try{
      const mode=$('queue-filter').value,p=new URLSearchParams({state:mode==='published'?'all':'open',per_page:'50',page:String(page),sort:'updated',direction:'desc'});if(mode!=='pending')p.set('labels',mode);
      const r=await fetch(`https://api.github.com/repos/${repo}/issues?${p}`,{cache:'no-store',signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error(r.status===403||r.status===429?'GitHub 请求额度暂时不足，请稍后重试或打开 Issues。':'无法读取 GitHub 投稿列表。');
      const all=await r.json();let manifest=null;if(mode==='published'){try{const m=await fetch('./data/publication-status.json',{cache:'no-store'});if(m.ok)manifest=await m.json();}catch{}}
      const issues=all.filter(x=>!x.pull_request&&/KDRAMA_SUBMISSION_/.test(x.body||'')&&(mode!=='pending'||!x.labels.some(l=>['needs-info','published','publish-failed'].includes(l.name))));
      for(const issue of issues){const row=document.createElement('article');row.className='queue-row';const a=document.createElement('a');a.href='./review.html?issue='+issue.number;a.textContent=`#${issue.number} ${issue.title}`;
        try{if(KdramaSubmission.parseIssue(issue.body).payload.kind==='maintenance')a.href='./manage.html?issue='+issue.number;}catch{}
        const meta=document.createElement('small');meta.textContent=`${issue.user?.login||''} · ${new Date(issue.updated_at).toLocaleString('zh-CN')}`;
        if(mode==='published')meta.textContent+=manifest?.updates?.some(u=>u.issueNumber===issue.number)?' · 线上已有发布记录':' · 尚未核对线上记录';
        const github=document.createElement('a');github.href=`https://github.com/${repo}/issues/${issue.number}`;github.textContent='GitHub ↗';github.target='_blank';github.rel='noopener noreferrer';row.append(a,meta,github);$('queue-list').append(row);
      }
      $('queue-status').textContent=`第 ${page} 页 · 本页 ${issues.length} 条符合筛选的投稿${!issues.length?'，可翻页或调整筛选':''}`;$('queue-next').disabled=all.length<50;$('queue-prev').disabled=page===1;
    }catch(e){$('queue-status').textContent=e.message;}finally{loading=false;}
  }
  $('queue-refresh').onclick=load;$('queue-filter').onchange=()=>{page=1;load();};$('queue-next').onclick=()=>{page++;load();};$('queue-prev').onclick=()=>{page=Math.max(1,page-1);load();};
  $('queue-panel').addEventListener('toggle',()=>{if($('queue-panel').open&&!$('queue-list').children.length)load();});
})();
