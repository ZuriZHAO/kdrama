# 文档索引

| 文档 | 内容 |
| --- | --- |
| [MAINTAINER.md](MAINTAINER.md) | 投稿收录、审核发布、图片处理与本地校验的维护流程 |
| [works.md](works.md) | 手工添加作品、海报与场景的规范 |
| [hosting.md](hosting.md) | 主站发布方式、`dist/` 与旧投稿服务的现状 |
| [verification-log.md](verification-log.md) | 按日期汇总的逐条核验记录（示范点、坐标层级与待核项） |
| [data-management.md](data-management.md) | 数据与图片的长期方案：现状体检、结构设想与迁移阶段，属规划记录，部分内容已执行 |

## 常用校验

```sh
node tools/check-catalog.cjs   # 引用、坐标、集数、图片路径
node tools/check-assets.cjs    # 资源体积与格式
npm test                       # 全部 Node 测试
node tools/build-site.cjs      # 生成 dist/
```

## 手工浏览器回归（可选）

`tools/` 下有三个不走 CI 的脚本，用于改动地图与投稿界面后做人工回归。它们通过 Chrome DevTools Protocol 直接驱动浏览器，需要先本地起站（例如 `node tools/build-site.cjs` 后把 `dist/` 用静态服务器打开），再启动带远程调试端口的 Chrome，并安装 Python 的 `websocket-client`。

| 脚本 | 用途 | 参数 |
| --- | --- | --- |
| [test-map-browser.py](../tools/test-map-browser.py) | 地图总览、作品切换、场景弹窗 | 站点地址、CDP 端口（默认 `http://127.0.0.1:8044/`、`9246`） |
| [test-submission-browser.py](../tools/test-submission-browser.py) | 投稿取点、图片草稿、维护草稿 | 同上 |
| [test-scenes-discovery-browser.py](../tools/test-scenes-discovery-browser.py) | 用内存中的临时场景验证列表与筛选，不写目录数据 | 同上 |
