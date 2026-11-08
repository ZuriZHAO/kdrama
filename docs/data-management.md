# 数据与图片管理方案

> 面向「剧情 + 剧照」持续增长，目标是把**文本数据**和**图片资产**分开：文本留在 GitHub，图片放到对象存储 + CDN，仓库里只保留图片 key 和版权清单。
>
> 结论先说：
>
> 1. **图片可以完全不上 GitHub。** 有域名时推荐 Cloudflare R2（S3 兼容，每月 10 GB-month 存储免费、出站流量免费）+ 自己的图片域名；没有域名时，可以先走 Issue 附件（图片不进仓库），或用 ImageKit 这类自带域名的免费图床过渡；`r2.dev` 只适合测试，不建议生产。
> 2. **删除前 74.1 MB 里，62 MB 是 154 张海报，10.1 MB 是场景图，2 MB 是 `assets/goblin/` 里没人引用的原图。** 孤儿原图已删除，图片也已批量压缩：当前 `assets/` 为 12.7 MB。要从根上解决持续增长，仍建议以后把图片移出仓库；现阶段先靠压缩和体积守卫控制。
> 3. **`assets/goblin/` 不是「鬼怪特殊对待」**，而是第一批图片的临时原图目录；真正被引用的是 `assets/scenes/goblin/`。已于 2026-11-08 删除，原图仍可从 Git 历史恢复。

---

## 1. 现状体检

### 1.1 数据规模

| 项目 | 数量 |
| --- | ---: |
| 作品 `works` | 154 |
| 地标 `landmarks` | 127 |
| 场景 `scenes` | 111（其中 93 条带图） |
| 来源 `sources` | 41 |
| 海报文件 | 154 张（现为 WebP） |
| 场景图片 | 93 张（现为 WebP） |
| `assets/goblin/` 原图 | 7 张，2.0 MB（已删除） |
| `assets/` 图片文件（不计 `.gitkeep`） | 247 个，12.7 MB（压缩后） |
| `.git` | 74.7 MB（仍含已删图片历史） |
| 压缩后工作区 | 约 12.7 MB |
| 提交后完整 clone | 约 100 MB（历史旧图约 74 MB） |

海报是绝对大头：压缩前平均 400 KB，最大一张 `my-royal-nemesis.jpg` 有 2.68 MB；压缩后平均约 44 KB，最大 144 KB。场景图压缩前平均 110 KB，压缩后平均约 65 KB。

### 1.2 结构问题

1. **单文件目录。** `data/catalog.js` 已经 145 KB，`works / landmarks / scenes / sources / updates` 全在一个数组里。每次投稿导入都用 `JSON.stringify` 整体重写，Review 时看到的是整文件 diff，冲突和误改风险高。
2. **图片路径和仓库绑定。** `poster` 和 `image` 只能写 `./assets/...` 或 HTTPS 外链；没有「存储 key」这一层，将来换图床要全量改数据。
3. **没有图片清单。** 图片的授权、署名、来源、尺寸、hash 只散落在 `imageCredit` 或根本没有记录；删除或替换图片时无法审计。
4. **目录语义不统一。** 见第 2 节，同一部作品可能分散在多个目录，不同作品又混在同一目录。
5. **投稿图片仍经过 GitHub。** 现在把图片拖进 Issue，GitHub 保存为 user-attachments 链接；图片不在仓库历史里，但仍依赖 GitHub，且没有压缩、没有衍生尺寸、URL 不可控。

### 1.3 GitHub 的硬约束

GitHub Pages 的官方限制是：

- 发布出来的站点不超过 **1 GB**；
- 源仓库建议不超过 **1 GB**；
- 带宽软限制 **100 GB/月**；
- 单文件超过 **100 MB** 会被拒绝，超过 50 MB 会警告；
- 每次部署超过 10 分钟会超时。

来源：[GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)。

现在 12.7 MB 离 1 GB 还很远，但按「每部剧 20 张剧照、每张 300 KB（单张展示图）」估算：

- 1,000 部剧 → 约 6 GB 图片，已经超过 Pages 上限；
- 5,000 个场景 → 约 1.5 GB 图片，也会超；
- 而且 Git 历史只增不减，删掉文件并不会让 clone 变小。

**结论：现在改结构成本最低；等到几百 MB 再改，迁移和重写历史的代价都会高很多。**

---

## 2. 关于 `assets/goblin/`

### 2.1 事实

删除前，`assets/goblin/` 里的 7 张图是 **1080×960 到 1080×1440 的原图**，合计 2.0 MB；`assets/scenes/goblin/` 里的同名图是 **900 px 宽的压缩版**，合计 0.5 MB，也就是页面真正引用的版本。

| 目录 | 文件数 | 尺寸 | 体积 | 是否被代码引用 |
| --- | ---: | --- | ---: | --- |
| `assets/goblin/`（已删除） | 7 | 1080×960–1440 | 2.0 MB | **否** |
| `assets/scenes/goblin/` | 7 | 900 px 宽 | 0.5 MB | 是，7 条场景 |

证据：

