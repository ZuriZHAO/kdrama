(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.KdramaMapCore = api;
})(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  // Choose screenshot cards only; callers still render every remaining point.
  function thumbnails(points, selectedId) {
    const chosen = [], ids = new Set();
    for (const point of [...points].sort((a, b) => Number(b.id === selectedId) - Number(a.id === selectedId))) {
      if (!chosen.some(p => Math.abs(p.x - point.x) < 80 && Math.abs(p.y - point.y) < 68)) { chosen.push(point); ids.add(point.id); }
    }
    return ids;
  }
  function groupKeys(place, scenes, mode) {
    if (mode === 'group') return [place.group || '未分组'];
    const keys = [...new Set(scenes.filter(s => s.episode != null && s.episode !== '').map(s => typeof s.episode === 'number' ? `第 ${s.episode} 集` : String(s.episode)))];
    return keys.length ? keys : ['未分组'];
  }
  return { thumbnails, groupKeys };
});
