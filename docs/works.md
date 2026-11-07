# 预置作品与海报

在 `data/catalog.js` 的 `works` 数组添加一项即可预置作品；无需同时添加地点。作品会出现在“热门作品”列表，地点数和截图数显示为 0。有人投稿并审核通过后，地点会自动关联作品。`type` 可填 `drama`（电视剧）、`movie`（电影）或 `variety`（综艺）；旧条目未填时默认电视剧。

```js
{ id: 'example-drama', title: '中文剧名', original: '한국어 제목', year: '2025', color: '#6d8293', poster: './assets/posters/example-drama.webp' }
```

`id` 必须唯一，发布后不要改动。`poster` 可以是 HTTPS 图片链接或项目内的 `./assets/` 路径；没有授权可用的海报时填 `null`，页面会显示剧名占位封面。项目内图片放进 `assets/posters/`，静态构建会一起复制。投稿新作品时也可上传海报；图片和海报都需确认展示许可，署名可选。不要直接引用其他站点的受限海报文件。

本机放海报的具体位置是 `D:\code\kdrama\assets\posters\`。例如存入 `queen-of-tears.webp` 后，把作品的 `poster` 改成 `./assets/posters/queen-of-tears.webp`；提交并推送仓库后，GitHub Pages 才会显示图片。文件名建议只用英文字母、数字和连字符。已预置作品的海报目前通过此方式加入；投稿表单的海报上传只用于投稿新增作品。

本地已有 27 张海报，对应 100 部预置作品中的 27 部；其余作品显示剧名占位封面。海报随仓库的静态网站发布。旧投稿服务中已审核的注文津图片已迁入 `assets/scenes/`。今后访客投稿的场景图片与作品海报改由 GitHub 托管：投稿时把图片拖进 Issue 正文的对应区块，GitHub 会保存为 user-attachments 链接；审核通过并发布后，地图直接引用该链接。访客投稿图片不会出现在本地 `assets/posters/` 文件夹。

《我的有罪之人》《请回答1988》《未知的首尔》《眼泪女王》的韩文名已按 [tvN 官方作品页](https://tvn.cjenm.com/ko/Love-in-Disguise/)、[请回答1988](https://tvn.cjenm.com/ko/reply1988/about/)、[未知的首尔](https://tvn.cjenm.com/ko/Our-Unwritten-Seoul/) 与[眼泪女王](https://tvn.cjenm.com/ko/queenoftears/) 核对。

地标的 `group` 字段可选。同一作品的多个机位填相同的分组名，例如 `南山塔`；不填则归入“未分组”。场景的 `episode` 字段用于“集数”页；不填则归入“未分组”。

## 2026-11-07 新增的待投稿作品

只预置作品，不预置未经核验的取景地。“那年夏天”“偶然遇见的一天”“半之半”已作为搜索别名，目录显示经发行方或播出方核对的名称。`Cheer Up` 指 SBS 2022 年的《치얼업》；《柔美的细胞小将》按三季分别建档，便于以后按集数收集地点。

| 目录名称 | 韩文原名 | 名称核对来源 |
| --- | --- | --- |
| 春夜 | 봄밤 | [MBC](https://www.imbc.com/broad/tv/drama/onespringnight/) |
| 那年，我们的夏天 | 그 해 우리는 | [SBS](https://programs.sbs.co.kr/drama/ourbelovedsummer/main) |
| 五月的青春 | 오월의 청춘 | [KBS](https://program.kbs.co.kr/2tv/drama/youthofmay/pc/index.html) |
| 偶然发现的一天 | 어쩌다 발견한 하루 | [MBC 中文作品页](https://content.mbc.co.kr/program/drama/3451760_64286.html) |
| 一半的一半 | 반의 반 | [tvN](https://tvn.cjenm.com/ko/yourmind/) |
| 听见你的声音 | 너의 목소리가 들려 | [SBS](https://programs.sbs.co.kr/drama/parkhyeryun/about/50355) |
| 当你沉睡时 | 당신이 잠든 사이에 | [SBS](https://programs.sbs.co.kr/drama/wyws/vods/50566?order=old) |
| 都市男女的爱情法则 | 도시남녀의 사랑법 | [Netflix](https://about.netflix.com/ko/news/netflix-brings-a-variety-of-entertainment-with-7-new-korean-films-and-series) |
| 柔美的细胞小将 第1季 | 유미의 세포들 | [TVING](https://www.tving.com/contents/E003605499) |
| 柔美的细胞小将 第2季 | 유미의 세포들 시즌2 | [TVING](https://www.tving.com/contents/E003745734) |
| 柔美的细胞小将 第3季 | 유미의 세포들 시즌3 | [TVING](https://www.tving.com/contents/E004527136) |
| 爱情怎么翻译？ | 이 사랑 통역 되나요? | [Netflix 中文作品页](https://www.netflix.com/sg-zh/title/81697769) |
| 举重妖精金福珠 | 역도요정 김복주 | [MBC 中文作品页](https://content.mbc.co.kr/program/drama/2915298_64286.html) |
| 大力女子都奉顺 | 힘쎈여자 도봉순 | [JTBC](https://mtv.jtbc.co.kr/plan/pr10010452) |
| Healer | 힐러 | [KBS](https://program.kbs.co.kr/2tv/drama/healer/pc/index.html) |
| 现在拨打的电话 | 지금 거신 전화는 | [MBC](https://content.mbc.co.kr/program/drama/3867863_64284.html) |
| Cheer Up | 치얼업 | [SBS](https://programs.sbs.co.kr/drama/cheerup/about/72138) |

新加入的 17 张本地海报已经对应到本节作品；《眼泪女王》尚无本地海报。网上找到的宣传海报使用前仍需确认展示许可。

## 2026-11-07 扩充作品目录

新增 72 个作品：59 部电视剧、6 部电影、7 档综艺；“浪漫的体制”重复出现一次，目录只收录一条。输入“格鲁纳酒店”可找到《德鲁纳酒店》，输入“浪漫的体制”可找到《浪漫的体质》；输入“在你灿烂的季节”可找到 MBC 使用的《在你灿烂的季节里》。电影和综艺在左侧作品卡片上分别显示类型标记。取景地仍需投稿或核验后才增加。

易混淆的新作品名称核对：[MBC《在你灿烂的季节里》](https://content.mbc.co.kr/program/drama/3900279_64286.html)、[MBC《21世纪大君夫人》](https://content.mbc.co.kr/program/drama/3900427_64286.html)、[Netflix《铁拳教育》](https://www.netflix.com/sg-zh/title/81947300)、[Netflix《我的王室死对头》](https://www.netflix.com/sg-zh/title/82682323)、[Netflix《Girigo：夺命许愿》](https://www.netflix.com/sg-zh/title/81975196)、[TVING《灵指》](https://www.tving.com/contents/P001776979)。

维基百科词条中的海报经常是该站按非自由使用规则上传的图片，不能凭词条上能看到就复制到本站。应先打开图片描述页，确认文件位于 Wikimedia Commons、许可允许再利用，并遵守署名等条件；未确认授权的作品保留占位封面。[Wikimedia Commons 站外复用指南](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia/en)
