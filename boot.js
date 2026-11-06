(async () => {
  const catalog = window.KDRAMA_CATALOG;
  const api = String(window.KDRAMA_SUBMISSION_API || '').replace(/\/$/, '');
  if (catalog && api) {
    try {
      const response = await fetch(api + '/api/catalog', { signal: AbortSignal.timeout(4000) });
      if (response.ok) {
        const additions = await response.json();
        for (const key of ['works', 'landmarks', 'scenes', 'sources']) if (Array.isArray(additions[key])) catalog[key].push(...additions[key]);
        for (const correction of additions.corrections || []) {
          const place = catalog.landmarks.find(item => item.id === correction.landmarkId);
          if (place && correction.changes && typeof correction.changes === 'object') {
            Object.assign(place, correction.changes);
            if ('lat' in correction.changes || 'lng' in correction.changes) place.coordinateStatus = 'approximate';
            if (correction.sourceId) place.sourceId = correction.sourceId;
          }
        }
      }
    } catch (error) { console.warn('投稿目录暂不可用，正在显示已内置的地点。', error); }
  }
  const script = document.createElement('script');
  script.src = './script.js?v=26';
  document.body.appendChild(script);
})();
