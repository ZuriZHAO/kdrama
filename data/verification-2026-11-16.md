# 2026-11-16 新增取景地核验记录（《我的有罪之人》釜山）

本次按投稿线索新增《我的有罪之人》（나의 유죄인간，tvN 2026）在釜山的 6 个地标、7 条场景记录和 7 张剧照（1280 px 宽 webp，共约 0.4 MB）。

线索笔记（[小红书 · 《我的有罪之人》釜山拍摄地与演员用餐的烤肉店](https://www.xiaohongshu.com/explore/6af1eefb000000002c033784)）的标题与正文可以读取，正文只写了 4 月 13 日演员在烤肉店用餐、留下签名，以及“这家店离其他拍摄地都比较远”。逐条地点在笔记图片里：p4／p6／p8／p10／p12／p14、p16 是剧照，p5／p7／p9／p11／p13／p17 是对应的地图地点卡截图。地点卡是手机地图的中文界面，显示罗马字店名与分类，没有门牌。本次用 OCR 读取这 6 张地点卡，再逐条按公开名录核对韩文名与门牌：

- p5「Salloto Beomil E」（男装）→ 살로토 범일점；
- p7「北京盘炸酱 Gijang店」→ 베이징쟁반짜장 기장점；
- p9「Domoheon」→ 도모헌；
- p11「Daebyeon农水产活鱼市场」→ 대변농수산활어시장；
- p13 原图 OCR 只得到「Jeonggwan FF」，改用笔记的图片翻译版本后确认为「Jeonggwan Police Station」，即 정관파출소（分类“地沟带”是机翻的地구대/지구대）；
- p17「Windeom Grand」→ 윈덤 그랜드 부산（p14、p16 两张剧照对应同一地址）。

因此 6 个地点的**取景关系**目前分别有三类依据，坐标**全部是路段或片区示意点**，不是店铺门口，也不是拍摄机位。

| 作品 | 地标 ID | 地点 | 取景关系 | 坐标层级 | 可核查依据 |
| --- | --- | --- | --- | --- | --- |
| 我的有罪之人 | `lid-domoheon` | 都慕轩（旧釜山市长官舍）· 南川洞 | 已确认地点，机位待核 | 路段示意点 | [小红书线索](https://www.xiaohongshu.com/explore/6af1eefb000000002c033784)、[KDramaPins 清单](https://kdramapins.com/dramas/love-in-disguise/)、[韩国观光公社 · 都慕轩](https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=4012a580-3306-4927-9780-8f7db3590558) |
| 我的有罪之人 | `lid-beijing-jjajang` | 北京大盘炸酱面 机张店 · 校里 | 已确认地点，机位待核 | 路段示意点 | [小红书线索](https://www.xiaohongshu.com/explore/6af1eefb000000002c033784)、[KDramaPins 清单](https://kdramapins.com/dramas/love-in-disguise/) |
| 我的有罪之人 | `lid-daebyeon-market` | 大边水产活鱼市场 · 大边港 | 已确认地点，机位待核 | 片区示意点 | [小红书线索](https://www.xiaohongshu.com/explore/6af1eefb000000002c033784)、[KDramaPins 清单](https://kdramapins.com/dramas/love-in-disguise/)、[韩国观光公社 · 大边市场](https://access.visitkorea.or.kr/ms/detail.do?cotId=b8674420-a04b-4d09-9f1c-f8a46e48ee6e) |
| 我的有罪之人 | `lid-salloto-beomil` | Salloto 定制西装 凡一店 · 凡川洞 | 仅投稿线索，待独立核验 | 路段示意点 | [小红书线索](https://www.xiaohongshu.com/explore/6af1eefb000000002c033784) |
| 我的有罪之人 | `lid-jeonggwan-police` | 正官派出所 · 芳谷里 | 仅投稿线索，待独立核验 | 路段示意点 | [小红书线索](https://www.xiaohongshu.com/explore/6af1eefb000000002c033784) |
| 我的有罪之人 | `lid-wyndham-busan` | 釜山温德姆至尊酒店 · 松岛 | 仅投稿线索，待独立核验 | 路段示意点 | [小红书线索](https://www.xiaohongshu.com/explore/6af1eefb000000002c033784) |

坐标取开放地图同名道路的路段节点（`osm-domoheon`、`osm-chaseong418`、`osm-jeonggwan-deoksan`、`osm-jayupyeonghwa`、`osm-deungdae`），大边市场取观光公社页面给出的代表点。门牌号与观光公社／名录一致，但**入口、店面与剧中机位都没有逐一定位**，不能当作导航终点。

## 场景图

7 张剧照（p4、p6、p8、p10、p12、p14、p16）已压成 1280 px 宽的 webp，放在 `assets/scenes/love-in-disguise/`，单张 31–94 KB，均由 `data/scene-sources/love-in-disguise.json` 登记来源后由脚本写入。剧照是投稿者从 tvN 播出画面截的图，展示授权没有书面确认，处理方式与站内其他笔记来源的剧照一致；如权利人提出异议应下架。

补图或换图时：

```powershell
node tools/fetch-scene-images.cjs
node data/check-catalog.cjs; node tools/check-assets.cjs; node tools/build-site.cjs
```

脚本只处理清单里 `image` 仍为空的场景（已有图片会跳过），压到 1280 px webp、单张不超过 400 KB。笔记链接过期时，先把原图另存为 `assets/scenes/love-in-disguise/<sceneId>.jpg`，再跑 `node tools/fetch-scene-images.cjs --skip-download`（转换完成后会删除原图）。

**不要对全仓库运行 `tools/optimize-assets.cjs`**：仓库里现有图片已经是 webp，它会把每张图再压一次、生成 `*-600w-600w.webp` 这类重复文件并改写全部引用（2026-11-16 实测会改动 200 多张）。

## 未加入的内容

- 笔记里的烤肉店是演员 4 月 13 日用餐的店（图片显示店方 Instagram 账号为 `haeundaebeef`，即海云台一带的烤肉店），不是剧中取景地，因此**没有**作为地标加入。若以后要收“演员用餐处”，应另立字段或另开一类，不要混进取景地。
- 集数、时间点全部留空。笔记没有标注集数，也没有可靠逐集资料。

## 已发现并修正的问题

- 笔记 p13 的地点卡原图把 파출소 写成「Jeonggwan FF」，直接照抄会得到一个不存在的地名；用笔记翻译图核对后按「정관파출소」记录。
- 살로토 범일점 的店名写“범일”，但工商登记与地图门牌都在凡川洞一侧（부산진구 자유평화로 11，범천동 누리엔 地下 1 层），地标地址按登记地址记录并在坐标说明里注明。
- 大边活鱼市场与观光公社的“大边市场”在同一片港区，价格与摊位状态会随潮汐和季节变化，坐标说明里已注明只代表片区。

## 后续核验重点

优先找逐集画面或可靠逐集资料，确认 6 个地点分别出现在哪一集；其次补店面／入口级坐标（尤其派出所与酒店），并核对大边活鱼市场里具体是哪个摊位。