- 提交 `9a96915`（Add Goblin filming locations and seventeen posters）**同时**加入了 `assets/goblin/*` 和 `assets/scenes/goblin/*`。
- 在全部受版本控制的文件里执行 `git grep "assets/goblin"`，**没有任何匹配**；`data/catalog.js` 的 7 条鬼怪场景全部指向 `./assets/scenes/goblin/...`。
- 用脚本比对 254 个资源文件，未被引用的文件恰好是 `assets/goblin/` 里的 7 个。

### 2.2 为什么会出现

不是有意给鬼怪开小灶，而是**第一批图片的临时原图目录**：

1. 最早存图时，把网页用的原图放在 `assets/goblin/`，压缩后的展示图放在 `assets/scenes/goblin/`；
2. 两个目录在同一次提交里一起进了仓库；
3. 后来的约定变成「场景图统一放 `assets/scenes/<作品 id>/`」，但 `assets/goblin/` 忘了删；
4. 代码只引用压缩版，所以它一直没被发现。

### 2.3 顺带暴露的目录问题

| 目录 | 实际归属作品 | 问题 |
| --- | --- | --- |
| `assets/scenes/goblin/` | 鬼怪 | 正常 |
| `assets/scenes/goblin-quebec/` | 鬼怪 | 同一部作品拆成两个目录 |
| `assets/scenes/from-guides/` | 海岸村恰恰恰、黑暗荣耀 | 按「来源」分，不按作品分 |
| `assets/scenes/from-notes/` | 梨泰院Class、爱的迫降、举重妖精金福珠、眼泪女王、三流之路 | 5 部作品混在一个目录 |
| `assets/scenes/jumunjin-approved-*.jpg` | 鬼怪 | 直接躺在 `scenes/` 根目录 |

所以「鬼怪单独一个文件夹」有两个层面：`assets/goblin/` 是遗留垃圾；`assets/scenes/goblin/` 本身是按作品分目录的正确做法，只是 `goblin-quebec` 又把同一部作品拆开了。

### 2.4 怎么处理（已执行）

**2026-11-08 已删除，未提交。** 当前状态：

```powershell
# 已执行（删除前确认过没有任何引用）
git rm -r assets/goblin
```

删除后工作区少 2 MB；**但 `.git` 里仍然保留这 2 MB 历史**。如果在意 clone 体积，要等图片整体迁出后再做历史重写（见 7.5），不要现在单独做。

需要找回时，图片还在 `9a96915` 这个提交里：

```powershell
git checkout 9a96915 -- assets/goblin
```

**迁移到图床时顺手统一：** 不需要先手动搬目录。按 `workId` 重新生成 key 即可：

- `goblin`、`goblin-quebec`、`jumunjin-approved-*.jpg` → `works/goblin/...`
- `from-guides` 里两张 → `works/hometown/...`、`works/glory/...`
- `from-notes` 里 18 张 → 各自作品的 `works/<workId>/...`

---

## 3. Anitabi 是怎么做的

从公开资料能确认的是「**数据接口和图片服务是分开的**」，这对你最有参考价值。

### 3.1 两套域名

- 数据 API：`https://api.anitabi.cn/`
- 图片 API：`https://image.anitabi.cn/`

