# 维护者说明

## 本地预览

在项目目录运行 `python -m http.server 8000`，打开 http://localhost:8000 。街道地图依赖 OpenFreeMap；网络不可用时使用本地韩国轮廓图。

## 发布与投稿审核

仓库默认分支为 `main`。在 Settings → Pages 将 Source 设为 GitHub Actions，并在 Settings → Actions 允许 `GITHUB_TOKEN` 读写仓库。推送 `main` 后，`.github/workflows/pages.yml` 构建并部署到 https://zurizhao.github.io/kdrama/ 。工作流会创建 `publish-approved` 标签。

投稿页生成 GitHub Issue。维护者须逐条核对取景来源、坐标、图片展示许可与署名；不要仅因链接可打开就认为拍摄关系成立。必要时用 `review.html` 粘贴 Issue 正文、修改 JSON，再把生成的完整正文保存回原 Issue。确认后添加 `publish-approved` 标签。工作流读取加标签时的正文，导入 `data/catalog.js`、部署并关闭 Issue。失败时修正文档，移除后重新添加标签。

GitHub Pages 只托管静态文件，当前投稿依赖公开仓库的 Issues。若仓库改为私有，普通访客将无法提交 Issue；GitHub Free 账号的私有仓库还会取消现有 Pages 发布。恢复公开投稿时须保持仓库公开，或另外设计公开投稿入口。

## 数据与检查

目录由 `works`、`landmarks`、`scenes`、`sources` 和可选 `revisions` 构成。新增或更正坐标先标为示意点；集数与时间点无法核实时留空。图片需展示许可与署名。演示数据的核验记录见 [核验记录](../data/verification-2026-11-06.md)。

修改后运行：

```powershell
node data/check-catalog.cjs
node tools/test-flow.cjs
node tools/build-site.cjs
```

`dist/` 是构建结果，不提交。依赖许可文本在 `vendor/`。地图使用 OpenFreeMap、OpenStreetMap、Natural Earth 和 geoBoundaries 数据；界面参考 Anitabi 的公开资料组织方式。