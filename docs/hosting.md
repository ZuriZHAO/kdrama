# 托管与本地工作目录

主站 `https://zurizhao.github.io/kdrama/` 由本仓库的 GitHub Pages 工作流发布。源文件在 `D:\code\kdrama`；`dist/` 是可重新生成的静态构建产物。

投稿服务 Sites 项目 ID：`appgprj_6aedb4f5a0648191b584a706ba0bca8b`。源码在 `api-site/`，由 Sites 提供 D1 数据库与 R2 图片存储。

备用静态地图 Sites 项目 ID：`appgprj_6aedb14894908191bb144a278bd28004`，网址 `https://kdrama-map-zuri.insightfullemon.chatgpt.site`。其本地发布工作目录可以在发布成功后删除；Sites 仍保留已推送的源码和线上版本。后续维护时可以用 Sites 源码助手重新检出，也可以由本仓库构建 `dist/` 后再同步。

工作区根目录的 `kdrama-*.tar.gz` 只是上传给 Sites 的临时打包文件。版本发布成功后即可删除，不影响线上服务。仓库内的 `runtime/` 是本地测试临时文件，`dist/` 可用 `node tools/build-site.cjs` 再生成。不要把 `assets/posters/`、`data/` 或 `api-site/` 当作临时文件删除。
