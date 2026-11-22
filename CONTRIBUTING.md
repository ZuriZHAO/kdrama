# 参与方式

## 投稿取景地

请从地图页投稿，不要直接新建空白 Issue：

1. 打开 <https://zurizhao.github.io/kdrama/>，点击地图位置选「在此提交取景地」，或点「投稿地点」。
2. 在页面里填作品、地点、场景、集数与图片，选中后会生成预填正文。
3. 点「前往 GitHub 完成投稿」，把图片放进对应区块后提交 Issue。

投稿正文由网站按固定结构生成，[`tools/import-issue.cjs`](tools/import-issue.cjs) 依赖这个结构解析。手写或改动标题、编号区块、图片区块的格式会导致自动导入失败。投稿先进待审核区，维护者添加 `publish-approved` 标签后才会发布。

## 报错与更正

已收录地点的坐标、集数或描述有误时，可以新建 Issue 说明作品名、地点名和需要改动的内容，维护者会在审核页处理。图片如涉及他人权利，请附上来源和展示许可说明。

## 代码与文档改动

```sh
npm ci          # 安装锁定的图片处理依赖
npm test        # 全部 Node 测试
npm run build   # 生成 dist/
```

改动前建议先读 [文档索引](docs/README.md)。提交前请确认：

- `npm test`、`node tools/check-catalog.cjs`、`node tools/check-assets.cjs` 全部通过。
- 数据只改 `data/catalog.js`，不要手工维护 `dist/` 里的 JSON 副本。
- 新增图片放在 `assets/` 下，转成 webp、单张不超过 400 KB，并同步改 `data/catalog.js` 的引用路径。
- 不要提交 `dist/`、`runtime/`、`node_modules/`，也不要提交 `tmp_*.py` 之类的本地一次性脚本。
- 文档里的相对链接保持可解析；改路径时同步更新 [docs/README.md](docs/README.md)。

## 许可

站点代码以 [MIT 许可](LICENSE) 发布。作品海报、剧照与截图等素材的版权属于原权利人，仅用于取景地展示与评论，不在 MIT 许可范围内。
