# 维护者说明

## 本地预览

在项目目录运行 `python -m http.server 8000`，打开 http://localhost:8000 。街道地图依赖 OpenFreeMap；网络不可用时使用本地韩国轮廓图。

## 公开站点与投稿审核

仓库默认分支为 `main`，现已公开。地图主入口为 https://zurizhao.github.io/kdrama/ ，由 GitHub Pages 工作流发布。旧 Sites 地图项目为 `kdrama-map-zuri`；投稿已改走 GitHub Issue，不再使用 Sites 投稿服务。

访客在地图内选点后通过三步表单填写，表单会生成预填的投稿 Issue，访客登录 GitHub 提交。投稿集中在仓库的 Issues；维护者核对取景来源、坐标、图片展示许可与署名，必要时用 `review.html` 修订 Issue 正文里的 JSON，确认后给 Issue 加上 `publish-approved` 标签，工作流会自动导入目录并发布地图。场景图片与作品海报以 GitHub 附件形式保存在 Issue 正文对应区块。来源链接可以留空，但缺少依据的点位不得标为已核实拍摄机位。不要仅因链接可打开就认为拍摄关系成立。

旧 ChatGPT Sites 投稿服务源码在 `api-site/`；公开地图已不再读取该服务，新投稿也不再写入该服务。旧服务项目本身仍在线，保留供历史数据核对。

仓库公开后，推送到 `main` 会运行检查并尝试发布 GitHub Pages。地图发布与投稿审核是同一套 GitHub 流程。

旧地图 Sites 副本不随本仓库推送自动更新，其本地检出目录已清理，需要时可重新检出。GitHub Pages 在 `main` 推送后运行 `node tools/build-site.cjs` 自动发布。旧服务中已通过审核的注文津图片已迁入 `assets/scenes/` 和 `data/catalog.js`；另有一条内容仅为“。”的记录，待人工确认后再决定是否发布。

## 数据与检查

目录由 `works`、`landmarks`、`scenes`、`sources` 和可选 `revisions` 构成。新增或更正坐标先标为示意点；集数与时间点无法核实时留空。图片需展示许可与署名。演示数据的核验记录见 [核验记录](../data/verification-2026-11-06.md)。

修改后运行：

```powershell
node data/check-catalog.cjs
node tools/test-flow.cjs
node tools/build-site.cjs
```

`dist/` 是构建结果，不提交。依赖许可文本在 `vendor/`。地图使用 OpenFreeMap、OpenStreetMap、Natural Earth 和 geoBoundaries 数据；界面参考 Anitabi 的公开资料组织方式。
