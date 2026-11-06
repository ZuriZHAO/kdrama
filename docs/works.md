# 预置作品与海报

在 `data/catalog.js` 的 `works` 数组添加一项即可预置作品；无需同时添加地点。作品会出现在“热门作品”列表，地点数和截图数显示为 0。有人投稿并审核通过后，地点会自动关联作品。

```js
{ id: 'example-drama', title: '中文剧名', original: '한국어 제목', year: '2025', color: '#6d8293', poster: './assets/posters/example-drama.webp' }
```

`id` 必须唯一，发布后不要改动。`poster` 可以是 HTTPS 图片链接或项目内的 `./assets/` 路径；没有授权可用的海报时填 `null`，页面会显示剧名占位封面。项目内图片放进 `assets/posters/`，静态构建会一起复制。投稿新作品时也可上传海报；图片和海报都需确认展示许可，署名可选。不要直接引用其他站点的受限海报文件。

本机放海报的具体位置是 `D:\code\kdrama\assets\posters\`。例如存入 `queen-of-tears.webp` 后，把作品的 `poster` 改成 `./assets/posters/queen-of-tears.webp`；提交并推送仓库后，GitHub Pages 才会显示图片。文件名建议只用英文字母、数字和连字符。已预置作品的海报目前通过此方式加入；投稿表单的海报上传只用于投稿新增作品。

《我的有罪之人》《请回答1988》《未知的首尔》《眼泪女王》的韩文名已按 [tvN 官方作品页](https://tvn.cjenm.com/ko/Love-in-Disguise/)、[请回答1988](https://tvn.cjenm.com/ko/reply1988/about/)、[未知的首尔](https://tvn.cjenm.com/ko/Our-Unwritten-Seoul/) 与[眼泪女王](https://tvn.cjenm.com/ko/queenoftears/) 核对。

地标的 `group` 字段可选。同一作品的多个机位填相同的分组名，例如 `南山塔`；不填则归入“未分组”。场景的 `episode` 字段用于“集数”页；不填则归入“未分组”。
