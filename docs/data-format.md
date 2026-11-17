# 数据交换与备份格式

编辑来源仍为 data/catalog.js，GitHub 投稿导入、场景 ID 与旧链接保持兼容。构建自动生成 dist/data/catalog.json，发布后可下载网站 data/catalog.json。不要手工维护第二份 JSON 来源。

格式包含 format（kdrama.catalog）、version（1）、sha256 和 catalog。保留作品、地点、场景、来源、更新记录及其他已有字段，数组顺序、空值、分组与图片地址均不变。校验和忽略对象属性顺序，但保留数组排序。SHA-256 用于发现意外修改和损坏，不认证文件来源。

图片以相对路径或 HTTPS 地址引用，不内嵌 base64。完整离线备份还需要 assets 文件夹；外部图片需另外确保可用。

```powershell
node tools/catalog-json.cjs export backup-2026-11-17.json
node tools/catalog-json.cjs check backup-2026-11-17.json
node tools/catalog-json.cjs convert backup-2026-11-17.json restored-catalog.js
```

输出文件必须不存在；工具不会覆盖任何现有文件。转换后先检查差异和图片引用，按项目测试验证，再由维护者替换目录发布。未知版本、ID 重复、引用断开、非法坐标/集时格式与校验和不匹配均会拒绝。

这一阶段增加稳定的备份交换格式，尚未改变前端加载方式。后续按作品拆分加载需要继续兼容投稿发布流程。


## 按作品拆分的 v2 存储格式

每次构建同时生成 `data/catalog-parts/manifest.json`、`shared.json` 和 `works/*.json`。每部作品文件包含作品信息及其地点、场景；来源与更新历史等共享字段仅保存一份。清单记录文件校验和、完整目录校验和、原始数组顺序，完整恢复时不会改变 ID、分组、场景关联、旧链接或未知扩展字段。

```powershell
node tools/catalog-json.cjs export-split backup-parts
node tools/catalog-json.cjs check-split backup-parts
node tools/catalog-json.cjs convert-split backup-parts restored-catalog.js
```

目标目录或文件必须不存在，避免覆盖。清单最后写入；缺文件、意外改动、路径越界、重复 ID 或跨作品关联均会拒绝恢复。作品文件名是作品 ID 的哈希，具体对应关系在文件中的 `work.id`；文件内容保留缩进，可单独查看和比较。转换生成的 JavaScript 也保留缩进，不再挤在一行。

v1 单文件备份仍然支持。`data/catalog.js` 仍是唯一编辑来源，分文件目录由构建生成，不要双份修改。这一步提供分作品存储和交换能力；前台按需加载尚未切换，地图和 GitHub 投稿导入继续使用原有入口。图片仍按地址引用，文件校验不能替代图片资源备份。
