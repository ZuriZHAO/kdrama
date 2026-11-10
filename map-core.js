(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.KdramaMapCore = api;
})(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  // Screen-space buckets avoid comparing every pair of landmarks.
  function cluster(points, radius, selectedId) {
    const buckets = new Map(), groups = [];
    for (const point of points) {
      if (point.id === selectedId) { groups.push({ x: point.x, y: point.y, items: [point] }); continue; }
      const x = Math.floor(point.x / radius), y = Math.floor(point.y / radius);
      let found;
      for (let dx = -1; dx <= 1 && !found; dx++) for (let dy = -1; dy <= 1 && !found; dy++) {
        found = (buckets.get(`${x + dx},${y + dy}`) || []).find(g => Math.hypot(g.x - point.x, g.y - point.y) < radius);
      }
      if (found) found.items.push(point);
      else {
        const group = { x: point.x, y: point.y, items: [point] };
        groups.push(group);
        const key = `${x},${y}`;
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key).push(group);
      }
    }
    return groups;
  }
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
  return { cluster, thumbnails, groupKeys };
});
