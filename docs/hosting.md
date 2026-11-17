# 托管与本地工作目录

主站 https://zurizhao.github.io/kdrama/ 由 GitHub Pages 发布。推送 `main` 后，工作流执行检查与 `node tools/build-site.cjs`，上传 `dist/`。

投稿使用 GitHub Issue，维护者通过审核页检查，添加 `publish-approved` 标签后由工作流导入并发布。

- `data/`、`assets/`、页面源码、`tools/` 和 `.github/` 是当前网站与发布流程需要的文件。
- `dist/`、`runtime/`、`node_modules/` 是本机生成目录，已被 Git 忽略，不会上传到仓库。依赖可用 `npm ci` 恢复，站点可用 `npm run build` 重新生成。
- 已停用的 `api-site/` 后端及其部署脚手架已从当前版本移除，图片工具统一使用根目录的 `sharp` 依赖。

## 旧服务历史

需要核对旧代码时，查看 [删除前的源码](https://github.com/ZuriZHAO/kdrama/tree/0fd579e5c7f0594cfa097d349c60a70220c6256e/api-site)。旧投稿服务项目 ID 为 `appgprj_6aedb4f5a0648191b584a706ba0bca8b`，旧静态地图项目 ID 为 `appgprj_6aedb14894908191bb144a278bd28004`。本次只清理仓库文件，没有操作云端项目或数据库。

旧服务已审核的注文津图片已迁入当前仓库；历史上另有一条仅含“。”的记录待人工确认。清理代码不会删除该记录。
