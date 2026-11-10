# 维护者说明

## 本地预览

在项目目录运行 `python -m http.server 8000`，打开 http://localhost:8000 。街道地图依赖 OpenFreeMap；网络不可用时使用本地韩国轮廓图。

## 公开站点与投稿审核

仓库默认分支为 `main`，现已公开。地图主入口为 https://zurizhao.github.io/kdrama/ ，由 GitHub Pages 工作流发布。旧 Sites 地图项目为 `kdrama-map-zuri`；投稿已改走 GitHub Issue，不再使用 Sites 投稿服务。

访客在地图内选点后通过三步表单填写。作品支持中文名、韩文名与别名搜索，文字草稿保存在当前浏览器。表单生成预填的投稿 Issue，访客登录 GitHub 附图并点击 Submit new issue，才完成提交。场景图片与作品海报保存在 Issue 正文各自的附件区块；浏览器选图只是预览，不会自动上传。

在[可视化审核页](https://zurizhao.github.io/kdrama/review.html)展开投稿队列，或输入本仓库 Issue 链接／编号，也可粘贴完整正文。可用表单修订地点、分组、场景和来源，在地图拖动标记修正坐标，并预览或替换图片。一次支持最多 12 张场景图，逐张设置集数、时间和裁剪位置；作品海报单独处理。新增替换图片先上传到原 Issue，再复制图片链接。署名可留空。生成修订正文时会保留未编辑字段和其余原文，并检查原 Issue 是否被他人修改。

审核顺序：**读取 → 修改预览 → 生成并复制完整正文 → 回原 Issue 保存 → 添加 `publish-approved` 标签**。先保存再批准；批准后的正文若变化，工作流会要求重新审核。公开审核页只是编辑工具，写入和批准受 GitHub 仓库权限控制，页面不要求填写访问令牌。高级 JSON 保留为折叠工具，修改后须先应用到表单。

状态标签：`needs-info` 由维护者标记需要补充；`publish-approved` 启动发布；`published` 由部署成功后的工作流添加；`publish-failed` 表示发布未完成。成功回执含地图直达链接与运行记录，随后关闭 Issue；失败时保持打开，修正后重新加批准标签。Issue 关闭或存在批准标签本身都不能证明上线，投稿页以随网站部署的 `data/publication-status.json` 为准。批准版本已发布后又修改正文，会提示后来修改尚未发布，后续应另建补充／更正投稿。

来源链接可以留空；新地点和更正坐标仍按示意点导入。图片需要投稿者确认展示许可，署名可选。自动导入与审核页共用 `submission-core.js` 校验规则。已导入的投稿记录原始正文 SHA256，只有相同正文可幂等重试；早期无哈希记录的投稿如需更改，请另建补充／更正 Issue。

旧 ChatGPT Sites 投稿服务源码在 `api-site/`；公开地图已不再读取该服务，新投稿也不再写入该服务。旧服务项目本身仍在线，保留供历史数据核对。

仓库公开后，推送到 `main` 会运行检查并尝试发布 GitHub Pages。地图发布与投稿审核是同一套 GitHub 流程。

旧地图 Sites 副本不随本仓库推送自动更新，其本地检出目录已清理，需要时可重新检出。GitHub Pages 在 `main` 推送后运行 `node tools/build-site.cjs` 自动发布。旧服务中已通过审核的注文津图片已迁入 `assets/scenes/` 和 `data/catalog.js`；另有一条内容仅为“。”的记录，待人工确认后再决定是否发布。

## 数据与检查

### 维护已发布内容

打开 [维护页](https://zurizhao.github.io/kdrama/manage.html)，搜索并选择作品。可修改中韩文名称、别名、类型、颜色、海报；维护地点名称、坐标、分组和排序；修改指定场景、替换图片或删除场景引用。地点支持批量分组，重复地点可合并到同作品的另一地点，场景会转移，旧地点链接会重定向。

每次编辑先点击“加入变更清单”。清单可逐项撤销，未加入清单的表单编辑不会发布。检查后生成维护投稿，在 GitHub 提交并加 `publish-approved` 标签。浏览器不保存 GitHub 凭据。发布前会比较原资料快照；资料已变化时整批拒绝，需刷新后重新核对。维护操作也走现有成功／失败回执，重复执行相同投稿不会重复修改。

删除场景仅删除目录引用；原始附件、仓库文件和 Git 历史不会被清除。维护记录保留变更前后内容，方便追溯和恢复。

### 图片发布

原图由投稿者上传到 GitHub Issue。工作流在导入后运行 `tools/prepare-media.cjs`，为本次 GitHub 场景图片生成 320 像素缩略图和不超过 1000 像素的中图，保存到 `assets/generated/` 并随目录提交。原图地址保留，前台小图加载失败会尝试原图。已有第三方外链继续保留，工作流不会下载任意外部主机。

图片下载、格式或生成失败会中止该次发布并保留失败回执，不会发布缺少新图片的半成品。按编号图片区块上传，一块仅一图；多图不能混放在海报区。恢复文字草稿后需重新选择原图，逐图说明与裁剪参数会恢复。

本地运行 `npm ci` 安装锁定的图片处理依赖，再执行 `npm test`。普通静态构建不需要在线下载图片。图片检查的 150 MB 总量限制属于项目的资源预算，不是平台服务额度。

目录由 `works`、`landmarks`、`scenes`、`sources` 和可选 `revisions`、`updates` 构成。新增或更正坐标先标为示意点；集数与时间点无法核实时留空。图片需展示许可，署名可选。演示数据的核验记录见 [核验记录](../data/verification-2026-11-06.md)。

修改后运行：

```powershell
node data/check-catalog.cjs
node tools/check-assets.cjs
node tools/test-flow.cjs
node tools/test-submission-core.cjs
node tools/test-publication-status.cjs
node tools/test-map-core.cjs
node tools/test-maintenance.cjs
node tools/test-multi-scenes.cjs
node tools/test-media.cjs
node tools/test-personal.cjs
node tools/build-site.cjs
```

`dist/` 是构建结果，不提交。依赖许可文本在 `vendor/`。地图使用 OpenFreeMap、OpenStreetMap、Natural Earth 和 geoBoundaries 数据；界面参考 Anitabi 的公开资料组织方式。

地图交互回归脚本为 `tools/test-map-browser.py` 和 `tools/test-scenes-discovery-browser.py`。需要 Python 的 `websocket-client`，以及开启远程调试端口的独立 Chrome；参数依次为站点地址和调试端口，例如 `python tools/test-scenes-discovery-browser.py http://127.0.0.1:8000/ 9248`。新脚本仅在测试浏览器中注入多集多图样例、模拟审核请求，不修改目录文件或创建真实投稿；覆盖场景切换、分享恢复、多作品视野筛选及重复请求。
