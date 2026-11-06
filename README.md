# 剧场之外 · 韩剧取景地地图

一个以地图为主的韩剧圣地巡礼网站。可搜索作品、查看取景地与场景资料，并从地图点位发起投稿。公开目录按「作品 → 地标 → 场景 → 来源」组织。新投稿经维护者审核后才加入地图。

## 本地预览

在 `D:\code\kdrama` 运行：

```powershell
python -m http.server 8000
```

访问 `http://localhost:8000`。街道底图由 OpenFreeMap 在线加载；连接失败时会切换为项目内的韩国行政区轮廓图。投稿页本地预览时须填写目标 GitHub 仓库的 `owner/repo`。

## 发布到 GitHub Pages

1. 源码仓库：[ZuriZHAO/kdrama](https://github.com/ZuriZHAO/kdrama)，默认分支为 `main`。站点地址：[剧场之外](https://zurizhao.github.io/kdrama/)。仓库需开启 **Issues** 和 **Actions**。
2. 在 **Settings → Pages** 把 **Build and deployment → Source** 设为 **GitHub Actions**。仓库的 Actions 设置须允许工作流用 `GITHUB_TOKEN` 写入仓库内容和 Issue。
3. 推送后 `.github/workflows/pages.yml` 会检查目录、构建并部署网站；拉取请求由 `.github/workflows/check.yml` 先做检查。项目 Pages 域名（`owner.github.io/repo`）会自动识别投稿仓库。若使用自定义域名，在 `site-config.js` 填写 `owner/repo`。
4. 首次发布会自动创建 Issue 标签 `publish-approved`。维护者先核对来源、点位和图片许可；需要修订时，可在 `review.html` 粘贴 Issue 正文、修改 JSON 并生成完整正文，再保存回原 Issue。也可直接编辑 Issue 中 `KDRAMA_SUBMISSION_V2` 标记之间的 JSON。确认后添加标签；工作流读取**加标签当时的 Issue 正文**、导入目录并重新部署。部署成功后会给 Issue 留言并关闭。若导入因 JSON 或字段错误失败，修好正文后移除并重新添加标签。

GitHub Pages 只托管静态文件，因此投稿者需要登录 GitHub 并最终提交 Issue。网页生成标题、摘要和可编辑的 JSON 资料；长内容会显示复制粘贴入口。站点本身不保存未审核投稿。工作流使用维护者加标签作为审核动作，不会自动采信任何新 Issue。旧版含 `KDRAMA_SUBMISSION_V1` 标记的投稿仍可导入。

## 数据与投稿

`data/catalog.js` 包含 `works`、`landmarks`、`scenes`、`sources`，以及可选的 `revisions` 更正记录。投稿入口支持新增作品、新增取景地、补充已有地点的场景和纠正地点资料；从地图单击位置可以预填坐标。新增或更正坐标后先标为「示意点」，不把投稿坐标当作确认机位。集数、时间点可留空。图片可填公开 HTTPS 链接，也可选择在 GitHub Issue 正文末尾直接附图；后一种方式会读取第一张 GitHub 托管图片。两种方式都要求投稿者声明展示许可和署名，维护者仍须人工核实。[GitHub 官方说明](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/attaching-files)指出公开仓库的附件可无需登录查看。

原有 3 部作品、6 个地标保留为演示目录；此前核验记录见 [核验记录](data/verification-2026-11-06.md)。后续内容由投稿获得。直接修改目录时，也应执行：

```powershell
node data/check-catalog.cjs
node tools/test-flow.cjs
node tools/build-site.cjs
```

构建结果写入 `dist/`，仓库不提交它。目录检查覆盖 ID、关联关系、坐标和部分字段格式；取景关系与图片许可仍由维护者判断。导入工具 `tools/import-issue.cjs` 可重复执行同一个 Issue，不会重复加入记录。

## 已实现与后续功能

已实现地图、搜索作品、作品地点列表、地点详情、作品和地点直达链接、刷新后恢复地图中心与缩放、浏览器本地收藏、行程排序、手动到访记录与定位签到、当前位置附近地点、地图点选投稿、地点纠错、GitHub Issue 投稿、维护者标签审核、静态目录导入和 Pages 自动部署。获得许可的场景图片可在详情放大并逐张浏览，也可在地图放大后切换为缩略图标点。当前演示目录没有获许可图片，因此缩略图按钮会禁用，直到后续投稿图片通过审核。收藏、站点顺序、到访日期和签到日期只保存在当前浏览器中；当前位置只用于浏览器内距离排序和签到，不会写入公开目录。签到要求浏览器位置权限和 HTTPS 或 localhost，定位误差超过 200 米时不记录；示意点范围约 700 米，已核实地点约 300 米。签到仅是个人行程记录，不证明拍摄机位准确。行程内展示的是点位间直线距离，NAVER App 公交链接按[官方 URL Scheme](https://guide.ncloud-docs.com/docs/en/maps-url-scheme) 打开；实际路线与时间请由导航应用确认。

与 Anitabi 的公开流程相比，仍缺少账号同步的签到记录和直接在站内完成的投稿审核后台。维护者可使用 `review.html` 辅助修订 Issue 正文；图片可由 GitHub 托管，但 GitHub 附件仍可能被删除或失效，需要维护者留意。GitHub Pages 不能直接接收匿名表单，因此目前从投稿页跳转到预填好的 GitHub Issue，由投稿者登录并确认提交。目标仓库创建并推送后，还需要在真实 Pages 域名上检查 Issue 创建、标签触发、目录更新与页面展示整条链路。

## 地图与第三方资源

街道底图使用 [OpenFreeMap](https://openfreemap.org/) 与 OpenStreetMap 数据，并在页面保留署名。韩国轮廓图来自 Natural Earth 与 [geoBoundaries](https://www.geoboundaries.org/api/current/gbOpen/KOR/ADM1/)。本地 `vendor/` 包含 Leaflet、MapLibre GL JS 和 MapLibre GL Leaflet 及对应许可文本。界面借鉴 [Anitabi 的公开文档](https://navi.anitabi.cn/docs/)中的作品、地标、场景和投稿组织方式，不使用其地点数据或截图。
