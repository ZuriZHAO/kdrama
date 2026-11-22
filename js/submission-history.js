/* A local list of successfully checked Issues, never a claim of account ownership. */
(function () {
  'use strict';
  window.KdramaSubmissionHistory = function ({ repo, host, onSelect, onRemove }) {
    const key = 'kdrama-submission-history-v1:' + repo.toLowerCase();
    let entries = [], storageProblem = false;
    const valid = item => item && Number.isSafeInteger(item.number) && item.number > 0
      && typeof item.title === 'string' && typeof item.status === 'string'
      && Number.isFinite(item.checkedAt) && item.checkedAt > 0;
    function load() {
      try {
        const raw = localStorage.getItem(key);
        const data = raw ? JSON.parse(raw) : { version: 1, entries: [] };
        if (data.version !== 1 || !Array.isArray(data.entries)) throw Error('Unsupported history');
        const seen = new Set();
        entries = data.entries.filter(item => {
          if (!valid(item) || seen.has(item.number)) return false;
          seen.add(item.number); return true;
        }).slice(0, 30).map(item => ({ number: item.number, title: item.title.slice(0, 200),
          status: item.status.slice(0, 700), checkedAt: item.checkedAt }));
        storageProblem = false;
      } catch { storageProblem = true; }
    }
    function save() {
      try { localStorage.setItem(key, JSON.stringify({ version: 1, entries })); storageProblem = false; }
      catch { storageProblem = true; }
      render();
    }
    function render() {
      host.replaceChildren();
      const heading = document.createElement('h3'); heading.textContent = '本机已查询的投稿';
      const note = document.createElement('p'); note.className = 'hint';
      note.textContent = '保留最近 30 条查询记录，仅在当前浏览器保存，不代表已登录 GitHub。下方为上次查询结果，点击“刷新进度”获取最新状态。移除记录不会删除 GitHub 投稿。';
      host.append(heading, note);
      if (storageProblem) {
        const warning = document.createElement('p'); warning.className = 'hint'; warning.setAttribute('role', 'status');
        warning.textContent = '无法读取或保存本机记录；当前页面仍可查询，关闭后可能无法恢复。'; host.append(warning);
      }
      if (!entries.length) {
        const empty = document.createElement('p'); empty.className = 'hint';
        empty.textContent = '查询一条已提交的 Issue 后会自动保存在这里。'; host.append(empty);
      }
      const list = document.createElement('ul'); list.className = 'submission-history-list';
      for (const entry of entries) {
        const row = document.createElement('li'); row.dataset.historyIssue = String(entry.number);
        const link = document.createElement('a'); link.href = `https://github.com/${repo}/issues/${entry.number}`;
        link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = `#${entry.number} ${entry.title}`;
        const status = document.createElement('p'); status.className = 'history-status'; status.textContent = entry.status;
        const stamp = document.createElement('small'); stamp.textContent = '上次查询：' + new Date(entry.checkedAt).toLocaleString();
        const actions = document.createElement('div'); actions.className = 'history-actions';
        const refresh = document.createElement('button'); refresh.type = 'button'; refresh.className = 'text-button';
        refresh.textContent = '刷新进度'; refresh.setAttribute('aria-label', `刷新投稿 #${entry.number} 的进度`);
        refresh.addEventListener('click', () => onSelect(entry.number));
        const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'text-button';
        remove.textContent = '移除记录'; remove.setAttribute('aria-label', `移除本机记录 #${entry.number}`);
        remove.addEventListener('click', () => { entries = entries.filter(item => item.number !== entry.number); onRemove(entry.number); save(); });
        actions.append(refresh, remove); row.append(link, status, stamp, actions); list.append(row);
      }
      host.append(list);
    }
    load(); render();
    window.addEventListener('storage', event => { if (event.key === key || event.key === null) { load(); render(); } });
    return { remember(item) {
      if (!valid(item)) return;
      // Merge other tabs' latest records before writing this successful query.
      load();
      entries = [{ number: item.number, title: item.title.slice(0, 200), status: item.status.slice(0, 700), checkedAt: item.checkedAt },
        ...entries.filter(entry => entry.number !== item.number)].slice(0, 30);
      save();
    } };
  };
})();