官方文档明确说不要请求主域拿资源地址，说明图片是被当作独立资源服务管理的，不跟页面/仓库绑在一起。来源：[Anitabi 开放 API](https://navi.anitabi.cn/docs/api/)。

### 3.2 数据分「轻量」和「详情」

- `GET /bangumi/{subjectID}/lite`：作品信息 + 前 10 个地标 + 总数，用于首屏；
- `GET /bangumi/{subjectID}/points/detail`：完整地标列表，带 `origin`、`originURL`。

每个地标（point）大致是：

```json
{
  "id": "qys7fu",
  "cn": "京都音乐厅",
  "name": "京都コンサートホール",
  "image": "https://image.anitabi.cn/points/115908/qys7fu.jpg?plan=h160",
  "ep": 1,
  "s": 1,
  "geo": [35.0503, 135.7664],
  "origin": "Google Maps",
  "originURL": "https://..."
}
```

也就是说，**一条记录里同时有地标、截图、集数、时间点、坐标、来源和署名**。

### 3.3 图片按需给尺寸

图片 URL 形如：

```
https://image.anitabi.cn/points/115908/qys7fu.jpg?plan=h160
https://image.anitabi.cn/points/115908/qys7fu.jpg?plan=h360
```

去掉 `?plan=` 才是原图，文档明确不建议在展示界面直接使用原图。后台上传时会把图片压到 **JPEG 90%**，前台再按 16:9 裁剪中间区域展示。来源：[Anitabi 地标编辑器教程](https://navi.anitabi.cn/docs/tutorial-editor/)。

### 3.4 有后台和审核，不是 Git PR

Anitabi 有管理员地标编辑器、作品状态、贡献来源、审核流程；数据在服务端，不靠提交 JSON 文件。

### 3.5 哪些能学，哪些不必照搬

**值得学：**

- 数据与图片分离，图片有独立域名；
- 图片有稳定的 key（`points/{作品}/{地标}`）和多种尺寸；
- 首屏只取轻量数据，点进作品再取详情；
- 每条图片都带来源和署名；
- 上传时统一压缩、裁剪。

**不必照搬：**

- 它把「地标」和「截图」合成一个 point；你现在 `landmark` / `scene` 分离，更适合「一个地点多机位、多剧照」，不要为了像它而合并。
- 它需要数据库、后台、登录和审核服务；你的站点是纯静态 GitHub Pages，现阶段用「Git 管文本 + 对象存储管图片」就能达到 80% 的效果。
- 它的后端具体用什么数据库/对象存储并未公开，不要假设是 R2 或某个具体产品。

---

## 4. 目标数据模型

### 4.1 四条原则

1. **文本进 Git，图片进对象存储。** 仓库里永远不出现 `*.jpg` / `*.webp`（品牌 logo 除外）。
2. **数据存 key，不存完整 URL。** 页面运行时用 `MEDIA_BASE + key` 拼地址；将来换域名/换供应商只改一个配置。
3. **key 不可变。** key 里带内容 hash；换图就换 key，天然绕过 CDN 缓存，不需要 purge。
4. **清单是事实来源。** 每张图在 `data/media/` 里有 hash、尺寸、授权、署名、来源；CI 校验「目录引用的 key 必须在清单里」。

### 4.2 建议目录

```text
data/
  sources.json              # 全局来源，保持现有结构
  updates.json              # 近期更新
  works/
    goblin.json             # 一部作品一个文件：work + episodes + landmarks + scenes + revisions
    itaewon.json
    ...
  media/
    goblin.json             # 该作品的图片清单（可选，也可全放 media.json）
  catalog.js                # 构建产物，保留给本地无构建预览；标记为 generated
tools/
  build-catalog.cjs         # 合并 works/*.json → data/catalog.js
  check-media.cjs           # 校验 key、hash、尺寸、授权字段
  media/
    ingest.cjs              # 压缩/切片/上传/写清单
    verify.cjs              # 本地或远端 HEAD 校验
    gc.cjs                  # 列出未被引用的对象（先 dry-run）
media-src/                  # 原图暂存，.gitignore 掉，不进仓库
assets/
  brand/                    # 只留 logo 等极小文件
```

作品数超过约 1,000 时，`works/` 可以按 id 首字母分桶（如 `works/g/goblin.json`），避免单目录文件过多；构建脚本递归读取即可。

一部作品的 JSON 大致长这样（字段名尽量沿用现有数据，减少迁移量）：

```json
{
  "schemaVersion": 2,
  "work": {
    "id": "goblin",
    "title": "孤单又灿烂的神－鬼怪",
    "original": "쓸쓸하고 찬란하神－도깨비",
    "year": "2016",
    "type": "drama",
    "color": "#8d8197",
    "aliases": [],
    "poster": {
      "media": "works/goblin/cover/3f9c2a1b",
      "width": 640,
      "height": 960,
      "credit": "tvN",
      "license": "official-poster"
    }
  },
  "episodes": [
    {
      "episode": 1,
      "title": "",
      "synopsis": "……剧情简介……",
      "stills": [
        {
          "media": "works/goblin/stills/ep01/8a1d7c3e",
          "width": 1280,
          "height": 720,
          "caption": "……",
          "credit": "tvN",
          "license": "official-still",
          "sourceId": "tvn-goblin"
        }
      ]
    }
  ],
  "landmarks": [
    { "id": "goblin-anguk-meet", "workId": "goblin", "name": "安国站 1 号口旁巷道", "lat": 37.576, "lng": 126.985 }
  ],
  "scenes": [
    {
      "id": "goblin-anguk-meet-01",
      "landmarkId": "goblin-anguk-meet",
      "description": "第一集：鬼怪与新娘在安国站旁的巷道雨中初遇。",
      "episode": 1,
      "timeSeconds": null,
      "image": {
        "media": "works/goblin/scenes/goblin-anguk-meet-01/7c2e9a1b",
        "width": 1600,
        "height": 900,
        "credit": "",
        "license": "screenshot"
      },
      "sourceId": null,
      "episodeSourceId": null
    }
  ],
  "revisions": []
}
```

要点：

- `image` 从字符串升级为对象；仍兼容旧的 `https://` 字符串和 `./assets/` 字符串，迁移可以分批做。
- `episodes` 是新增的，用来放「剧情简介 + 剧照」；没有剧集数据时可以是空数组，不影响现有页面。
- `license` 用短代码，至少覆盖：`official-poster`、`official-still`、`press`、`permission`、`cc-by`、`cc-by-sa`、`unknown`。
- `credit`、`sourceId`、`license` 三个字段是版权审计的最小集合；缺 `license` 的图片，`check-media` 应报错或至少警告。

### 4.3 图片清单

`data/media/goblin.json`：

```json
{
  "schemaVersion": 1,
  "items": {
    "works/goblin/scenes/goblin-anguk-meet-01/7c2e9a1b": {
      "sha256": "7c2e9a1b...",
      "width": 1600,
      "height": 900,
      "variants": { "640": 48213, "1280": 142331, "1600": 201442 },
      "credit": "",
      "license": "screenshot",
      "sourceId": null,
      "addedAt": "2026-11-08",
      "addedBy": "maintainer"
    }
  }
}
```

清单里只放元数据，不放二进制。它跟着 Git 走，所以「这张图是什么、谁加的、什么授权」永远可查，即使图片本体在 R2。

### 4.4 页面如何拼地址

`site-config.js` 增加一行：

```js
window.KDRAMA_MEDIA_BASE = 'https://img.example.com';
```

`script.js` 增加两个小函数：

```js
const MEDIA_WIDTHS = { cover: [320, 640], scene: [640, 1280], still: [640, 1280] };

function mediaUrl(image, width) {
  if (!image) return '';
  if (typeof image === 'string') return image; // 兼容外链 / 旧本地路径
  const base = String(window.KDRAMA_MEDIA_BASE || '').replace(/\/$/, '');
  return `${base}/${image.media}-${width}.webp`;
}

function mediaSrcset(image, kind) {
  if (!image || typeof image === 'string') return '';
  return MEDIA_WIDTHS[kind].map(w => `${mediaUrl(image, w)} ${w}w`).join(', ');
}
```

`<img>` 用 `src` + `srcset` + `sizes`，并带上 `width` / `height` 防止布局跳动：

```html
<img src="...-640.webp"
     srcset="...-640.webp 640w, ...-1280.webp 1280w"
     sizes="(max-width: 720px) 100vw, 360px"
     width="1280" height="720" loading="lazy" alt="">
```

### 4.5 ID 与版本

- 作品 id 继续用可读 slug（`goblin`），发布后不改；外部 id 可加 `externalIds: { bangumi: "..." }`，但不要用数字 id 替换 slug。
- 地标 id 保持 `{workId}-{slug}`，场景 id 保持 `{landmarkId}-{序号}`；这与现有数据兼容。
- 每个 JSON 加 `schemaVersion`；迁移脚本按版本升级，不靠人肉改。
- 生成物 `data/catalog.js` 加 `.gitattributes` 标记 `linguist-generated`，Review 时折叠，避免整文件 diff 干扰。

---

## 5. 图片托管方案对比

| 方案 | 图片是否在 GitHub | 容量/费用 | 优点 | 缺点 | 适用 |
| --- | --- | --- | --- | --- | --- |
| 现状：Issue 附件 + `assets/` | 部分是 | 免费 | 零改动 | 仓库膨胀、无衍生图、URL 绑定 GitHub、无法审计 | 现在 |
| Git LFS | 是 | 1 GB 免费，流量另计 | 保留 Git 工作流 | 仍占 GitHub 配额，克隆慢，不适合公开图片站 | 不推荐 |
| **Cloudflare R2 + 自定义域名** | **否** | **10 GB-month 免费，出站免费** | 便宜、S3 兼容、CDN 成熟、可自建衍生图 | 需要 Cloudflare 和域名；国内速度要实测 | **有域名时首选** |
| ImageKit 免费版 | 否 | 20 GB 带宽 + 3 GB 存储/月 | 自带 CDN 和域名、免运维、可做变换 | 3 GB 上限，免费版不能绑自定义域名，国内速度待测 | 无域名过渡 |
| Backblaze B2 | 否 | 10 GB 免费，约 $6/TB/月 | 便宜、S3 兼容 | 直连出站计费，配 CDN 麻烦 | 备选/备份 |
| Supabase Storage | 否 | 1 GB 免费，5 GB 出站 | 上手快，带数据库 | 额度小，增长后要迁 | 小规模试点 |
| Cloudinary 等 | 否 | 免费额度有限 | 自动裁剪/格式转换 | 用量一大就贵，锁定 | 图片变换需求强时 |
| 阿里云 OSS / 腾讯云 COS | 否 | 按量 | 国内速度好 | 自定义域名要备案；默认域名有限制 | 主要面向国内 |
| 自建 VPS / NAS | 否 | 服务器成本 | 完全可控 | 运维、备份、带宽都要自己扛 | 不推荐现阶段 |
| Wikimedia / Flickr 外链 | 否 | 免费 | 无存储成本 | 链接失效、热链限制、授权复杂 | 仅合规来源 |

**直接回答「有没有方案让图片不上 GitHub」：有，但先把目标说清楚。**

- 如果你只是**不想让仓库变大**：现在的 Issue 附件已经做到了——图片在投稿人拖进 Issue 时就由 GitHub 托管，不会进仓库历史。
- 如果你想**完全不经过 GitHub**：需要另一个图床。没有域名时，ImageKit 免费版最省事；长期还是建议买个域名，再上 R2 或云厂商对象存储。
- `r2.dev` 可以测试，但 Cloudflare 官方不建议用于生产（有限流），不能当作长期方案。

来源：[Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/)、[ImageKit pricing](https://imagekit.io/plans/)。

### 5.1 没有域名怎么办

**域名是什么：** 就是网址里的那串名字，比如 `example.com`；`img.example.com` 是它的子域名。域名按年租，不是服务器，也不是存储；它只负责把名字指向某个服务。你现在用的 `zurizhao.github.io` 是 GitHub 的域名，不是你的。

没有域名时，按优先级选：

| 做法 | 图片实际在哪 | 成本 | 适合 |
| --- | --- | --- | --- |
| 继续用 Issue 附件，不提交进仓库 | GitHub | 免费 | 现在；仓库不膨胀，但图片仍经过 GitHub |
| ImageKit 免费版 | `ik.imagekit.io/...` | 免费（20 GB 带宽 / 3 GB 存储/月） | 想完全不经过 GitHub、暂时不买域名；国内速度要测 |
| 云厂商默认域名（COS/OSS） | 厂商域名 | 按量 | 国内速度优先；默认域名有限制，只适合过渡 |
| 买域名 + R2/COS | `img.你的域名` | 域名约 ¥30–100/年 + 存储 | 长期最稳，可随时换供应商 |

**建议：**

1. 先做「Issue 附件不提交进仓库」——这已经能让仓库不再膨胀，零成本、零迁移。
2. 如果确实要「完全不经过 GitHub」，先用 ImageKit 免费版试一个月，重点测国内加载速度。
3. 如果打算长期做，买一个便宜域名（不需要很贵的后缀），把 DNS 放到 Cloudflare，再按第 6 节上 R2。域名是唯一能让图片地址「永远属于你」的东西。

---

## 6. 目标架构：Git 管文本，R2 管图片

```text
┌──────────────────────────────┐
│ GitHub 仓库（只有文本）       │
│ data/works/*.json            │
│ data/media/*.json            │
│ data/sources.json            │
└──────────────┬───────────────┘
               │ build
               ▼
┌──────────────────────────────┐        ┌─────────────────────────────┐
│ GitHub Pages                 │  img   │ Cloudflare R2 + CDN         │
│ HTML / JS / CSS / catalog.js │ ─────► │ works/goblin/scenes/...     │
└──────────────────────────────┘        │   -640.webp / -1280.webp    │
                                        └─────────────────────────────┘

投稿：GitHub Issue（文字 + 图片 key） → 审核 → import-issue 只改 JSON
上传：维护者 CLI（sharp 压缩/切片 → R2 → 写清单）
```

### 6.1 上传流程（维护者）

建议新增 `tools/media/ingest.cjs`，做五件事：

1. 读入原图，自动旋转、转 sRGB、**剥掉 EXIF**（避免泄露拍摄地点）；
2. 生成 master（最长边 1600）和 640/1280 两档 WebP；海报生成 320/640；
3. 计算 master 的 SHA-256，取前 8 位作为 key 后缀；
4. 上传 `base-640.webp`、`base-1280.webp`、`base-1600.webp` 到 R2，设置 `Cache-Control: public, max-age=31536000, immutable`；
5. 写入 `data/media/<workId>.json`，并在作品的 JSON 里填 `image.media`。

用法示例：

```powershell
node tools/media/ingest.cjs .\media-src\goblin\anguk.jpg `
  --work goblin --kind scene --scene goblin-anguk-meet-01 `
  --credit "" --license screenshot
```

批量迁移时，`ingest.cjs` 从现有 `catalog.js` 读 247 条本地引用，逐张处理，输出迁移报告：成功、跳过、缺文件、hash 重复。

### 6.2 投稿流程：谁上传？

先把「谁上传」说清楚：

| 做法 | 谁把文件写到存储 | 存储在哪 | 你做什么 |
| --- | --- | --- | --- |
| 现状：投稿人拖进 Issue | 投稿人 | GitHub | 审核、加 `publish-approved`、导入 URL |
| 你下载后 CLI 上传 | 你 | 你的 R2 | 下载附件、`ingest`、审核 |
| Worker 上传页 | 投稿人 | 你的 R2 | 审核、把 `pending/` 提升为正式 key |

**关键：** 现在你点「同意」时，图片已经在投稿人拖进 Issue 的那一刻由 GitHub 托管了；你只是审核并发布链接，并没有把图片搬到你自己的存储。所以现状算「**投稿人上传，GitHub 托管，你审核**」，不是「你上传」。

按目标选实现：

**A. 只想让仓库不膨胀（最省事，推荐现在就用）。**
保持 Issue 附件，但**永远不要把附件下载后 commit 进 `assets/`**；`import-issue.cjs` 只记录 GitHub 的 HTTPS URL。图片不进 Git 历史，仓库不会变大。缺点是仍依赖 GitHub。

**B. 想把图片放到 R2，但不想做上传页。**
投稿人把图拖进 Issue（或私下发你）→ 你下载 → `ingest` 到 R2 → 把 Issue 里的链接替换成 R2 key → 再导入目录。这是「投稿人提供，你上传」，每张图多一步；图片仍会短暂经过 GitHub 附件。

**B+. 折中：Action 自动搬。**
保持投稿人现在的习惯（拖图进 Issue），你在 Issue 上加 `publish-approved`；GitHub Action 下载附件 → `ingest` 到 R2 → 把 Issue 正文里的附件链接替换成 R2 key → 提交 JSON。你不需要手动上传，但 Action 需要 R2 密钥，图片也会短暂存在 GitHub 附件里。

**C. 想让投稿人自助上传到你的图床。**
`submit.html` 直接 `POST` 到 Cloudflare Worker；Worker 校验 Turnstile、大小、MIME，剥 EXIF，写入 `pending/{uuid}`，返回 key；投稿人把 key 填进 Issue。维护者审核后把对象从 `pending/` 提升到正式 key。需要约 100 行 Worker 代码和 Turnstile 配置，但能做到「图片完全不经过 GitHub」。

### 6.3 构建与 CI

```text
node tools/build-catalog.cjs   # works/*.json → data/catalog.js
node data/check-catalog.cjs    # 校验引用、坐标、集数
node tools/check-media.cjs     # 校验 key/清单/授权字段
node tools/build-site.cjs      # 只复制 HTML/JS/CSS/vendor/data，不再复制 assets
```

`check-media.cjs` 的规则建议：

- 所有 `image.media` / `poster.media` 必须出现在 `data/media/*.json`；
- 每条清单必须有 `sha256`、`width`、`height`、`license`；
- 禁止 `./assets/` 下的图片引用（迁移完成后）；
- 可选 `--remote`：并发 HEAD 请求 R2，检查对象是否真的存在（放 nightly，不要每次 PR 都跑）。

`build-site.cjs` 不再 `cpSync('assets')`，构建产物只剩几 MB，Pages 部署会快很多。

### 6.4 缓存与衍生图

- key 带 hash，内容不变 URL 不变，可以放心设一年缓存；
- 换图 = 新 hash = 新 URL，旧图由 `gc.cjs` 在确认无引用后删除；
- 不依赖 Cloudflare 的按需图片变换（那是另一个计费项），全部在 `ingest` 时预生成，成本可控；
- 首屏用 640，点开大图用 1280/1600；海报用 320/640；
- 可选生成 20 px 的 LQIP（base64 内联）放清单，减少白屏。

### 6.5 安全与滥用

如果做 C 档上传入口：

- Turnstile 人机验证 + 每 IP 每小时限额；
- 只接受 `image/jpeg|png|webp|avif`，服务端嗅探魔数，不信任 `Content-Type`；
- 单文件 ≤ 10 MB，像素上限（例如 8000×8000），防止解压炸弹；
- 剥 EXIF，重新编码，不保留原始文件；
- `pending/` 前缀设 30 天生命周期自动删除；
- 公开桶只放已审核图片；待审图片放私有桶或不可猜的 UUID 路径。

### 6.6 现有 `api-site/` 能复用什么

仓库里已经有一套旧的 Sites 投稿服务，里面有不少可直接参考的代码：

- `api-site/app/api/submissions/route.ts`：把图片写入 `env.BUCKET.put('pending/{uuid}')`，限制 5 MB，校验 JPG/PNG/WebP；
- `api-site/app/api/images/[id]/route.ts`：只服务 `approved` 记录的 R2 对象；
- `api-site/db/schema.ts`：`submissions` 表保存 `imageKey` / `posterKey`。

它的问题：依赖 ChatGPT Sites 的 D1/R2 绑定、登录和部署，公开地图已经不再读取它；为图片单独维护整套 Next.js 不划算。

建议：**复用它的 R2 put/get 和大小/MIME 校验思路，不复用整个应用**。先用本地 `ingest.cjs` 跑通；将来需要投稿人自助上传，再抽一个 100 行左右的 Worker。旧项目保留做历史数据核对，不要作为新图床的依赖。

---

## 7. 迁移路线

### 7.1 阶段总览

| 阶段 | 做什么 | 产出 | 工时 | 风险 |
| --- | --- | --- | ---: | --- |
| 0 | 清理孤儿目录 + 全量压缩 | 已完成：74.1 MB → 12.7 MB | 0.5 天 | 低 |
| 1 | 拆分 `catalog.js` 为 `works/*.json` | 小 diff、可 Review | 1 天 | 中 |
| 2 | 图片迁到 R2，改引用 | 仓库 < 5 MB，图片离开 GitHub | 1–2 天 | 中 |
| 3 | 上传入口（可选） | 投稿人自助上传 | 1–2 天 | 中 |
| 4 | 轻量/详情分离 + 剧情剧照 UI（可选） | 首屏更快、可扩展 | 2–3 天 | 中 |

### 7.2 阶段 0：清理与压缩（已完成）

2026-11-08 已执行：

1. 删除未引用的 `assets/goblin/`（7 张，2.0 MB）；
2. 237 张图片转 WebP：海报 600 px 宽（q80），场景图保持原宽、最长边 1280 px（q82）；10 张因为收益不足保留原格式；
3. 已更新 `catalog.js` 里的路径和扩展名；
4. 已新增 `tools/check-assets.cjs`：`assets/` 总量上限 20 MB、单文件上限 400 KB、禁止未被目录引用的图片；已接入两个 GitHub Actions 工作流。

实际压缩结果（下表是删除孤儿原图前的基线）：

| 类别 | 原来 | 压缩后 | 降幅 |
| --- | ---: | ---: | ---: |
| 海报 154 张 | 62.0 MB | 6.7 MB | 89% |
| 场景 93 张 | 10.1 MB | 6.0 MB | 41% |
| 孤儿原图 7 张 | 2.0 MB | 0（删除） | 100% |
| **合计** | **74.1 MB** | **12.7 MB** | **83%** |

如果海报只做 480 px（q78），还能再降到约 11 MB；当前 600 px 已足够卡片展示。

**验收已通过：** `node data/check-catalog.cjs`、`node tools/check-assets.cjs`、`node tools/build-site.cjs` 均通过；`assets/` 为 12.7 MB，低于 15 MB 目标。

**注意：** 阶段 0 只是把「变大」的速度降下来，并没有满足「图片完全不经过 GitHub」。它的价值是：即使后面暂时不搭图床，也能多撑很久；新增图片仍必须走 Issue 附件，不要 commit 进 `assets/`。

**关于仓库大小：** 这次提交会让工作区和 Pages 从约 74 MB 降到约 13 MB，但 `.git` 会新增约 12.7 MB 的压缩图，历史里的 74 MB 旧图仍在；所以完整 `git clone` 反而约 100 MB。要让 GitHub 仓库存储真正变小，需要做 7.5 的历史重写；不做的话，至少「以后不再变大」已经守住。

### 7.3 阶段 1：拆数据

1. 写 `tools/split-catalog.cjs`：按 `workId` 把 `works / landmarks / scenes / revisions` 分到 `data/works/<id>.json`，`sources` 和 `updates` 留全局；
2. 写 `tools/build-catalog.cjs`：合并回 `data/catalog.js`，字段顺序稳定，输出可重复；
3. 改 `check-catalog.cjs` / `import-issue.cjs` 读写新结构；投稿只改一个作品的 JSON，diff 从 145 KB 降到几 KB；
4. 生成物 `data/catalog.js` 继续提交，保证 `python -m http.server` 这种无构建预览还能用；`.gitattributes` 加 `data/catalog.js linguist-generated=true`；
5. 改 `.github/workflows/pages.yml`：发布前先跑 `node tools/build-catalog.cjs`，提交步骤改为 `git add data/works data/updates.json data/catalog.js`，不要只 `git add data/catalog.js`。

**验收：** 拆分前后用脚本比对 `works/landmarks/scenes/sources` 数量和 id 集合完全一致；页面功能不变；随机改一个场景，diff 只出现在一个文件。

### 7.4 阶段 2：图片上 R2

1. 注册/登录 Cloudflare，创建 bucket `kdrama-media`；
2. **有域名**才绑定 `img.你的域名`；没有域名先不要做这一步——先走 Issue 附件（阶段 A）或 ImageKit 过渡，或者先买域名。`r2.dev` 只测试，不建议公开上线；
3. 创建只限该 bucket 的 R2 API Token，写入本地 `.env`（`.gitignore`）；
4. 实现 `ingest.cjs`，先 `--dry-run` 跑 247 张，确认尺寸、体积、hash、授权字段；
5. 正式上传，生成 `data/media/*.json`，把 catalog 的 `poster` / `image` 改成 `{ media, width, height, credit, license }`；
6. 页面加 `mediaUrl` / `mediaSrcset`，`build-site.cjs` 停止复制 `assets/`；
7. 从 Git 删除 `assets/posters/`、`assets/scenes/`（原图已在 `media-src/` 和 R2）；
8. `check-media.cjs --remote` 全量校验一次。

**验收：** 154 张海报 + 93 张场景图全部从图片域名加载；`git grep "assets/"` 只剩品牌文件；仓库工作区 < 5 MB；断网时页面有占位色块而不是破图（加 `onerror` 兜底）。

**重要：** 这一步不会让 `.git` 变小，历史里仍有约 74 MB 旧图。要缩小 clone，见 7.5。

### 7.5 历史重写（可选，最后做）

如果确定不再需要旧图历史：

```powershell
# 先完整备份仓库
git clone --mirror . D:\backup\kdrama.git
# 使用 git filter-repo（需单独安装）删除大目录
git filter-repo --path assets/posters --path assets/scenes --path assets/goblin --invert-paths
git push --force --all
git push --force --tags
```

注意：

- 会改写所有提交 hash，协作者必须重新 clone；
- GitHub 上的旧对象不会立刻消失，需要联系支持或等待 GC；
- 本仓库目前基本是单人维护，风险可控；如果有外部 fork/PR，先公告。

### 7.6 最小落地版（如果只想先做一半）

如果暂时不想搭 R2：

1. 做阶段 0（压缩 + 删孤儿目录）——已完成，74 MB → 12.7 MB；
2. 新投稿的图片**不再提交进仓库**，统一走 Issue 附件或外链；
3. 给 `data/catalog.js` 加体积守卫，超过 250 KB 就提醒拆分。

这样能把「仓库爆掉」推迟很久，但图片仍依赖 GitHub，且没有版权清单。等你确定要长期做，再补阶段 2。

---

## 8. 容量与成本

### 8.1 按场景数估算

按每个场景 3 档（640/1280/1600，合计约 500 KB）估算：

| 场景数 | 图片对象 | 存储 | 月读取（10 万访问 × 30 图） | R2 费用 |
| ---: | ---: | ---: | ---: | --- |
| 1,000 | 3,000 | 约 0.5 GB | 300 万 | $0 |
| 5,000 | 15,000 | 约 2.5 GB | 300 万 | $0 |
| 10,000 | 30,000 | 约 5 GB | 300 万 | $0 |
| 20,000 | 60,000 | 约 10 GB | 300 万 | $0（刚好在存储免费线） |
| 50,000 | 150,000 | 约 25 GB | 300 万 | 存储超出 15 GB，约 $0.23/月 |

如果月访问到 100 万，按每次 30 张图计算约 3,000 万次读取，超出 1,000 万免费额度约 2,000 万次，理论上约 $7.2/月；但 Cloudflare CDN 命中后不会每次都打到 R2，实际通常远低于这个数。

实际会更低，因为：

- 浏览器和 Cloudflare 会缓存，重复访问不打到 R2；
- 首屏只加载 640 缩略图，大图点开才加载；
- 海报只有 154 张，占比很小。

### 8.2 费用构成

- R2 存储：超出 10 GB 后 **$0.015/GB-month**；
- Class B 读取：超出 1,000 万次后 **$0.36/百万次**；
- 出站流量：**免费**；
- 域名：约 **$10/年**（取决于后缀和注册商）；
- Cloudflare 免费版：$0。

也就是说，正常规模下每月成本是 **0 到几美元**，主要固定成本是域名。

### 8.3 国内访问

这是唯一需要实测的点：

- Cloudflare 的普通网络在中国大陆的访问质量不稳定，不同地区/运营商差异大；
- `r2.dev` 更容易被限速，正式使用应绑自定义域名；
- 如果主要读者在国内且对速度敏感，备选是腾讯云 COS / 阿里云 OSS（自定义域名需备案），或香港/新加坡的小 VPS + CDN；
- 数据里只存 key，`MEDIA_BASE` 可切换，所以**先选一个能接受的起步方案，不合适再换**，不需要改数据。

**没有域名时：** 先走 Issue 附件（只解决仓库膨胀），或 ImageKit 免费版（完全不经过 GitHub，但要测国内速度）；不建议把 `r2.dev` 当正式图床。

---

## 9. 治理与风险

| 风险 | 应对 |
| --- | --- |
| 版权/下架 | 每张图记录 `license`、`credit`、`sourceId`；提供下架入口；审核时确认展示许可 |
| 图片丢失 | R2 不是备份；每月 `rclone sync` 到本地/B2；`data/media` 清单跟 Git 走 |
| 供应商锁定 | 只用 S3 兼容 API；数据存 key 不存完整 URL；保留迁移脚本 |
| 域名过期 | 自动续费；监控到期；`MEDIA_BASE` 可快速切到备用域 |
| 缓存不更新 | key 带 hash，换图必换 URL；不要覆盖同名对象 |
| 历史体积 | 迁移后可选 `git filter-repo`；不做的话完整 clone 约 100 MB（历史里约 74 MB 旧图） |
| 上传滥用 | Turnstile、限流、大小/MIME/像素上限、`pending/` 生命周期 |
| 隐私 | 上传时剥 EXIF；不公开原始文件名 |
| 数据漂移 | CI 跑 `check-catalog` + `check-media`；每周 `--remote` 抽查 |
| 国内速度 | 上线前从目标网络实测；准备备用 `MEDIA_BASE` |

---

## 10. 现在的决策状态

**已确认：**

- 没有自己的域名；
- 读者主要在国内；
- 投稿走 GitHub Issue，你点同意；
- 鬼怪孤儿原图已删除。

**还需要你定：**

1. **先走哪条？**
   - A：保持 Issue 附件，但绝不 commit 进仓库——最省事，解决仓库膨胀，图片仍经过 GitHub；
   - B：买域名 + R2/COS——长期最稳，图片完全不经过 GitHub；
   - C：先用 ImageKit 免费版——完全不经过 GitHub，无域名，但 3 GB 上限且要测国内速度。
2. **如果买域名，预算和后缀？** 普通 `.com` / `.cn` / `.top` 价格差别很大；只做图床的话，便宜后缀就够。
3. **图片以谁上传为主？** 继续让投稿人拖 Issue（你审核），还是改成你代传到 R2，或做 Worker 自助上传？
4. **要不要重写 Git 历史？** 不重写也能用，只是历史里仍有约 74 MB 旧图，完整 clone 约 100 MB。

---

## 附录：参考命令

```powershell
# 依赖（建议放 devDependencies）
npm install --save-dev sharp @aws-sdk/client-s3

# .env（不要提交）
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=kdrama-media
MEDIA_BASE=https://img.example.com

# 单张入库（脚本待实现）
node tools/media/ingest.cjs .\media-src\goblin\anguk.jpg `
  --work goblin --kind scene --scene goblin-anguk-meet-01 `
  --credit "" --license screenshot

# 全量迁移演练
node tools/media/ingest.cjs --from-catalog --dry-run
node tools/media/ingest.cjs --from-catalog

# 校验
node data/check-catalog.cjs
node tools/check-assets.cjs
node tools/build-site.cjs

# 图片压缩（本地维护用；先演练）
node tools/optimize-assets.cjs --dry-run
node tools/optimize-assets.cjs

# 将来接图床后再用
node tools/check-media.cjs
node tools/check-media.cjs --remote
node tools/build-catalog.cjs
```

## 参考资料

- [Anitabi 开放 API](https://navi.anitabi.cn/docs/api/)
- [Anitabi 地标编辑器教程](https://navi.anitabi.cn/docs/tutorial-editor/)
- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- [ImageKit pricing](https://imagekit.io/plans/)
