# 取景地核验记录

按日期汇总每次批量收录时的逐条核验结果。原先散放在 `data/verification-YYYY-MM-DD.md`，现统一收录在本文件，`data/` 只保留站点实际加载的数据。

阅读约定：

- “已确认地点”只表示所列来源支持该地点出现在作品中，**不表示确认入口、拍摄机位或可进入性**。
- 坐标为 WGS84，按纬度、经度排列。未达到入口级的坐标一律标为**示意点**。
- 同一用途的来源可以互相印证，不同用途（取景关系／地址／地图点位）不能互相替代。

## 2026-11-06 · 首批 6 个地标

下述“地点已核实”仅表示地图标点对应同名景点或公共设施，**不表示确认入口、拍摄机位或可进入性**。韩国观光公社资料用于核对取景关系，韩国公共数据门户或 OpenStreetMap 同名要素用于核对地图点位；不同用途的来源不能互相替代。

| 地标 | 取景关系与场景依据 | 旧坐标反查 | 当前坐标及其含义 | 仍需确认 |
| --- | --- | --- | --- | --- |
| 绿莎坪人行天桥 | [韩国观光公社《梨泰院Class》](https://english.visitkorea.or.kr/svc/sp/HallyuNew/contentsView.do?dataSetId=70&vcontsId=200508) 的 **Noksapyeong Overpass** 段明确说世路与以瑞在桥上相遇、世路常在此沉思，可见南山塔。 | 37.5361, 126.9881 反查为绿莎坪大路40街19号附近建筑；原地址“绿莎坪大路195号”是地铁站附近地址，不是该文所列桥梁地址。 | 保留 37.5361, 126.9881 为**示意点**。观光公社给出“绿莎坪大路40街19号教育文化馆前人行天桥”，可定位到街区，但尚无桥身专属坐标。 | 桥身中心、桥两端入口、各镜头机位；集数与时间点。 |
| 南山白凡广场 | 同一篇观光公社文章的 **Baekbeom Plaza, Namsan Park** 段明确说世路与以瑞的吻戏在南山公园入口至白凡广场之间的道路拍摄。原笼统的“城墙旁心动步道”改为具体的路段描述。 | 37.5557, 126.9800 精度较低；反查时最近对象为餐馆，但相距几米有同名广场节点。 | 37.555730, 126.979970 是 [OpenStreetMap 白凡广场节点](https://www.openstreetmap.org/node/357821021)，代表**广场地点**，并非吻戏机位。 | 从南山公园入口通往广场的哪一段道路，以及镜头机位；集数与时间点。 |
| 梨泰院儿童公园 | 同一篇观光公社文章的 **Itaewon Children's Park** 段分别写明根秀向世路道歉，以及跟踪世路者被发现的场景。 | 37.5375, 126.9920 反查为会木路44多街，不是公园。原地址仅写绿莎坪大路46街，不能作为公园精确地址。 | 37.538407, 126.989041 来自[韩国公共数据门户全国城市公园信息](https://www.data.go.kr/data/15012890/standard.do)中管理编号 **11170-00006** 的“이태원어린이공원”记录；该记录的道路地址为“회나무로6길 11-8”。这是**公园公布坐标**，非入口或机位。 | 公园入口、两段剧情各自的拍摄机位；集数与时间点。观光公社文章的街道描述与公共数据门户地址不完全相同，出行时优先用韩文公园名核对。 |
| 清河公辰市场 | [韩国观光公社市场专页](https://english.visitkorea.or.kr/svc/contents/contentsView.do?menuSn=459&vcontsId=206318)明确称其为《海岸村恰恰恰》中“公辰市场”的拍摄地，市场内设取景地指示牌；同页给出清河路200番街6号。 | 36.1980, 129.3380 反查为清河小学。 | 36.1968521, 129.3399770 为 [OpenStreetMap 同名市场面要素](https://www.openstreetmap.org/way/1315316887)的代表点；反查也为“청하공진시장”，代表**市场范围**。 | 具体店铺与镜头机位、市场入口；集数与时间点。 |
| 沙防纪念公园 | [韩国观光公社《海岸村恰恰恰》专题](https://english.visitkorea.or.kr/public/asis/contents/hallyu/contents/Kdrama/enu/2021/subpage01.html)明确称山顶小船是洪班长秘密基地取景地；[观光公社巡礼路线](https://english.visitkorea.or.kr/svc/sp/HallyuNew/contentsView.do?dataSetId=70&vcontsId=200856)进一步明确慧珍与洪班长在**第 1 集**于山顶小船相遇，并给出海岸路1801号。 | 36.163731, 129.397824 反查为海岸路1804号餐饮建筑；原“吾岛里88-4”地址未由这两条来源支持。 | 36.1646222, 129.3946972 为 [OpenStreetMap 同名公园面要素](https://www.openstreetmap.org/way/1304567998)的代表点，代表**公园范围**，不代表山顶小船。 | 山顶小船的具体点位、公园入口、场景时间点。 |
| 注文津迎津海滩防沙堤 | [韩国观光公社景点页](https://english.visitkorea.or.kr/svc/contents/contentsView.do?menuSn=587&vcontsId=174269)确认《鬼怪》两位主角在海边初遇的取景关系；[韩国海警公告](https://www.kcg.go.kr/sokchocgs/na/ntt/selectNttInfo.do?nttSn=2054)更准确称地点为迎津海滩的**防沙堤／방사제**，并提示风浪安全。[Dispatch 当年报道](https://www.dispatch.co.kr/617939)明确海边初遇出现在**第 1 集**。 | 37.8690, 128.8420 反查仅为海岸附近地物，距离同名防沙堤较远。 | 37.8798741, 128.8341891 为 [OpenStreetMap“주문진 방사제 (도깨비 촬영지)”节点](https://www.openstreetmap.org/node/6087000044)，代表**防沙堤景点**。观光公社所列海岸路1609号是导航参照地址，不是堤上机位。 | 防沙堤具体拍摄位置、到达入口与场景时间点。 |

**集数处理：**仅沙防公园与迎津海滩防沙堤能找到可指向该场景的第 1 集依据。其余 4 条场景的集数保持 `null`；全部 6 条场景的 `timeSeconds`、`image` 保持 `null`。各地点的 `entrance` 也保持 `null`。

**核验方法与限制：**以韩国观光公社、韩国海警、韩国公共数据门户为取景、地址和公共设施依据；用 OpenStreetMap Nominatim 对旧坐标做反向地理编码，并检索同名要素。反向地理编码返回最近地物，不一定能证明点位位于某地物内；同名面要素的代表点也不等于入口。开放地图数据可变化，所以保留要素链接、原始坐标和本次核验日期供复查。未逐帧查看正版剧集，因此没有填写任何秒数或升级任何地点为“机位已核实”。

## 2026-11-07 · 新增 55 个地标

本次核对新增的 55 个地标与 58 张场景图。先检查了作品、坐标范围、引用关系和本地图片路径，再阅读可访问的来源。下表的“取景关系已确认”只表示所列资料支持该地点出现在作品中；除明确标为“景点位置”的两项外，坐标仍为示意点，不能当作入口或拍摄机位。

原投稿使用的六篇小红书笔记虽可返回网页，但未能读取笔记正文或逐条地址，因此**不能以链接能打开为由认定其内容已核实**。CartoonTour 原文可以读取，支持《那年我们》行宫派对、池洞壁画村和青麦田一带的地点信息。下表对仅有小红书线索的 35 项保留为待核验；另外 4 项有独立取景清单支持，但缺少官方逐点确认。

原有 28 条带集数的新场景没有可核查的逐集依据，正式 `episode` 字段已留空；投稿者提供的集数保存在场景描述中并标明“待核实”。全部新增场景的时间点继续留空。

| 作品 | 地标 ID | 地点 | 取景关系 | 坐标层级 | 可核查依据 |
| --- | --- | --- | --- | --- | --- |
| 那年，我们的夏天 | `obs-poster` | 海报拍摄地 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 韩剧《那年我们》同款取景地打卡](https://www.xiaohongshu.com/explore/69cf3099000000001b02229e) |
| 那年，我们的夏天 | `obs-choi-house` | 崔雄家 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 韩剧《那年我们》同款取景地打卡](https://www.xiaohongshu.com/explore/69cf3099000000001b02229e) |
| 那年，我们的夏天 | `obs-yeonsu-house` | 延秀家 · 池洞壁画村 | 已确认地点，机位待核 | 景点／建筑位置 | [韩国观光公社 · 《那年我们》取景地](https://english.visitkorea.or.kr/svc/contents/infoBscView.do?menuSn=508&vcontsId=177328) |
| 那年，我们的夏天 | `obs-haenggung-party` | 崔雄家／工作室 · 旧行宫派对 | 已确认地点，机位待核 | 景点／建筑位置 | [水原市 · 《那年我们》取景地路线](https://www.suwon.go.kr/sw-www/sw-visitsuwon/sw-visitsuwon-02/sw-visitsuwon-02-05/sw-visitsuwon-02-05-04.jsp) |
| 那年，我们的夏天 | `obs-cafe` | 川北废牧场新品咖啡馆 · 青麦仓库 | 已确认地点，机位待核 | 示意点 | [韩国影视委员会 · 青麦田旧牧场取景地](https://ifc.filmkorea.or.kr/location/location_view.jsp?id=11031&page=344) |
| 苦尽柑来遇见你 | `tang-cheongsim` | 清心国际海洋修炼院 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》1-7回取景地](https://www.xiaohongshu.com/explore/68501c22000000001101fb65) |
| 苦尽柑来遇见你 | `tang-gogchang-farm` | 高敞学院农场 | 已确认地点，机位待核 | 示意点 | [韩国观光公社 · 高敞学院农场取景地](https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=b7baa61d-9207-4c1a-9aac-0981f5f85553) |
| 苦尽柑来遇见你 | `tang-maechukji` | 梅楚池村 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》1-7回取景地](https://www.xiaohongshu.com/explore/68501c22000000001101fb65) |
| 苦尽柑来遇见你 | `tang-seongnam` | 城南二路 46 号 10-2 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》1-7回取景地](https://www.xiaohongshu.com/explore/68501c22000000001101fb65) |
| 苦尽柑来遇见你 | `tang-jangheung` | 张奂村海岸 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》1-7回取景地](https://www.xiaohongshu.com/explore/68501c22000000001101fb65) |
| 苦尽柑来遇见你 | `tang-unmunsa` | 云门寺 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》1-7回取景地](https://www.xiaohongshu.com/explore/68501c22000000001101fb65) |
| 苦尽柑来遇见你 | `tang-andong-homin` | 胡民里 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》1-7回取景地](https://www.xiaohongshu.com/explore/68501c22000000001101fb65) |
| 苦尽柑来遇见你 | `tang-jejumok` | 济州牧官衙遗址 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》1-7回取景地](https://www.xiaohongshu.com/explore/68501c22000000001101fb65) |
| 苦尽柑来遇见你 | `tang-jeonbuk-univ` | 全北大学医院 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》1-7回取景地](https://www.xiaohongshu.com/explore/68501c22000000001101fb65) |
| 苦尽柑来遇见你 | `tang-incheon-uhyeon` | 雨岘路 67 号 19 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》1-7回取景地](https://www.xiaohongshu.com/explore/68501c22000000001101fb65) |
| 苦尽柑来遇见你 | `tang-jeonnam-univ` | 全南大学（光州校区） | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》1-7回取景地](https://www.xiaohongshu.com/explore/68501c22000000001101fb65) |
| 苦尽柑来遇见你 | `tang-jeonju-paldal` | 八达路 140 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》1-7回取景地](https://www.xiaohongshu.com/explore/68501c22000000001101fb65) |
| 苦尽柑来遇见你 | `tang-deokwon` | 德院 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》1-7回取景地](https://www.xiaohongshu.com/explore/68501c22000000001101fb65) |
| 苦尽柑来遇见你 | `tang-jungang-high` | 首尔中央高等学校 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》1-7回取景地](https://www.xiaohongshu.com/explore/68501c22000000001101fb65) |
| 苦尽柑来遇见你 | `tang-sinseongru` | 仁川新盛楼 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》8-12回取景地](https://www.xiaohongshu.com/explore/6852852400000000150237db) |
| 苦尽柑来遇见你 | `tang-bugyo-bus` | 浮桥公交站 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》8-12回取景地](https://www.xiaohongshu.com/explore/6852852400000000150237db) |
| 苦尽柑来遇见你 | `tang-daegu-cathedral` | 大邱桂山圣堂 | 已确认地点，机位待核 | 示意点 | [大邱文化艺术振兴院 · 桂山圣堂取景地](https://www.dgfca.or.kr/article/REPORT_NEWS/detail/13643) |
| 苦尽柑来遇见你 | `tang-yongsan-jangmun` | 长文路 49 街 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》8-12回取景地](https://www.xiaohongshu.com/explore/6852852400000000150237db) |
| 苦尽柑来遇见你 | `tang-junggu-45` | 45 大楼 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》8-12回取景地](https://www.xiaohongshu.com/explore/6852852400000000150237db) |
| 苦尽柑来遇见你 | `tang-incheon-songhyeon` | 松岘公园路（背景+CG） | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》8-12回取景地](https://www.xiaohongshu.com/explore/6852852400000000150237db) |
| 苦尽柑来遇见你 | `tang-gangnam-pilgyeongjae` | 必敬齋 | 已确认地点，机位待核 | 示意点 | [江南区政府 · 必敬齋相见礼场景](https://www.gangnam.go.kr/gangnamlife/2026/html/vol368/sub01_05.html) |
| 苦尽柑来遇见你 | `tang-changseong` | 昌盛洞 6 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》8-12回取景地](https://www.xiaohongshu.com/explore/6852852400000000150237db) |
| 苦尽柑来遇见你 | `tang-guro-hyeondae` | 五柳路现代城住宅 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》8-12回取景地](https://www.xiaohongshu.com/explore/6852852400000000150237db) |
| 苦尽柑来遇见你 | `tang-yeouido-hanyang` | 汉阳公寓 E 栋附近 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》8-12回取景地](https://www.xiaohongshu.com/explore/6852852400000000150237db) |
| 苦尽柑来遇见你 | `tang-ora-buckwheat` | 梧罗洞荞麦田 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》8-12回取景地](https://www.xiaohongshu.com/explore/6852852400000000150237db) |
| 苦尽柑来遇见你 | `tang-jeonju-paldal-147` | 八达路 147-2 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 《苦尽柑来遇见你》8-12回取景地](https://www.xiaohongshu.com/explore/6852852400000000150237db) |
| 背着善宰跑 | `lr-house` | 善宰家外观 · 蓝色大门 | 已确认地点，机位待核 | 示意点 | [Korea JoongAng Daily · 善宰家蓝色大门](https://www.koreajoongangdaily.com/korea/weekend-getaway-cupids-trails-explore-these-four-filming-spots-from-hit-romantic-drama-lovely-runner/10434259) |
| 背着善宰跑 | `lr-wallpush` | 小率壁咚善宰 · 新风路 43 | 已确认地点，机位待核 | 示意点 | [韩国观光公社 · 《背着善宰跑》水原路线](https://english.visitkorea.or.kr/svc/whereToGo/hdrdslt/hdrdsltView.do?crsSn=564819) |
| 背着善宰跑 | `lr-flying-kick` | 大舅哥飞踢 · 正祖路 886 巷 21 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 水原《背着善宰跑》同款打卡](https://www.xiaohongshu.com/explore/69d4cd350000000023010be0) |
| 背着善宰跑 | `lr-hwahongmun` | 告白名场面 · 华虹门 | 已确认地点，机位待核 | 示意点 | [韩国观光公社 · 《背着善宰跑》水原路线](https://english.visitkorea.or.kr/svc/whereToGo/hdrdslt/hdrdsltView.do?crsSn=564819) |
| 背着善宰跑 | `lr-bus-stop` | 善宰追公交 · 延武洞公营停车场 | 已确认地点，机位待核 | 示意点 | [GQ Korea · 延武洞停车场公交追车场景](https://www.gqkorea.co.kr/2024/06/10/%EC%84%A0%EC%97%85%ED%8A%80-%EC%88%9C%EB%A1%80%EA%B8%B8%EC%9D%B4%EB%9D%BC%EB%8A%94-%EA%B2%8C-%EC%8B%A4%EC%A1%B4/) |
| 21世纪大君夫人 | `gp-janggeum` | 大长今主题公园 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 打卡《21世纪大君夫人》取景地](https://www.xiaohongshu.com/explore/6a0adacb0000000006023608) |
| 21世纪大君夫人 | `gp-baekje` | 百济文化园区 | 已确认地点，机位待核 | 示意点 | [忠清南道旅游局 · 百济文化园区取景作品](https://tour.chungnam.go.kr/prog/course/kor/sub01_03_02/view.do?courseNo=594) |
| 21世纪大君夫人 | `gp-mujinjeong` | 无尽亭 | 独立清单支持，机位待核 | 示意点 | [Kversal · 《21世纪大君夫人》取景地列表](https://kversal.com/ko/dramas/12233) |
| 21世纪大君夫人 | `gp-hwaseomun` | 水原华西门 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 打卡《21世纪大君夫人》取景地](https://www.xiaohongshu.com/explore/6a0adacb0000000006023608) |
| 21世纪大君夫人 | `gp-jongmyo` | 宗庙 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 打卡《21世纪大君夫人》取景地](https://www.xiaohongshu.com/explore/6a0adacb0000000006023608) |
| 21世纪大君夫人 | `gp-oreung` | 庆州五陵 | 独立清单支持，机位待核 | 示意点 | [Kversal · 《21世纪大君夫人》取景地列表](https://kversal.com/ko/dramas/12233) |
| 21世纪大君夫人 | `gp-gwanghallu` | 广寒楼苑 | 独立清单支持，机位待核 | 示意点 | [Kversal · 《21世纪大君夫人》取景地列表](https://kversal.com/ko/dramas/12233) |
| 21世纪大君夫人 | `gp-ordaon` | 杨平 Ordaon | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 打卡《21世纪大君夫人》取景地](https://www.xiaohongshu.com/explore/6a0adacb0000000006023608) |
| 21世纪大君夫人 | `gp-gwanghwamun` | 光化门广场 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 打卡《21世纪大君夫人》取景地](https://www.xiaohongshu.com/explore/6a0adacb0000000006023608) |
| 21世纪大君夫人 | `gp-awon` | 我园古宅 | 独立清单支持，机位待核 | 示意点 | [Kversal · 《21世纪大君夫人》取景地列表](https://kversal.com/ko/dramas/12233) |
| 21世纪大君夫人 | `gp-soyang` | 所阳古宅 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 打卡《21世纪大君夫人》取景地](https://www.xiaohongshu.com/explore/6a0adacb0000000006023608) |
| 21世纪大君夫人 | `gp-provincial` | 道厅大楼（庆尚北道厅） | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 打卡《21世纪大君夫人》取景地](https://www.xiaohongshu.com/explore/6a0adacb0000000006023608) |
| 孤单又灿烂的神－鬼怪 | `qbc-chateau` | 芳堤娜城堡酒店 | 已确认地点，机位待核 | 示意点 | [魁北克市旅游局 · 《鬼怪》取景地](https://www.quebec-cite.com/en/quebec-city/movies-shot-in-quebec-city?list=suggested) |
| 孤单又灿烂的神－鬼怪 | `qbc-noel` | 魁北克圣诞商店 | 已确认地点，机位待核 | 示意点 | [魁北克市旅游局 · 《鬼怪》取景地](https://www.quebec-cite.com/en/quebec-city/movies-shot-in-quebec-city?list=suggested) |
| 孤单又灿烂的神－鬼怪 | `qbc-bastion` | 鬼怪大草坪 · 王后堡垒公园 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 魁北克｜鬼怪之城（附打卡路线）](https://www.xiaohongshu.com/explore/6ac99985000000001303d322) |
| 孤单又灿烂的神－鬼怪 | `qbc-cassecou` | 断头台阶（告白楼梯） | 已确认地点，机位待核 | 示意点 | [魁北克市旅游局 · 《鬼怪》取景地](https://www.quebec-cite.com/en/quebec-city/movies-shot-in-quebec-city?list=suggested) |
| 孤单又灿烂的神－鬼怪 | `qbc-petit` | 小香普兰街 + 鬼怪红门 | 已确认地点，机位待核 | 示意点 | [魁北克市旅游局 · 《鬼怪》取景地](https://www.quebec-cite.com/en/quebec-city/movies-shot-in-quebec-city?list=suggested) |
| 孤单又灿烂的神－鬼怪 | `qbc-royale` | 皇家广场 | 仅投稿线索，待独立核验 | 示意点 | [小红书 · 魁北克｜鬼怪之城（附打卡路线）](https://www.xiaohongshu.com/explore/6ac99985000000001303d322) |
| 孤单又灿烂的神－鬼怪 | `qbc-tourny` | 图尔尼喷泉 | 已确认地点，机位待核 | 示意点 | [魁北克市旅游局 · 《鬼怪》取景地](https://www.quebec-cite.com/en/quebec-city/movies-shot-in-quebec-city?list=suggested) |

### 已发现并修正的问题

- `obs-studio` 与 `obs-haenggung-party` 指向同一处旧行宫派对（长安洞 109-1／华西门路 31 街 22），合并为一个地标。水原市确认其为崔雄家取景地；CartoonTour 提供建筑坐标。另一个“崔雄家外墙”条目的具体机位仍未证实。
- 蓝色大门是善宰家外观，小率家是街对面的 Mong Ted 咖啡馆。场景截图能看见门牌 35-1，但尚未据此确定现实门牌坐标。
- “善宰追公交”场景拍于延武洞公营停车场，现场没有真实公交站；已修正地标名称和到访提示。
- “高昌学院农场”更正为“高敞学院农场”；“发达路 147-2”更正为“八达路 147-2”。
- 韩国影视委员会确认青麦田旧牧场的取景关系和咖啡馆地址；现有坐标来自附近田地节点，不代表咖啡馆入口。

### 后续核验重点

优先补充可读取正文的独立取景来源，尤其是《21世纪大君夫人》仅由小红书提供的其余地点，以及魁北克王后堡垒公园和皇家广场的精确门牌或现场照片，并核对两处八达路地标目前共用的示意坐标。对第 1—12 集的投稿线索，找到剧集画面或可靠逐集资料后再恢复正式集数。

## 2026-11-16 · 《我的有罪之人》釜山

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

### 场景图

7 张剧照（p4、p6、p8、p10、p12、p14、p16）已压成 1280 px 宽的 webp，放在 `assets/scenes/love-in-disguise/`，单张 31–94 KB，均由 `data/scene-sources/love-in-disguise.json` 登记来源后由脚本写入。剧照是投稿者从 tvN 播出画面截的图，展示授权没有书面确认，处理方式与站内其他笔记来源的剧照一致；如权利人提出异议应下架。

补图或换图时：

```powershell
node tools/fetch-scene-images.cjs
node tools/check-catalog.cjs; node tools/check-assets.cjs; node tools/build-site.cjs
```

脚本只处理清单里 `image` 仍为空的场景（已有图片会跳过），压到 1280 px webp、单张不超过 400 KB。笔记链接过期时，先把原图另存为 `assets/scenes/love-in-disguise/<sceneId>.jpg`，再跑 `node tools/fetch-scene-images.cjs --skip-download`（转换完成后会删除原图）。

**不要对全仓库运行 `tools/optimize-assets.cjs`**：仓库里现有图片已经是 webp，它会把每张图再压一次、生成 `*-600w-600w.webp` 这类重复文件并改写全部引用（2026-11-16 实测会改动 200 多张）。

### 未加入的内容

- 笔记里的烤肉店是演员 4 月 13 日用餐的店（图片显示店方 Instagram 账号为 `haeundaebeef`，即海云台一带的烤肉店），不是剧中取景地，因此**没有**作为地标加入。若以后要收“演员用餐处”，应另立字段或另开一类，不要混进取景地。
- 集数、时间点全部留空。笔记没有标注集数，也没有可靠逐集资料。

### 已发现并修正的问题

- 笔记 p13 的地点卡原图把 파출소 写成「Jeonggwan FF」，直接照抄会得到一个不存在的地名；用笔记翻译图核对后按「정관파출소」记录。
- 살로토 범일점 的店名写“범일”，但工商登记与地图门牌都在凡川洞一侧（부산진구 자유평화로 11，범천동 누리엔 地下 1 层），地标地址按登记地址记录并在坐标说明里注明。
- 大边活鱼市场与观光公社的“大边市场”在同一片港区，价格与摊位状态会随潮汐和季节变化，坐标说明里已注明只代表片区。

### 后续核验重点

优先找逐集画面或可靠逐集资料，确认 6 个地点分别出现在哪一集；其次补店面／入口级坐标（尤其派出所与酒店），并核对大边活鱼市场里具体是哪个摊位。
