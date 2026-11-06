# 维护者说明

## 本地预览

在项目目录运行 `python -m http.server 8000`，打开 http://localhost:8000 。街道地图依赖 OpenFreeMap；网络不可用时使用本地韩国轮廓图。

## 公开站点与投稿审核

仓库默认分支为 `main`，现已公开。地图主入口为 https://zurizhao.github.io/kdrama/ ，由 GitHub Pages 工作流发布。旧 Sites 地图项目为 `kdrama-map-zuri`；投稿 API 仍由 Sites 项目 `kdrama-submissions-zuri` 托管。

访客在地图内选点后通过三步表单直接提交。投稿存入投稿服务的 D1 数据库，图片存入 R2；只有审核通过的记录会由公开目录 API 返回。维护者登录 [审核页](https://kdrama-submissions-zuri.insightfullemon.chatgpt.site/admin) 后核对取景来源、坐标、图片展示许可与署名；可以在 JSON 中修订，再批准或驳回。不要仅因链接可打开就认为拍摄关系成立。批准前必须补充来源名称与 HTTPS 链接。

旧的 GitHub Issue 投稿代码和工作流仍在仓库中，供历史数据导入参考；公开网页已不使用它。投稿服务源码在 `api-site/`，与地图前端分别发布。

仓库公开后，推送到 `main` 会运行检查并尝试发布 GitHub Pages。页面发布与投稿 API 是两项独立服务；迁出地图不会自动迁出投稿 API。

旧地图 Sites 副本位于 `D:\code\kdrama-sites`，不随本仓库推送自动更新。GitHub Pages 则在 `main` 推送后运行 `node tools/build-site.cjs` 自动发布。修改投稿 API 后，在 `api-site/` 生成数据库迁移并发布对应 Sites 项目；迁移 API 前须处理现有 D1/R2 数据与审核身份。

## 数据与检查

目录由 `works`、`landmarks`、`scenes`、`sources` 和可选 `revisions` 构成。新增或更正坐标先标为示意点；集数与时间点无法核实时留空。图片需展示许可与署名。演示数据的核验记录见 [核验记录](../data/verification-2026-11-06.md)。

修改后运行：

```powershell
node data/check-catalog.cjs
node tools/test-flow.cjs
node tools/build-site.cjs
```

`dist/` 是构建结果，不提交。依赖许可文本在 `vendor/`。地图使用 OpenFreeMap、OpenStreetMap、Natural Earth 和 geoBoundaries 数据；界面参考 Anitabi 的公开资料组织方式。
