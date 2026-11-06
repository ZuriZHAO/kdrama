// 作品 → 地标 → 场景。仅收录已找到来源的取景关系；未核实的字段保持 null。
window.KDRAMA_CATALOG = {
  works: [
    { id: 'itaewon', title: '梨泰院Class', original: '이태원 클라쓰', year: '2020', color: '#cc735a' },
    { id: 'hometown', title: '海岸村恰恰恰', original: '갯마을 차차차', year: '2021', color: '#5b8d91' },
    { id: 'goblin', title: '孤单又灿烂的神－鬼怪', original: '쓸쓸하고 찬란하神－도깨비', year: '2016', color: '#8d8197' },
    { id: 'crash-landing', title: '爱的迫降', original: '사랑의 불시착', year: '2019', color: '#6d8293', poster: null },
    { id: 'glory', title: '黑暗荣耀', original: '더 글로리', year: '2022', color: '#9a7480', poster: null },
    { id: 'extraordinary-attorney', title: '非常律师禹英禑', original: '이상한 변호사 우영우', year: '2022', color: '#69a0a0', poster: null },
    { id: 'queen-of-tears', title: '泪之女王', original: '눈물의 여왕', year: '2024', color: '#a9869a', poster: null },
    { id: 'lovely-runner', title: '背着善宰跑', original: '선재 업고 튀어', year: '2024', color: '#7796bc', poster: null }
  ],

  sources: [
    { id: 'visitkorea-itaewon', title: '韩国观光公社 · 《梨泰院Class》取景地', url: 'https://english.visitkorea.or.kr/svc/sp/HallyuNew/contentsView.do?dataSetId=70&menuNm=tour&page=8&vcontsId=200508' },
    { id: 'visitkorea-cheongha', title: '韩国观光公社 · 清河公辰市场', url: 'https://english.visitkorea.or.kr/svc/contents/contentsView.do?menuSn=459&vcontsId=206318' },
    { id: 'visitkorea-hometown', title: '韩国观光公社 · 《海岸村恰恰恰》取景地', url: 'https://english.visitkorea.or.kr/public/asis/contents/hallyu/contents/Kdrama/enu/2021/subpage01.html' },
    { id: 'visitkorea-goblin', title: '韩国观光公社 · 注文津防波堤', url: 'https://english.visitkorea.or.kr/svc/contents/contentsView.do?menuSn=587&vcontsId=174269' },
    { id: 'visitkorea-hometown-episode', title: '韩国观光公社 · 《海岸村恰恰恰》巡礼路线', url: 'https://english.visitkorea.or.kr/svc/sp/HallyuNew/contentsView.do?dataSetId=70&vcontsId=200856' },
    { id: 'public-korea-parks', title: '韩国公共数据门户 · 全国城市公园标准数据', url: 'https://www.data.go.kr/data/15012890/standard.do' },
    { id: 'osm-baekbeom', title: 'OpenStreetMap · 白凡广场', url: 'https://www.openstreetmap.org/node/357821021' },
    { id: 'osm-cheongha', title: 'OpenStreetMap · 清河公辰市场', url: 'https://www.openstreetmap.org/way/1315316887' },
    { id: 'osm-sabang', title: 'OpenStreetMap · 沙防纪念公园', url: 'https://www.openstreetmap.org/way/1304567998' },
    { id: 'osm-goblin-breakwater', title: 'OpenStreetMap · 注文津防沙堤（鬼怪取景地）', url: 'https://www.openstreetmap.org/node/6087000044' },
    { id: 'coastguard-goblin', title: '韩国海警 · 迎津海滩鬼怪拍摄地', url: 'https://www.kcg.go.kr/sokchocgs/na/ntt/selectNttInfo.do?nttSn=2054' },
    { id: 'dispatch-goblin-episode', title: 'Dispatch · 《鬼怪》第 1 集海边相遇', url: 'https://www.dispatch.co.kr/617939' }
  ],

  // coordinateStatus: approximate = 附近示意点；venue = 已核实景点点位；camera = 已核实拍摄机位。
  // verifiedAt 是资料核对日期；coordinateSourceId 与 coordinateNote 说明坐标依据，不等于入口或机位。
  landmarks: [
    {
      id: 'noksapyeong', workId: 'itaewon', name: '绿莎坪人行天桥', ko: '녹사평 육교', city: '首尔 · 龙山区',
      lat: 37.5361, lng: 126.9881, coordinateStatus: 'approximate', verifiedAt: '2026-11-06', entrance: null,
      coordinateSourceId: null, coordinateNote: '现有坐标反查为绿莎坪大路40街19号附近建筑；观光公社称天桥在该地址教育文化馆前，桥身坐标仍未独立确认。',
      address: '서울특별시 용산구 녹사평대로40길 19 앞 육교', query: '녹사평 육교', kind: 'seoul', sourceId: 'visitkorea-itaewon',
      visit: '公共人行天桥。拍照时请保持通行，不要在桥上架设妨碍行人的设备。'
    },
    {
      id: 'baekbeom', workId: 'itaewon', name: '南山白凡广场', group: '南山公园', ko: '남산 백범광장', city: '首尔 · 中区',
      lat: 37.55573, lng: 126.97997, coordinateStatus: 'venue', verifiedAt: '2026-11-06', entrance: null,
      coordinateSourceId: 'osm-baekbeom', coordinateNote: '开放地图同名“白凡广场”节点；观光公社指出吻戏在南山公园入口至广场之间的道路上，当前点位不是该道路的机位。',
      address: '서울특별시 중구 회현동1가 100-115', query: '남산 백범광장', kind: 'seoul', sourceId: 'visitkorea-itaewon',
      visit: '标记为白凡广场。吻戏位于通往广场的步道，具体拍摄位置仍需现场核对。'
    },
    {
      id: 'itaewonpark', workId: 'itaewon', name: '梨泰院儿童公园', ko: '이태원 어린이공원', city: '首尔 · 龙山区',
      lat: 37.538407, lng: 126.989041, coordinateStatus: 'venue', verifiedAt: '2026-11-06', entrance: null,
      coordinateSourceId: 'public-korea-parks', coordinateNote: '韩国公共数据门户公园记录 11170-00006 的坐标；代表公园位置，不代表入口或剧中机位。',
      address: '서울특별시 용산구 회나무로6길 11-8', query: '이태원 어린이공원', kind: 'seoul', sourceId: 'visitkorea-itaewon',
      visit: '标记为公园位置。请使用外部地图确认入口，并尊重儿童活动空间。'
    },
    {
      id: 'cheongha', workId: 'hometown', name: '清河公辰市场', ko: '청하공진시장', city: '浦项 · 北区',
      lat: 36.1968521, lng: 129.3399770, coordinateStatus: 'venue', verifiedAt: '2026-11-06', entrance: null,
      coordinateSourceId: 'osm-cheongha', coordinateNote: '开放地图同名市场面要素的代表点；原坐标反查为清河小学。市场范围内店铺分散，具体场景机位未核实。',
      address: '경상북도 포항시 북구 청하면 청하로200번길 6', query: '청하공진시장', kind: 'coast', sourceId: 'visitkorea-cheongha',
      visit: '这是仍在使用的市场。逢日期尾数为 1 或 6 的日子开集，店铺营业情况可能变化。标记为市场位置。'
    },
    {
      id: 'sabang', workId: 'hometown', name: '沙防纪念公园', ko: '사방기념공원', city: '浦项 · 北区',
      lat: 36.1646222, lng: 129.3946972, coordinateStatus: 'venue', verifiedAt: '2026-11-06', entrance: null,
      coordinateSourceId: 'osm-sabang', coordinateNote: '开放地图同名公园面要素的代表点；原坐标反查为海岸路1804号餐饮建筑。山顶小船及入口均未精确定位。',
      address: '경상북도 포항시 북구 흥해읍 해안로 1801', query: '사방기념공원', kind: 'coast', sourceId: 'visitkorea-hometown',
      visit: '公园内需步行上坡；地图标记为公园位置，非山顶小船的精确机位。出发前请查看天气与现场开放情况。'
    },
    {
      id: 'jumunjin', workId: 'goblin', name: '注文津迎津海滩防沙堤', ko: '주문진 방사제', city: '江陵 · 注文津',
      lat: 37.8798741, lng: 128.8341891, coordinateStatus: 'venue', verifiedAt: '2026-11-06', entrance: null,
      coordinateSourceId: 'osm-goblin-breakwater', coordinateNote: '开放地图同名“注文津防沙堤（鬼怪取景地）”节点；韩国海警明确称拍摄地为迎津海滩防沙堤。海岸路1609号是导航参照地址，不是堤上机位。',
      address: '강원특별자치도 강릉시 주문진읍 해안로 1609 인근', query: '주문진 방사제 도깨비 촬영지', kind: 'coast', sourceId: 'visitkorea-goblin',
      visit: '标记为迎津海滩的防沙堤位置，非堤上精确机位。风浪大时不要靠近海边。'
    }
  ],

  // 一处地标可以有多条场景记录；episode、timeSeconds、image 都需要独立核实。
  scenes: [
    { id: 'noksapyeong-01', landmarkId: 'noksapyeong', description: '世路与以瑞相遇、眺望南山塔的天桥。', episode: null, timeSeconds: null, image: null, sourceId: 'visitkorea-itaewon' },
    { id: 'baekbeom-01', landmarkId: 'baekbeom', description: '世路与以瑞的吻戏拍摄于南山公园入口通往白凡广场的道路。', episode: null, timeSeconds: null, image: null, sourceId: 'visitkorea-itaewon' },
    { id: 'itaewonpark-01', landmarkId: 'itaewonpark', description: '根秀向世路道歉；另一段跟踪世路的情节也在此拍摄。', episode: null, timeSeconds: null, image: null, sourceId: 'visitkorea-itaewon' },
    { id: 'cheongha-01', landmarkId: 'cheongha', description: '此市场作为剧中“公辰市场”的拍摄地；市场内设有剧集取景位置指示牌。', episode: null, timeSeconds: null, image: null, sourceId: 'visitkorea-cheongha' },
    { id: 'sabang-01', landmarkId: 'sabang', description: '第 1 集慧珍与洪班长在山顶小船相遇；小船也是剧中的洪班长秘密基地。', episode: 1, timeSeconds: null, image: null, sourceId: 'visitkorea-hometown', episodeSourceId: 'visitkorea-hometown-episode' },
    { id: 'jumunjin-01', landmarkId: 'jumunjin', description: '第 1 集金侁与恩倬在迎津海滩防沙堤初次相遇。', episode: 1, timeSeconds: null, image: null, sourceId: 'visitkorea-goblin', episodeSourceId: 'dispatch-goblin-episode' }
  ]
};
