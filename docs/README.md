# 文档索引

| 文档 | 内容 |
| --- | --- |
| [MAINTAINER.md](MAINTAINER.md) | 投稿收录、审核发布、图片处理与本地校验的维护流程 |
| [works.md](works.md) | 手工添加作品、海报与场景的规范 |
| [data-format.md](data-format.md) | 数据交换与备份格式：v1 单文件、v2 按作品拆分 |
| [hosting.md](hosting.md) | 当前发布方式、生成目录与旧服务历史入口 |
| [verification-log.md](verification-log.md) | 按日期汇总的逐条核验记录（示意点、坐标层级与待核项） |

## 目录结构

| 位置 | 内容 |
| --- | --- |
| 根目录的 `*.html` | 地图、投稿、审核、维护、对比图入口，网址保持不变 |
| `js/` | 各页面脚本与共用逻辑；站点配置在 `js/site-config.js` |
| `css/` | 页面样式 |
| `data/` | 作品、地点、场景与地图数据 |
| `assets/` | 海报与截图 |
| `vendor/` | 本地地图依赖及许可证 |
| `tools/` | 构建、校验、数据导入与图片处理工具 |
| `tests/` | Node 测试与浏览器回归脚本 |
| `docs/` | 维护说明与核验记录 |
| `.github/` | 投稿入口与自动部署流程 |

`dist/`、`runtime/`、`node_modules/` 仍为本机生成目录，不上传 GitHub。

## 常用校验

```sh
node tools/check-catalog.cjs   # 引用、坐标、集数、图片路径
node tools/check-assets.cjs    # 资源体积与格式
npm test                       # 全部 Node 测试
node tools/build-site.cjs      # 生成 dist/
```

## 手工浏览器回归（可选）

`tests/` 下的 `test-*-browser.py` 不走 CI，用于改动地图、投稿、审核或对比界面后做人工回归。它们通过 Chrome DevTools Protocol 直接驱动浏览器，需要先本地起站（例如 `node tools/build-site.cjs` 后用静态服务器打开 `dist/`），再启动带远程调试端口的独立 Chrome，并安装 Python 的 `websocket-client`。参数统一为「站点地址 + CDP 端口」（默认 `http://127.0.0.1:8044/`、`9246`）。

| 脚本 | 用途 |
| --- | --- |
| [test-map-browser.py](../tests/test-map-browser.py) | 地图总览、作品切换、场景弹窗 |
| [test-browse-fixes.py](../tests/test-browse-fixes.py) | 作品浏览与搜索过滤的回归项 |
| [test-scenes-discovery-browser.py](../tests/test-scenes-discovery-browser.py) | 用内存中的临时场景验证列表与筛选，不写目录数据 |
| [test-submission-browser.py](../tests/test-submission-browser.py) | 投稿取点、图片草稿、维护草稿 |
| [test-submission-history-browser.py](../tests/test-submission-history-browser.py) | 用本地模拟的 Issue 验证投稿进度查询 |
| [test-review-drafts-browser.py](../tests/test-review-drafts-browser.py) | 审核页草稿持久化，只清理 `qa/review-drafts` 命名空间 |
| [test-compare-browser.py](../tests/test-compare-browser.py) | 实拍对比页的图片载入、滑动与导出 |

这些脚本只在测试浏览器内注入样例、模拟请求，不会创建或修改真实 Issue。
