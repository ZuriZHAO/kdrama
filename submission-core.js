(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.KdramaSubmission = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const start = '<!-- KDRAMA_SUBMISSION_V2_START -->';
  const end = '<!-- KDRAMA_SUBMISSION_V2_END -->';
  const imageMarkers = { image: ['<!-- KDRAMA_IMAGE_START -->', '<!-- KDRAMA_IMAGE_END -->'], poster: ['<!-- KDRAMA_POSTER_START -->', '<!-- KDRAMA_POSTER_END -->'] };
  const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

  function parseIssue(body) {
    if (typeof body !== 'string' || body.length > 100000) throw new Error('投稿正文无效或过长。');
    const markers = body.match(/<!-- KDRAMA_SUBMISSION_(?:V2_START|V1:)/g) || [];
    if (markers.length !== 1) throw new Error('请保留且仅保留一份本项目的投稿数据标记。');
    const editable = /<!-- KDRAMA_SUBMISSION_V2_START -->\s*```json\s*\r?\n([\s\S]{1,30000}?)\r?\n```\s*<!-- KDRAMA_SUBMISSION_V2_END -->/.exec(body);
    if (editable) {
      const payload = JSON.parse(editable[1]);
      if (!isObject(payload) || payload.version !== 2) throw new Error('可编辑投稿版本无效。');
      const jsonStart = editable.index + editable[0].indexOf(editable[1]);
      return { payload, before: body.slice(0, jsonStart), after: body.slice(jsonStart + editable[1].length) };
    }
    const legacy = /<!-- KDRAMA_SUBMISSION_V1:([A-Za-z0-9_-]{20,16000}) -->/.exec(body);
    if (!legacy) throw new Error('未找到完整的投稿数据，请复制完整 Issue 正文。');
    const binary = atob(legacy[1].replace(/-/g, '+').replace(/_/g, '/'));
    if (btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') !== legacy[1]) throw new Error('旧版投稿编码无效。');
    const payload = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(binary, char => char.charCodeAt(0))));
    if (!isObject(payload) || payload.version !== 1) throw new Error('旧版投稿版本无效。');
    payload.version = 2;
    return { payload, before: body.slice(0, legacy.index) + start + '\n```json\n', after: '\n```\n' + end + body.slice(legacy.index + legacy[0].length) };
  }

  function serializeIssue(parsed, payload) {
    if (!parsed || typeof parsed.before !== 'string' || typeof parsed.after !== 'string' || !isObject(payload)) throw new Error('请先读取投稿。');
    return parsed.before + JSON.stringify(payload, null, 2) + parsed.after;
  }

  function slotRange(body, kind) {
    const markers = imageMarkers[kind];
    if (!markers) throw new Error('图片区块无效。');
    const begin = body.indexOf(markers[0]);
    const finish = body.indexOf(markers[1]);
    if (begin < 0 && finish < 0) return null;
    if (begin < 0 || finish <= begin || body.indexOf(markers[0], begin + 1) >= 0 || body.indexOf(markers[1], finish + 1) >= 0) throw new Error('图片区块标记缺失或重复，请检查完整正文。');
    return { start: begin + markers[0].length, end: finish };
  }

  function isGitHubImage(value) {
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || url.username || url.password || url.port) return false;
      return (url.hostname === 'github.com' && /^\/user-attachments\/assets\/[A-Za-z0-9-]{8,100}$/.test(url.pathname)) ||
        (url.hostname === 'user-images.githubusercontent.com' && /^\/\d+\/[A-Za-z0-9._/%-]+$/.test(url.pathname));
    } catch { return false; }
  }

  function imageUrls(text) {
    // GitHub supports both Markdown images and HTML img tags when pasting screenshots.
    const found = [...text.matchAll(/!\[[^\]\r\n]{0,200}\]\((https:\/\/[^\s)]+)\)|<img\b[^>]*?\bsrc\s*=\s*["'](https:\/\/[^"']+)["'][^>]*>/gi)];
    return found.map(match => (match[1] || match[2]).replace(/&amp;/g, '&'));
  }

  function attachmentTail(body) {
    const parsed = parseIssue(body);
    return parsed.after.slice(parsed.after.indexOf(end) + end.length);
  }

  function attachmentRanges(tail) {
    const image = slotRange(tail, 'image');
    const poster = slotRange(tail, 'poster');
    if (image && poster && image.start < poster.end && poster.start < image.end) throw new Error('场景图片与海报区块不能嵌套或重叠。');
    return { image, poster };
  }

  function extractImage(body, kind) {
    const parsed = parseIssue(body);
    const tail = attachmentTail(body);
    const ranges = attachmentRanges(tail);
    const range = ranges[kind];
    if (!Object.hasOwn(imageMarkers, kind)) throw new Error('图片区块无效。');
    if (range) return imageUrls(tail.slice(range.start, range.end)).find(isGitHubImage) || '';
    if (kind === 'image' && !parsed.payload.posterAttachment && !ranges.poster) return imageUrls(tail).find(isGitHubImage) || '';
    return '';
  }

  function replaceImage(body, kind, url) {
    if (url && !isGitHubImage(url)) throw new Error('请使用已上传到 GitHub Issue 的图片链接。');
    const parsed = parseIssue(body);
    const canonical = serializeIssue(parsed, parsed.payload);
    const tailStart = canonical.length - parsed.after.length + parsed.after.indexOf(end) + end.length;
    const range = attachmentRanges(canonical.slice(tailStart))[kind];
    if (!Object.hasOwn(imageMarkers, kind)) throw new Error('图片区块无效。');
    const content = url ? `\n![${kind === 'poster' ? '作品海报' : '场景图片'}](${url})\n` : '\n';
    if (range) return canonical.slice(0, tailStart + range.start) + content + canonical.slice(tailStart + range.end);
    return canonical + '\n\n' + imageMarkers[kind][0] + content + imageMarkers[kind][1] + '\n';
  }

  function parseIssueNumber(input, repository) {
    const text = String(input || '').trim();
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository || '')) throw new Error('仓库设置无效。');
    let number;
    if (/^#?[1-9]\d*$/.test(text)) number = Number(text.replace(/^#/, ''));
    else {
      let url;
      try { url = new URL(text); } catch { throw new Error('请填写 Issue 编号或本仓库的 GitHub Issue 链接。'); }
      const parts = url.pathname.split('/').filter(Boolean);
      if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.username || url.password || url.port || parts.length !== 4 || `${parts[0]}/${parts[1]}`.toLowerCase() !== repository.toLowerCase() || parts[2] !== 'issues' || !/^[1-9]\d*$/.test(parts[3])) throw new Error('请填写本仓库的 GitHub Issue 链接。');
      number = Number(parts[3]);
    }
    if (!Number.isSafeInteger(number) || number < 1) throw new Error('Issue 编号无效。');
    return number;
  }

  function validateSubmission(payload, body, catalog) {
    if (!isObject(payload) || payload.version !== 2 || !['work', 'place', 'scene', 'correction', 'update'].includes(payload.kind)) throw new Error('投稿类型或版本无效。');
    if (!catalog || !Array.isArray(catalog.works) || !Array.isArray(catalog.landmarks)) throw new Error('作品与地点目录尚未加载，请刷新后重试。');
    const text = (value, label, max, required = false) => {
      if (value == null && !required) return '';
      if (typeof value !== 'string') throw new Error(`${label}必须是文字。`);
      const result = value.trim();
      if ((required && !result) || result.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(result)) throw new Error(`${label}为空、过长或含无效字符。`);
      return result;
    };
    const https = (value, label, required = false) => {
      const result = text(value, label, 1000, required);
      if (!result) return '';
      try { const url = new URL(result); if (url.protocol === 'https:' && !url.username && !url.password) return result; } catch {}
      throw new Error(`${label}必须是 HTTPS 链接。`);
    };
    const number = (value, label, min, max, integer = false) => {
      if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) throw new Error(`${label}格式或范围无效。`);
    };
    const type = value => { if (value != null && value !== '' && !['drama', 'movie', 'variety'].includes(value)) throw new Error('作品类型无效。'); };
    const year = value => { const result = text(value, '年份', 4); if (result && !/^\d{4}$/.test(result)) throw new Error('年份请填写四位数字。'); };
    const uniqueWork = title => { if (catalog.works.some(work => work.title.trim().toLocaleLowerCase() === title.toLocaleLowerCase())) throw new Error('同名作品已存在，请选择现有作品。'); };
    text(payload.contributor, '投稿署名', 80);
    text(payload.sourceTitle, '来源名称', 160);
    https(payload.sourceUrl, '来源');
    text(payload.imageCredit, '图片署名', 160);
    for (const field of ['imageAttachment', 'posterAttachment']) if (payload[field] != null && typeof payload[field] !== 'boolean') throw new Error('图片附件标记无效。');
    const imageUrl = payload.imageAttachment ? extractImage(body, 'image') : (payload.imageUrl == null ? '' : https(payload.imageUrl, '图片链接', true));
    const posterUrl = payload.posterAttachment ? extractImage(body, 'poster') : '';
    if (payload.imageAttachment && payload.imageUrl != null) throw new Error('图片链接和附件不能同时提交。');
    if (payload.imageAttachment && !imageUrl) throw new Error('请在场景图片区块附上 GitHub 图片；海报不能代替场景图。');
    if (payload.posterAttachment && !posterUrl) throw new Error('请在作品海报区块附上 GitHub 图片。');
    if ((imageUrl || posterUrl) && payload.rightsConfirmed !== true) throw new Error('请确认图片展示许可。');
    if (payload.posterAttachment && (payload.kind !== 'place' || payload.workId !== 'new')) throw new Error('海报附件仅用于新增作品，请确认投稿类型。');
    if ((imageUrl || posterUrl) && ['work', 'correction'].includes(payload.kind)) throw new Error('此旧版投稿类型不支持图片，请使用补充／更正投稿。');
    if (payload.episode != null) number(payload.episode, '集数', 1, 1000, true);
    if (payload.timeSeconds != null) number(payload.timeSeconds, '播放时间', 0, 100000, true);
    const description = text(payload.description, '场景描述', 800, ['place', 'scene'].includes(payload.kind));
    let landmark = null;
    if (['update', 'scene', 'correction'].includes(payload.kind)) {
      const id = text(payload.landmarkId, '所属地点', 120, true);
      landmark = catalog.landmarks.find(item => item.id === id);
      if (!landmark) throw new Error('所属地点不存在，请重新选择。');
    }
    if (payload.kind === 'work') {
      const title = text(payload.title, '中文名', 120, true);
      text(payload.original, '韩文名', 120, true); year(payload.year); type(payload.type); uniqueWork(title);
    }
    if (payload.kind === 'place') {
      const workId = text(payload.workId, '所属作品', 120, true);
      if (workId === 'new') {
        if (!isObject(payload.newWork)) throw new Error('新作品资料缺失。');
        const title = text(payload.newWork.title, '作品中文名', 120);
        const original = text(payload.newWork.original, '作品韩文名', 120);
        if (!title && !original) throw new Error('新作品请填写中文名或韩文名。');
        uniqueWork(title || original); year(payload.newWork.year); type(payload.newWork.type);
      } else if (!catalog.works.some(work => work.id === workId)) throw new Error('所属作品不存在。');
      const name = text(payload.name, '地点名称', 120, true);
      number(payload.lat, '纬度', -90, 90); number(payload.lng, '经度', -180, 180);
      for (const [key, limit] of Object.entries({ group: 100, ko: 120, city: 100, address: 240, visit: 500 })) text(payload[key], key, limit);
      if (catalog.landmarks.some(item => item.workId === workId && item.name === name && Math.abs(item.lat - payload.lat) < .0001 && Math.abs(item.lng - payload.lng) < .0001)) throw new Error('同一作品的同名地点和近似坐标已存在。');
    }
    const hasChanges = isObject(payload.changes) && Object.keys(payload.changes).length > 0;
    if (['update', 'correction'].includes(payload.kind)) {
      if (payload.changes != null && !isObject(payload.changes)) throw new Error('更正内容无效。');
      if (payload.kind === 'correction') { text(payload.reason, '更正原因', 800, true); if (!hasChanges) throw new Error('请填写更正内容。'); }
      if (hasChanges) {
        const allowed = { name: 120, group: 100, ko: 120, city: 100, address: 240, visit: 500 };
        const changes = payload.changes;
        if (Object.keys(changes).some(key => !Object.hasOwn(allowed, key) && !['lat', 'lng'].includes(key))) throw new Error('包含不支持的更正字段。');
        const normalized = {};
        for (const [key, limit] of Object.entries(allowed)) if (Object.hasOwn(changes, key)) normalized[key] = text(changes[key], key, limit, key === 'name');
        if (Object.hasOwn(changes, 'lat') !== Object.hasOwn(changes, 'lng')) throw new Error('更正坐标请同时填写经纬度。');
        if (Object.hasOwn(changes, 'lat')) {
          number(changes.lat, '纬度', -90, 90); number(changes.lng, '经度', -180, 180);
          normalized.lat = changes.lat; normalized.lng = changes.lng;
        }
        if (!Object.keys(normalized).some(key => normalized[key] !== landmark[key])) throw new Error('更正内容与现有资料相同。');
      }
      if (payload.kind === 'update' && !description && !imageUrl && !hasChanges) throw new Error('请至少补充场景、图片或一项更正资料。');
    }
    return { imageUrl, posterUrl };
  }
  return { parseIssue, serializeIssue, extractImage, replaceImage, isGitHubImage, parseIssueNumber, validateSubmission };
});
