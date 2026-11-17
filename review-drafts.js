// Save raw editor values so unfinished timestamps and unapplied JSON survive reloads.
(() => {
  window.KdramaReviewDrafts = { create(api) {
    const $ = id => document.getElementById(id);
    const prefix = 'kdrama-review-draft-v1:' + api.repo + ':', lastKey = prefix + 'last';
    let active = null, timer, suspended = false, failed = false;
    const keyFor = source => source ? 'issue-' + source.number : 'pasted';
    const message = text => { $('review-draft-status').textContent = text; };
    function read(key) {
      try {
        const raw = localStorage.getItem(prefix + key);
        if (!raw) return null;
        const d = JSON.parse(raw), s = d.state;
        if (d.version !== 1 || d.repo !== api.repo || typeof d.savedAt !== 'string' || !s ||
            typeof s.body !== 'string' || !s.payload || typeof s.payload !== 'object' || Array.isArray(s.payload) ||
            !s.fields || typeof s.fields !== 'object' || Array.isArray(s.fields) ||
            !Array.isArray(s.scenes) || !Array.isArray(s.dirty) ||
            (s.source && (!Number.isSafeInteger(s.source.number) || s.source.number < 1 || typeof s.source.body !== 'string'))) return null;
        return d;
      } catch { return null; }
    }
    function list() {
      const select = $('review-draft-list'), old = select.value;
      select.replaceChildren(new Option('选择本机审核草稿', ''));
      try {
        const drafts = Object.keys(localStorage).filter(k => k.startsWith(prefix) && k !== lastKey)
          .map(k => [k.slice(prefix.length), read(k.slice(prefix.length))]).filter(([, d]) => d)
          .sort((a, b) => b[1].savedAt.localeCompare(a[1].savedAt));
        for (const [key, d] of drafts) select.add(new Option(
          (d.state.source ? 'Issue #' + d.state.source.number : '粘贴正文') +
          (key.includes('-conflict-') ? ' · 旧版本' : '') + ' · ' + new Date(d.savedAt).toLocaleString(), key));
        if ([...select.options].some(o => o.value === old)) select.value = old;
        else if (active) select.value = active;
      } catch { /* Saving reports unavailable storage; browsing can still continue. */ }
    }
    function save() {
      clearTimeout(timer);
      if (suspended || !active) return;
      const state = api.capture();
      if (!state) return;
      try {
        localStorage.setItem(prefix + active, JSON.stringify({ version: 1, repo: api.repo, savedAt: new Date().toISOString(), state }));
        localStorage.setItem(lastKey, active);
        failed = false;
        message('审核草稿已保存在当前浏览器，尚未保存到 GitHub。');
        list();
      } catch {
        failed = true;
        message('草稿保存失败，请保留页面并导出草稿后再关闭。');
      }
    }
    function schedule() {
      if (!suspended && active) { clearTimeout(timer); timer = setTimeout(save, 250); }
    }
    function restore(key) {
      const d = read(key);
      if (!d) return false;
      save();
      suspended = true;
      try {
        api.restore(d.state);
        active = key;
        try { localStorage.setItem(lastKey, key); } catch { failed = true; }
        message('已恢复审核草稿。生成正文时会检查原 Issue 是否有新修改。');
        list();
        return true;
      } catch (e) { message('无法恢复草稿：' + e.message); return false; }
      finally { suspended = false; }
    }
    function afterLoad(source, body) {
      active = keyFor(source);
      const d = read(active);
      const sameSource = d && (source
        ? d.state.source?.number === source.number && d.state.source.body === source.body
        : !d.state.source && (d.state.originalBody ?? d.state.body) === body);
      if (sameSource) {
        suspended = true;
        try { api.restore(d.state); message('已读取投稿并恢复本机修改；尚未保存到 GitHub。'); }
        catch (e) { active = null; message('草稿暂不能恢复，已保留原副本：' + e.message); }
        finally { suspended = false; }
      } else if (d) {
        try {
          const archiveKey = active + '-conflict-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
          localStorage.setItem(prefix + archiveKey, JSON.stringify(d));
          save();
          if (!failed) message('原投稿已变化：旧草稿已另存为“旧版本”，当前显示最新正文，可继续编辑。可恢复旧版本作对照。');
        } catch {
          active = null; failed = true;
          message('原投稿已变化，但无法另存旧草稿；已暂停自动保存，请先导出需要保留的内容。');
        }
      } else save();
      list();
    }
    function exportDraft() {
      const chosen = $('review-draft-list').value;
      const d = chosen && chosen !== active ? read(chosen)
        : { version: 1, repo: api.repo, savedAt: new Date().toISOString(), state: api.capture() };
      if (!d?.state) return;
      const url = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' }));
      const a = document.createElement('a'); a.href = url; a.download = 'kdrama-review-' + (chosen || active || 'draft') + '.json';
      a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    $('review-draft-restore').onclick = () => restore($('review-draft-list').value);
    $('review-draft-export').onclick = exportDraft;
    $('review-draft-clear').onclick = () => {
      const key = $('review-draft-list').value || active;
      if (!key || !confirm('删除这份本机审核草稿？不会修改 GitHub 或当前表单。')) return;
      try {
        localStorage.removeItem(prefix + key);
        if (localStorage.getItem(lastKey) === key) localStorage.removeItem(lastKey);
        if (active === key) { active = null; clearTimeout(timer); }
        list(); message('本机草稿已删除，当前表单仍保留。点击“保存当前表单为草稿”可重新开启自动保存。');
      } catch { message('无法删除本机草稿，请检查浏览器存储权限。'); }
    };
    $('review-draft-start').onclick = () => {
      const state = api.capture(); if (!state) return;
      const key = keyFor(state.source);
      if (read(key) && active !== key && !confirm('用当前表单替换同一投稿的旧本机草稿？请先导出需要保留的旧内容。')) return;
      active = key; save();
    };
    window.addEventListener('pagehide', save);
    window.addEventListener('beforeunload', e => { save(); if (failed) { e.preventDefault(); e.returnValue = ''; } });
    list();
    return { save, schedule, afterLoad, restoreLast() {
      try { const key = localStorage.getItem(lastKey); if (key) restore(key); } catch { /* No saved draft. */ }
    } };
  } };
})();
