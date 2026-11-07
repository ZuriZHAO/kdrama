// 作品 → 地标 → 场景。仅收录已找到来源的取景关系；未核实的字段保持 null。
window.KDRAMA_CATALOG = {
  works: [
    { id: 'itaewon', title: '梨泰院Class', original: '이태원 클라쓰', year: '2020', color: '#cc735a', poster: './assets/posters/itaewon.jpg' },
    { id: 'hometown', title: '海岸村恰恰恰', original: '갯마을 차차차', year: '2021', color: '#5b8d91', poster: './assets/posters/hometown.jpg' },
    { id: 'goblin', title: '孤单又灿烂的神－鬼怪', original: '쓸쓸하고 찬란하神－도깨비', year: '2016', color: '#8d8197', poster: './assets/posters/goblin.jpg' },
    { id: 'crash-landing', title: '爱的迫降', original: '사랑의 불시착', year: '2019', color: '#6d8293', poster: './assets/posters/crash-landing.jpg' },
    { id: 'glory', title: '黑暗荣耀', original: '더 글로리', year: '2022', color: '#9a7480', poster: './assets/posters/glory.jpg' },
    { id: 'extraordinary-attorney', title: '非常律师禹英禑', original: '이상한 변호사 우영우', year: '2022', color: '#69a0a0', poster: './assets/posters/extraordinary-attorney.jpg' },
    { id: 'queen-of-tears', title: '眼泪女王', original: '눈물의 여왕', year: '2024', color: '#a9869a', poster: './assets/posters/queen-of-tears.jpg' },
    { id: 'lovely-runner', title: '背着善宰跑', original: '선재 업고 튀어', year: '2024', color: '#7796bc', poster: './assets/posters/lovely-runner.jpg' },
    { id: 'love-in-disguise', title: '我的有罪之人', original: '나의 유죄인간', year: '2026', color: '#a97079', poster: './assets/posters/love-in-disguise.jpg' },
    { id: 'reply-1988', title: '请回答1988', original: '응답하라 1988', year: '2015', color: '#bf8966', poster: './assets/posters/reply-1988.jpg' },
    { id: 'our-unwritten-seoul', title: '未知的首尔', original: '미지의 서울', year: '2025', color: '#708ca1', poster: './assets/posters/our-unwritten-seoul.jpg' },
    { id: 'one-spring-night', title: '春夜', original: '봄밤', year: '2019', color: '#789e8e', poster: './assets/posters/one-spring-night.jpg' },
    { id: 'our-beloved-summer', title: '那年，我们的夏天', original: '그 해 우리는', year: '2021', color: '#c28c67', poster: './assets/posters/our-beloved-summer.jpg', aliases: ['那年夏天'] },
    { id: 'youth-of-may', title: '五月的青春', original: '오월의 청춘', year: '2021', color: '#b89277', poster: './assets/posters/youth-of-may.jpg' },
    { id: 'extraordinary-you', title: '偶然发现的一天', original: '어쩌다 발견한 하루', year: '2019', color: '#c27e9a', poster: './assets/posters/extraordinary-you.jpg', aliases: ['偶然遇见的一天'] },
    { id: 'a-piece-of-your-mind', title: '一半的一半', original: '반의 반', year: '2020', color: '#7f8baa', poster: './assets/posters/a-piece-of-your-mind.jpg', aliases: ['半之半'] },
    { id: 'i-hear-your-voice', title: '听见你的声音', original: '너의 목소리가 들려', year: '2013', color: '#7890ae', poster: './assets/posters/i-hear-your-voice.jpg' },
    { id: 'while-you-were-sleeping', title: '当你沉睡时', original: '당신이 잠든 사이에', year: '2017', color: '#a785b2', poster: './assets/posters/while-you-were-sleeping.jpg' },
    { id: 'lovestruck-in-the-city', title: '都市男女的爱情法则', original: '도시남녀의 사랑법', year: '2020', color: '#d28c7c', poster: './assets/posters/lovestruck-in-the-city.jpg' },
    { id: 'yumi-cells-1', title: '柔美的细胞小将 第1季', original: '유미의 세포들', year: '2021', color: '#d99baf', poster: './assets/posters/yumi-cells-1.jpg', aliases: ['柔美的细胞小将1'] },
    { id: 'yumi-cells-2', title: '柔美的细胞小将 第2季', original: '유미의 세포들 시즌2', year: '2022', color: '#b784a5', poster: './assets/posters/yumi-cells-2.jpg', aliases: ['柔美的细胞小将2'] },
    { id: 'yumi-cells-3', title: '柔美的细胞小将 第3季', original: '유미의 세포들 시즌3', year: '2026', color: '#9a78ac', poster: './assets/posters/yumi-cells-3.jpg', aliases: ['柔美的细胞小将3'] },
    { id: 'can-this-love-be-translated', title: '爱情怎么翻译？', original: '이 사랑 통역 되나요?', year: '2026', color: '#bd8276', poster: './assets/posters/can-this-love-be-translated.jpg' },
    { id: 'weightlifting-fairy', title: '举重妖精金福珠', original: '역도요정 김복주', year: '2016', color: '#7eb3b7', poster: './assets/posters/weightlifting-fairy.jpg' },
    { id: 'strong-woman-do-bong-soon', title: '大力女子都奉顺', original: '힘쎈여자 도봉순', year: '2017', color: '#bb83aa', poster: './assets/posters/strong-woman-do-bong-soon.jpg' },
    { id: 'healer', title: 'Healer', original: '힐러', year: '2014', color: '#667c96', poster: './assets/posters/healer.jpg' },
    { id: 'when-the-phone-rings', title: '现在拨打的电话', original: '지금 거신 전화는', year: '2024', color: '#8d798e', poster: './assets/posters/when-the-phone-rings.jpg' },
    { id: 'cheer-up-2022', title: 'Cheer Up', original: '치얼업', year: '2022', color: '#d4a86c', poster: './assets/posters/cheer-up-2022.jpg' },
    { id: 'in-your-radiant-season', title: '在你灿烂的季节里', original: '찬란한 너의 계절에', year: '2026', color: '#8c9db4', type: 'drama', poster: './assets/posters/in-your-radiant-season.jpg', aliases: ['在你灿烂的季节'] },
    { id: 'when-life-gives-you-tangerines', title: '苦尽柑来遇见你', original: '폭싹 속았수다', year: '2025', color: '#b5879b', type: 'drama', poster: './assets/posters/when-life-gives-you-tangerines.jpg' },
    { id: 'perfect-crown', title: '21世纪大君夫人', original: '21세기 대군부인', year: '2026', color: '#8fa887', type: 'drama', poster: './assets/posters/perfect-crown.png' },
    { id: 'my-id-gangnam-beauty', title: '我的ID是江南美人', original: '내 아이디는 강남미인', year: '2018', color: '#c39775', type: 'drama', poster: './assets/posters/my-id-gangnam-beauty.jpg' },
    { id: 'penthouse', title: '顶楼', original: '펜트하우스', year: '2020', color: '#7e9d9b', type: 'drama', poster: './assets/posters/penthouse.jpg' },
    { id: 'snowdrop', title: '雪滴花', original: '설강화', year: '2021', color: '#a68fbc', type: 'drama', poster: './assets/posters/snowdrop.jpg' },
    { id: 'dr-romantic', title: '浪漫医生金师傅', original: '낭만닥터 김사부', year: '2016', color: '#c08a85', type: 'drama', poster: './assets/posters/dr-romantic.jpg' },
    { id: 'dear-x', title: '亲爱的X', original: '친애하는 X', year: '2025', color: '#84a6b1', type: 'drama', poster: './assets/posters/dear-x.jpg' },
    { id: 'my-demon', title: '与恶魔有约', original: '마이 데몬', year: '2023', color: '#aa9b75', type: 'drama', poster: './assets/posters/my-demon.jpg' },
    { id: 'run-on', title: 'Run On', original: '런 온', year: '2020', color: '#8a99bf', type: 'drama', poster: './assets/posters/run-on.jpg', aliases: ['奔向爱情'] },
    { id: 'true-beauty', title: '女神降临', original: '여신강림', year: '2020', color: '#b59a8d', type: 'drama', poster: './assets/posters/true-beauty.jpg' },
    { id: 'anna', title: '安娜', original: '안나', year: '2022', color: '#86a993', type: 'drama', poster: './assets/posters/anna.jpg' },
    { id: 'melo-movie', title: '我们的浪漫电影', original: '멜로무비', year: '2025', color: '#8c9db4', type: 'drama', poster: './assets/posters/melo-movie.jpg' },
    { id: 'twinkling-watermelon', title: '闪亮的西瓜', original: '반짝이는 워터멜론', year: '2023', color: '#b5879b', type: 'drama', poster: './assets/posters/twinkling-watermelon.jpg' },
    { id: 'spirit-fingers', title: '灵指', original: '스피릿 핑거스', year: '2025', color: '#8fa887', type: 'drama', poster: './assets/posters/spirit-fingers.jpg' },
    { id: 'shooting-stars', title: '流星', original: '별똥별', year: '2022', color: '#c39775', type: 'drama', poster: './assets/posters/shooting-stars.jpg' },
    { id: 'hotel-del-luna', title: '德鲁纳酒店', original: '호텔 델루나', year: '2019', color: '#7e9d9b', type: 'drama', poster: './assets/posters/hotel-del-luna.jpg', aliases: ['格鲁纳酒店'] },
    { id: 'bitch-x-rich', title: '清潭国际高中', original: '청담국제고등학교', year: '2023', color: '#a68fbc', type: 'drama', poster: './assets/posters/bitch-x-rich.jpg' },
    { id: 'castaway-diva', title: '无人岛的Diva', original: '무인도의 디바', year: '2023', color: '#c08a85', type: 'drama', poster: './assets/posters/castaway-diva.jpg', aliases: ['无人岛的diva'] },
    { id: 'heirs', title: '继承者们', original: '상속자들', year: '2013', color: '#84a6b1', type: 'drama', poster: './assets/posters/heirs.jpg' },
    { id: 'legend-blue-sea', title: '蓝色大海的传说', original: '푸른 바다의 전설', year: '2016', color: '#aa9b75', type: 'drama', poster: './assets/posters/legend-blue-sea.jpg' },
    { id: 'my-love-from-star', title: '来自星星的你', original: '별에서 온 그대', year: '2013', color: '#8a99bf', type: 'drama', poster: './assets/posters/my-love-from-star.jpg' },
    { id: 'light-shop', title: '照明商店', original: '조명가게', year: '2024', color: '#b59a8d', type: 'drama', poster: './assets/posters/light-shop.jpg' },
    { id: 'business-proposal', title: '社内相亲', original: '사내 맞선', year: '2022', color: '#86a993', type: 'drama', poster: './assets/posters/business-proposal.jpg' },
    { id: 'mr-queen', title: '哲仁皇后', original: '철인왕후', year: '2020', color: '#8c9db4', type: 'drama', poster: './assets/posters/mr-queen.jpg' },
    { id: 'sweet-revenge', title: '复仇笔记', original: '복수노트', year: '2017', color: '#b5879b', type: 'drama', poster: './assets/posters/sweet-revenge.jpg' },
    { id: 'beauty-inside', title: '内在美', original: '뷰티 인사이드', year: '2018', color: '#8fa887', type: 'drama', poster: './assets/posters/beauty-inside.jpg' },
    { id: 'w-two-worlds', title: 'W两个世界', original: 'W', year: '2016', color: '#c39775', type: 'drama', poster: './assets/posters/w-two-worlds.jpg' },
    { id: 'school-2015', title: '学校2015', original: '후아유 - 학교 2015', year: '2015', color: '#7e9d9b', type: 'drama', poster: './assets/posters/school-2015.jpg' },
    { id: 'descendants-of-sun', title: '太阳的后裔', original: '태양의 후예', year: '2016', color: '#a68fbc', type: 'drama', poster: './assets/posters/descendants-of-sun.jpg' },
    { id: 'pinocchio', title: '匹诺曹', original: '피노키오', year: '2014', color: '#c08a85', type: 'drama', poster: './assets/posters/pinocchio.jpg' },
    { id: 'doom-at-your-service', title: '某一天灭亡来到我家门前', original: '어느 날 우리 집 현관으로 멸망이 들어왔다', year: '2021', color: '#84a6b1', type: 'drama', poster: './assets/posters/doom-at-your-service.jpg' },
    { id: 'secret-garden', title: '秘密花园', original: '시크릿 가든', year: '2010', color: '#aa9b75', type: 'drama', poster: './assets/posters/secret-garden.jpg' },
    { id: 'scarlet-heart-ryeo', title: '步步惊心：丽', original: '달의 연인 - 보보경심 려', year: '2016', color: '#8a99bf', type: 'drama', poster: './assets/posters/scarlet-heart-ryeo.jpg', aliases: ['步步惊心丽'] },
    { id: 'twenty-five-twenty-one', title: '二十五，二十一', original: '스물다섯 스물하나', year: '2022', color: '#b59a8d', type: 'drama', poster: './assets/posters/twenty-five-twenty-one.jpg', aliases: ['二十五二十一'] },
    { id: 'whats-wrong-secretary-kim', title: '金秘书为何那样', original: '김비서가 왜 그럴까', year: '2018', color: '#86a993', type: 'drama', poster: './assets/posters/whats-wrong-secretary-kim.jpg' },
    { id: 'be-melodramatic', title: '浪漫的体质', original: '멜로가 체질', year: '2019', color: '#8c9db4', type: 'drama', poster: './assets/posters/be-melodramatic.jpg', aliases: ['浪漫的体制'] },
    { id: 'teach-you-a-lesson', title: '铁拳教育', original: '참교육', year: '2026', color: '#b5879b', type: 'drama', poster: './assets/posters/teach-you-a-lesson.jpg' },
    { id: 'wonderfools', title: '超能路人甲', original: '원더풀스', year: '2026', color: '#8fa887', type: 'drama', poster: './assets/posters/wonderfools.jpg' },
    { id: 'my-royal-nemesis', title: '我的王室死对头', original: '멋진 신세계', year: '2026', color: '#c39775', type: 'drama', poster: './assets/posters/my-royal-nemesis.jpg' },
    { id: 'its-okay-thats-love', title: '没关系，是爱情啊', original: '괜찮아, 사랑이야', year: '2014', color: '#7e9d9b', type: 'drama', poster: './assets/posters/its-okay-thats-love.jpg', aliases: ['没关系是爱情啊'] },
    { id: 'its-okay-not-to-be-okay', title: '虽然是精神病但没关系', original: '사이코지만 괜찮아', year: '2020', color: '#a68fbc', type: 'drama', poster: './assets/posters/its-okay-not-to-be-okay.jpg' },
    { id: 'oh-my-ghost', title: 'Oh我的鬼神大人', original: '오 나의 귀신님', year: '2015', color: '#c08a85', type: 'drama', poster: './assets/posters/oh-my-ghost.jpg', aliases: ['oh我的鬼神大人'] },
    { id: '20th-century-girl', title: '20世纪的少女', original: '20세기 소녀', year: '2022', color: '#84a6b1', type: 'movie', poster: './assets/posters/20th-century-girl.webp' },
    { id: '18-again', title: '再次十八岁', original: '18 어게인', year: '2020', color: '#aa9b75', type: 'drama', poster: './assets/posters/18-again.jpg', aliases: ['重返18岁'] },
    { id: 'my-mister', title: '我的大叔', original: '나의 아저씨', year: '2018', color: '#8a99bf', type: 'drama', poster: './assets/posters/my-mister.jpg' },
    { id: 'fight-for-my-way', title: '三流之路', original: '쌈, 마이웨이', year: '2017', color: '#b59a8d', type: 'drama', poster: './assets/posters/fight-for-my-way.jpg' },
    { id: 'law-and-the-city', title: '瑞草洞', original: '서초동', year: '2025', color: '#86a993', type: 'drama', poster: './assets/posters/law-and-the-city.jpg' },
    { id: 'we-are-all-trying-here', title: '努力克服自卑的我们', original: '모두가 자신의 무가치함과 싸우고 있다', year: '2026', color: '#8c9db4', type: 'drama', poster: './assets/posters/we-are-all-trying-here.jpg' },
    { id: 'flower-of-evil', title: '恶之花', original: '악의 꽃', year: '2020', color: '#b5879b', type: 'drama', poster: './assets/posters/flower-of-evil.jpg' },
    { id: 'girigo', title: 'Girigo：夺命许愿', original: '기리고', year: '2026', color: '#8fa887', type: 'drama', poster: './assets/posters/girigo.jpg', aliases: ['夺命许愿'] },
    { id: 'hospital-playlist', title: '机智的医生生活', original: '슬기로운 의사생활', year: '2020', color: '#c39775', type: 'drama', poster: './assets/posters/hospital-playlist.jpg' },
    { id: 'my-liberation-notes', title: '我的解放日志', original: '나의 해방일지', year: '2022', color: '#7e9d9b', type: 'drama', poster: './assets/posters/my-liberation-notes.jpg' },
    { id: 'welcome-to-samdalri', title: '欢迎回到三达里', original: '웰컴투 삼달리', year: '2023', color: '#a68fbc', type: 'drama', poster: './assets/posters/welcome-to-samdalri.jpg' },
    { id: 'when-weather-is-fine', title: '天气好的话我回去找你', original: '날씨가 좋으면 찾아가겠어요', year: '2020', color: '#c08a85', type: 'drama', poster: './assets/posters/when-weather-is-fine.jpg' },
    { id: 'friendly-rivalry', title: '善意的竞争', original: '선의의 경쟁', year: '2025', color: '#84a6b1', type: 'drama', poster: './assets/posters/friendly-rivalry.jpg' },
    { id: 'sassy-go-go', title: '无理的前进', original: '발칙하게 고고', year: '2015', color: '#aa9b75', type: 'drama', poster: './assets/posters/sassy-go-go.jpg' },
    { id: 'love-next-door', title: '妈妈朋友的儿子', original: '엄마친구아들', year: '2024', color: '#8a99bf', type: 'drama', poster: './assets/posters/love-next-door.jpg' },
    { id: 'love-in-the-moonlight', title: '云画的月光', original: '구르미 그린 달빛', year: '2016', color: '#b59a8d', type: 'drama', poster: './assets/posters/love-in-the-moonlight.jpg' },
    { id: 'sweet-home', title: '甜蜜家园', original: '스위트홈', year: '2020', color: '#86a993', type: 'drama', poster: './assets/posters/sweet-home.jpg' },
    { id: 'kim-ji-young-born-1982', title: '82年生的金智英', original: '82년생 김지영', year: '2019', color: '#8c9db4', type: 'movie', poster: './assets/posters/kim-ji-young-born-1982.jpg' },
    { id: 'parasite', title: '寄生虫', original: '기생충', year: '2019', color: '#b5879b', type: 'movie', poster: './assets/posters/parasite.jpg' },
    { id: 'the-witch-subversion', title: '魔女', original: '마녀', year: '2018', color: '#8fa887', type: 'movie', poster: './assets/posters/the-witch-subversion.jpg', aliases: ['魔女首部曲：诞生'] },
    { id: 'train-to-busan', title: '釜山行', original: '부산행', year: '2016', color: '#c39775', type: 'movie', poster: './assets/posters/train-to-busan.jpg' },
    { id: 'gonjiam-haunted-asylum', title: '昆池岩', original: '곤지암', year: '2018', color: '#7e9d9b', type: 'movie', poster: './assets/posters/gonjiam-haunted-asylum.jpg' },
    { id: 'game-caterers', title: '出差十五夜', original: '출장 십오야', year: '2021', color: '#a68fbc', type: 'variety', poster: './assets/posters/game-caterers.jpg' },
    { id: 'two-days-one-night', title: '两天一夜', original: '1박 2일', year: '2007', color: '#c08a85', type: 'variety', poster: './assets/posters/two-days-one-night.jpg' },
    { id: 'running-man', title: 'Running Man', original: '런닝맨', year: '2010', color: '#84a6b1', type: 'variety', poster: './assets/posters/running-man.jpg', aliases: ['running man'] },
    { id: 'iron-girls', title: '钢铁少女团', original: '무쇠소녀단', year: '2024', color: '#aa9b75', type: 'variety', poster: './assets/posters/iron-girls.jpg' },
    { id: 'to-do-x-txt', title: 'TXT TODO', original: 'TO DO X TXT', year: '2020', color: '#8a99bf', type: 'variety', poster: './assets/posters/to-do-x-txt.jpg' },
    { id: 'tws-club', title: 'TWS:CLUB', original: 'TWS:CLUB', year: '2024', color: '#b59a8d', type: 'variety', poster: './assets/posters/tws-club.jpg', aliases: ['TWS CLUB'] },
    { id: 'treasure-map', title: 'TREASURE MAP', original: 'TREASURE MAP', year: '2020', color: '#86a993', type: 'variety', poster: './assets/posters/treasure-map.jpg', aliases: ['Treasure Map'] },
    { id: "at-a-distance-spring-is-green", title: "远看是蔚蓝的春天", original: "멀리서 보면 푸른 봄", year: "2021", color: "#8c9db4", type: "drama", poster: "./assets/posters/at-a-distance-spring-is-green.png" },
    { id: "you-drive-me-crazy", title: "疯了，因为你", original: "미치겠다, 너땜에!", year: "2018", color: "#b5879b", type: "drama", poster: "./assets/posters/you-drive-me-crazy.png", aliases: ["疯了因为你"] },
    { id: "my-roommate-is-a-gumiho", title: "心惊肉跳的同居", original: "간 떨어지는 동거", year: "2021", color: "#8fa887", type: "drama", poster: "./assets/posters/my-roommate-is-a-gumiho.jpg" },
    { id: "a-love-so-beautiful-korean", title: "致美丽的我们", original: "아름다웠던 우리에게", year: "2020", color: "#c39775", type: "drama", poster: "./assets/posters/a-love-so-beautiful-korean.webp" },
    { id: "resident-playbook", title: "总有一天机智的住院医生生活", original: "언젠가는 슬기로울 전공의생활", year: "2025", color: "#7e9d9b", type: "drama", poster: "./assets/posters/resident-playbook.webp" },
    { id: "wedding-impossible", title: "不可能的婚礼", original: "웨딩 임파서블", year: "2024", color: "#a68fbc", type: "drama", poster: "./assets/posters/wedding-impossible.jpg" },
    { id: "school-2021", title: "学校2021", original: "학교 2021", year: "2021", color: "#c08a85", type: "drama", poster: "./assets/posters/school-2021.png" },
    { id: "revenant", title: "恶鬼", original: "악귀", year: "2023", color: "#84a6b1", type: "drama", poster: "./assets/posters/revenant.jpg" },
    { id: "from-now-on-showtime", title: "现在开始Showtime", original: "지금부터, 쇼타임!", year: "2022", color: "#aa9b75", type: "drama", poster: "./assets/posters/from-now-on-showtime.jpg", aliases: ["现在开始show time"] },
    { id: "serendipitys-embrace", title: "是偶然吗？", original: "우연일까?", year: "2024", color: "#8a99bf", type: "drama", poster: "./assets/posters/serendipitys-embrace.jpg", aliases: ["是偶然吗"] },
    { id: "bride-of-habaek", title: "河伯的新娘", original: "하백의 신부 2017", year: "2017", color: "#b59a8d", type: "drama", poster: "./assets/posters/bride-of-habaek.jpg" },
    { id: "bunny-and-her-boys", title: "芭妮与哥哥们", original: "바니와 오빠들", year: "2025", color: "#86a993", type: "drama", poster: "./assets/posters/bunny-and-her-boys.png" },
    { id: "head-over-heels", title: "牵牛和仙女", original: "견우와 선녀", year: "2025", color: "#8c9db4", type: "drama", poster: "./assets/posters/head-over-heels.webp" },
    { id: "a-good-day-to-be-a-dog", title: "今天也很可爱的狗", original: "오늘도 사랑스럽개", year: "2023", color: "#b5879b", type: "drama", poster: "./assets/posters/a-good-day-to-be-a-dog.webp" },
    { id: "dr-romantic-2", title: "浪漫医生金师傅 第二季", original: "낭만닥터 김사부 2", year: "2020", color: "#8fa887", type: "drama", poster: "./assets/posters/dr-romantic-2.jpg", aliases: ["浪漫医生金师傅2"] },
    { id: "dr-romantic-3", title: "浪漫医生金师傅 第三季", original: "낭만닥터 김사부 3", year: "2023", color: "#c39775", type: "drama", poster: "./assets/posters/dr-romantic-3.avif", aliases: ["浪漫医生金师傅3"] },
    { id: "queen-in-hyuns-man", title: "仁显皇后的男人", original: "인현왕후의 남자", year: "2012", color: "#7e9d9b", type: "drama", poster: "./assets/posters/queen-in-hyuns-man.jpg" },
    { id: "our-universe", title: "给你宇宙", original: "우주를 줄게", year: "2026", color: "#a68fbc", type: "drama", poster: "./assets/posters/our-universe.png" },
    { id: "squid-game", title: "鱿鱼游戏", original: "오징어 게임", year: "2021", color: "#c08a85", type: "drama", poster: "./assets/posters/squid-game.jpg", aliases: ["鱿鱼游戏1"] },
    { id: "squid-game-2", title: "鱿鱼游戏 第二季", original: "오징어 게임 시즌2", year: "2024", color: "#84a6b1", type: "drama", poster: "./assets/posters/squid-game-2.jpg", aliases: ["鱿鱼游戏2"] },
    { id: "squid-game-3", title: "鱿鱼游戏 第三季", original: "오징어 게임 시즌3", year: "2025", color: "#aa9b75", type: "drama", poster: "./assets/posters/squid-game-3.jpg", aliases: ["鱿鱼游戏3"] },
    { id: "peninsula", title: "釜山行2：半岛", original: "반도", year: "2020", color: "#8a99bf", type: "movie", poster: "./assets/posters/peninsula.png", aliases: ["釜山行2半岛"] },
    { id: "all-of-us-are-dead", title: "僵尸校园", original: "지금 우리 학교는", year: "2022", color: "#b59a8d", type: "drama", poster: "./assets/posters/all-of-us-are-dead.jpg" },
    { id: "strong-girl-nam-soon", title: "大力女子姜南顺", original: "힘쎈여자 강남순", year: "2023", color: "#86a993", type: "drama", poster: "./assets/posters/strong-girl-nam-soon.png" },
    { id: "penthouse-2", title: "顶楼 第二季", original: "펜트하우스 2", year: "2021", color: "#8c9db4", type: "drama", poster: "./assets/posters/penthouse-2.png", aliases: ["顶楼2"] },
    { id: "penthouse-3", title: "顶楼 第三季", original: "펜트하우스 3", year: "2021", color: "#b5879b", type: "drama", poster: "./assets/posters/penthouse-3.jpeg", aliases: ["顶楼3"] },
    { id: "iron-girls-2", title: "钢铁少女团 第二季", original: "무쇠소녀단2", year: "2025", color: "#8fa887", type: "variety", poster: "./assets/posters/iron-girls-2.webp", aliases: ["钢铁少女团2"] },
    { id: "iron-girls-3", title: "钢铁少女团 第三季", original: "무쇠소녀단3", year: "2026", color: "#c39775", type: "variety", poster: "./assets/posters/iron-girls-3.jpg", aliases: ["钢铁少女团3"] },
    { id: "hospital-playlist-2", title: "机智的医生生活 第二季", original: "슬기로운 의사생활 시즌2", year: "2021", color: "#7e9d9b", type: "drama", poster: "./assets/posters/hospital-playlist-2.jpg", aliases: ["机智的医生生活2"] },
    { id: "the-witch-drama", title: "魔女（电视剧）", original: "마녀", year: "2025", color: "#a68fbc", type: "drama", poster: "./assets/posters/the-witch-drama.png" },
    { id: "bitch-x-rich-2", title: "清潭国际高中 第二季", original: "청담국제고등학교 2", year: "2025", color: "#c08a85", type: "drama", poster: "./assets/posters/bitch-x-rich-2.webp", aliases: ["清潭国际高中2"] },
    { id: "daily-dose-of-sunshine", title: "精神病房也会迎来清晨", original: "정신병동에도 아침이 와요", year: "2023", color: "#84a6b1", type: "drama", poster: "./assets/posters/daily-dose-of-sunshine.jpg" },
    { id: "sweet-home-2", title: "甜蜜家园 第二季", original: "스위트홈 시즌2", year: "2023", color: "#aa9b75", type: "drama", poster: "./assets/posters/sweet-home-2.jpg", aliases: ["甜蜜家园2"] },
    { id: "sweet-home-3", title: "甜蜜家园 第三季", original: "스위트홈 시즌3", year: "2024", color: "#8a99bf", type: "drama", poster: "./assets/posters/sweet-home-3.jpg", aliases: ["甜蜜家园3"] },
    { id: "a-werewolf-boy", title: "狼少年", original: "늑대소년", year: "2012", color: "#b59a8d", type: "movie", poster: "./assets/posters/a-werewolf-boy.jpg" },
    { id: "good-boy", title: "健将联盟", original: "굿보이", year: "2025", color: "#86a993", type: "drama", poster: "./assets/posters/good-boy.png" },
    { id: "hundred-days-of-lies", title: "百日谎言", original: "100일의 거짓말", year: "2026", color: "#8c9db4", type: "drama", poster: "./assets/posters/hundred-days-of-lies.png" },
    { id: "no-tail-to-tell", title: "今天开始是人类", original: "오늘부터 인간입니다만", year: "2026", color: "#b5879b", type: "drama", poster: "./assets/posters/no-tail-to-tell.png" },
    { id: "labor-attorney-noh-mu-jin", title: "劳务师卢武镇", original: "노무사 노무진", year: "2025", color: "#8fa887", type: "drama", poster: "./assets/posters/labor-attorney-noh-mu-jin.jpg" },
    { id: "heavenly-ever-after", title: "比天堂还美丽", original: "천국보다 아름다운", year: "2025", color: "#c39775", type: "drama", poster: "./assets/posters/heavenly-ever-after.jpg" },
    { id: "love-all-play", title: "向你奔去的速度493km", original: "너에게 가는 속도 493km", year: "2022", color: "#7e9d9b", type: "drama", poster: "./assets/posters/love-all-play.jpg" },
    { id: "alchemy-of-souls", title: "还魂", original: "환혼", year: "2022", color: "#a68fbc", type: "drama", poster: "./assets/posters/alchemy-of-souls.jpg" },
    { id: "alchemy-of-souls-light-and-shadow", title: "还魂：光与影", original: "환혼: 빛과 그림자", year: "2022", color: "#c08a85", type: "drama", poster: "./assets/posters/alchemy-of-souls-light-and-shadow.jpg", aliases: ["还魂光与影"] },
    { id: "love-alarm", title: "喜欢的话请响铃", original: "좋아하면 울리는", year: "2019", color: "#84a6b1", type: "drama", poster: "./assets/posters/love-alarm.jpg", aliases: ["喜欢的话请响铃1"] },
    { id: "love-alarm-2", title: "喜欢的话请响铃 第二季", original: "좋아하면 울리는 2", year: "2021", color: "#aa9b75", type: "drama", poster: "./assets/posters/love-alarm-2.jpg", aliases: ["喜欢的话请响铃2"] },
    { id: "welcome-to-waikiki", title: "加油吧威基基", original: "으라차차 와이키키", year: "2018", color: "#8a99bf", type: "drama", poster: "./assets/posters/welcome-to-waikiki.jpg" },
    { id: "welcome-to-waikiki-2", title: "加油吧威基基 第二季", original: "으라차차 와이키키 2", year: "2019", color: "#b59a8d", type: "drama", poster: "./assets/posters/welcome-to-waikiki-2.jpg", aliases: ["加油吧威基基2"] },
    { id: "strangers-from-hell", title: "他人即地狱", original: "타인은 지옥이다", year: "2019", color: "#86a993", type: "drama", poster: "./assets/posters/strangers-from-hell.jpg" },
    { id: "something-in-the-rain", title: "经常请吃饭的漂亮姐姐", original: "밥 잘 사주는 예쁜 누나", year: "2018", color: "#8c9db4", type: "drama", poster: "./assets/posters/something-in-the-rain.jpg" },
    { id: "cheese-in-the-trap", title: "奶酪陷阱", original: "치즈인더트랩", year: "2016", color: "#b5879b", type: "drama", poster: "./assets/posters/cheese-in-the-trap.jpg" },
    { id: "another-miss-oh", title: "又见吴海英", original: "또 오해영", year: "2016", color: "#8fa887", type: "drama", poster: "./assets/posters/another-miss-oh.jpg" },
    { id: "the-k2", title: "THE K2", original: "더 케이투", year: "2016", color: "#c39775", type: "drama", poster: "./assets/posters/the-k2.jpg", aliases: ["THK K2"] },
    { id: "misaeng", title: "未生", original: "미생", year: "2014", color: "#7e9d9b", type: "drama", poster: "./assets/posters/misaeng.jpg" },
    { id: "the-merciless", title: "不汗党", original: "불한당: 나쁜 놈들의 세상", year: "2017", color: "#a68fbc", type: "movie", poster: "./assets/posters/the-merciless.jpg" }
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
    { id: 'xhs-obs-note', title: '小红书 · 韩剧《那年我们》同款取景地打卡', url: 'https://www.xiaohongshu.com/explore/69cf3099000000001b02229e' },
    { id: 'cartoontour-obs', title: 'CartoonTour · 《那年我们》取景地（含坐标）', url: 'https://cartoontour.com/film/view.php?media_no=947' },
    { id: 'xhs-tang-a', title: '小红书 · 《苦尽柑来遇见你》1-7回取景地', url: 'https://www.xiaohongshu.com/explore/68501c22000000001101fb65' },
    { id: 'xhs-tang-b', title: '小红书 · 《苦尽柑来遇见你》8-12回取景地', url: 'https://www.xiaohongshu.com/explore/6852852400000000150237db' },
    { id: 'xhs-lr', title: '小红书 · 水原《背着善宰跑》同款打卡', url: 'https://www.xiaohongshu.com/explore/69d4cd350000000023010be0' },
    { id: 'visitkorea-obs', title: '韩国观光公社 · 《那年我们》取景地', url: 'https://english.visitkorea.or.kr/svc/contents/infoBscView.do?menuSn=508&vcontsId=177328' },
    { id: 'suwon-obs', title: '水原市 · 《那年我们》取景地路线', url: 'https://www.suwon.go.kr/sw-www/sw-visitsuwon/sw-visitsuwon-02/sw-visitsuwon-02-05/sw-visitsuwon-02-05-04.jsp' },
    { id: 'filmkorea-obs-cafe', title: '韩国影视委员会 · 青麦田旧牧场取景地', url: 'https://ifc.filmkorea.or.kr/location/location_view.jsp?id=11031&page=344' },
    { id: 'visitkorea-lr', title: '韩国观光公社 · 《背着善宰跑》水原路线', url: 'https://english.visitkorea.or.kr/svc/whereToGo/hdrdslt/hdrdsltView.do?crsSn=564819' },
    { id: 'joongang-lr-house', title: 'Korea JoongAng Daily · 善宰家蓝色大门', url: 'https://www.koreajoongangdaily.com/korea/weekend-getaway-cupids-trails-explore-these-four-filming-spots-from-hit-romantic-drama-lovely-runner/10434259' },
    { id: 'visitkorea-tang-farm', title: '韩国观光公社 · 高敞学院农场取景地', url: 'https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=b7baa61d-9207-4c1a-9aac-0981f5f85553' },
    { id: 'gangnam-tang', title: '江南区政府 · 必敬齋相见礼场景', url: 'https://www.gangnam.go.kr/gangnamlife/2026/html/vol368/sub01_05.html' },
    { id: 'gq-lr-bus', title: 'GQ Korea · 延武洞停车场公交追车场景', url: 'https://www.gqkorea.co.kr/2024/06/10/%EC%84%A0%EC%97%85%ED%8A%80-%EC%88%9C%EB%A1%80%EA%B8%B8%EC%9D%B4%EB%9D%BC%EB%8A%94-%EA%B2%8C-%EC%8B%A4%EC%A1%B4/' },
    { id: 'daegu-tang', title: '大邱文化艺术振兴院 · 桂山圣堂取景地', url: 'https://www.dgfca.or.kr/article/REPORT_NEWS/detail/13643' },
    { id: 'xhs-gp', title: '小红书 · 打卡《21世纪大君夫人》取景地', url: 'https://www.xiaohongshu.com/explore/6a0adacb0000000006023608' },
    { id: 'xhs-qbc', title: '小红书 · 魁北克｜鬼怪之城（附打卡路线）', url: 'https://www.xiaohongshu.com/explore/6ac99985000000001303d322' },
    { id: 'quebec-goblin', title: '魁北克市旅游局 · 《鬼怪》取景地', url: 'https://www.quebec-cite.com/en/quebec-city/movies-shot-in-quebec-city?list=suggested' },
    { id: 'chungnam-gp', title: '忠清南道旅游局 · 百济文化园区取景作品', url: 'https://tour.chungnam.go.kr/prog/course/kor/sub01_03_02/view.do?courseNo=594' },
    { id: 'kversal-gp', title: 'Kversal · 《21世纪大君夫人》取景地列表', url: 'https://kversal.com/ko/dramas/12233' },
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
    },
    {
      id: 'goblin-anguk-meet', workId: 'goblin', name: '安国站 1 号口旁巷道', ko: '안국역 1번출구', city: '首尔 · 钟路区', group: '首尔',
      lat: 37.5765, lng: 126.9852, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“安国站 1 号口（首尔工艺博物馆儿童博物馆旁）”定位，坐标取车站 1 号口与博物馆之间；具体机位待现场核对。',
      address: '서울특별시 종로구 율곡로3길 4 인근', query: '안국역 1번출구', kind: 'seoul', sourceId: null,
      visit: '居民区巷道，请保持安静、不要堵塞通行。'
    },
    {
      id: 'goblin-goblin-house', workId: 'goblin', name: '鬼怪的家 · 德成女大云岘宫洋馆', ko: '덕성여자대학교 운현궁 양관', city: '首尔 · 钟路区', group: '首尔',
      lat: 37.5754, lng: 126.9874, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“云岘宫洋馆（德成女大校园内）”定位到德成女大钟路云岘校区；图注韩文误作“덕성궁”，实为“운현궁 양관”，机位待核实。',
      address: '서울특별시 종로구 삼일대로32길 인근 (덕성여자대학교 운현캠퍼스)', query: '덕성여자대학교 덕성궁', kind: 'seoul', sourceId: null,
      visit: '校园建筑，非公开参观区；请在校园外围拍摄并遵守学校规定。'
    },
    {
      id: 'goblin-jungang-high', workId: 'goblin', name: '新娘的“大学” · 首尔中央高中', ko: '서울중앙고등학교', city: '首尔 · 钟路区', group: '首尔',
      lat: 37.5842, lng: 126.9868, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“首尔中央高中”定位到学校；剧中“大学”实为高中校园，机位待核实。',
      address: '서울특별시 종로구 계동길 60', query: '서울중앙고등학교', kind: 'seoul', sourceId: null,
      visit: '学校仍在办学，请勿进入校园；在公共道路拍摄。'
    },
    {
      id: 'goblin-samcheong-wall', workId: 'goblin', name: '鬼怪与使者初见 · 三清路宫墙路（青瓦台前路）', ko: '삼청로 116 인근', city: '首尔 · 钟路区', group: '首尔',
      lat: 37.5851, lng: 126.9804, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '图注写“德寿宫外墙”，但地址“삼청로 116”与画面（弧形瓦顶宫墙路）都指向三清洞／青瓦台前路一带；德寿宫在明洞附近，相距约 2 km，故按三清路 116 定位，机位待核实。',
      address: '서울특별시 종로구 삼청로 116', query: '삼청로 116', kind: 'seoul', sourceId: null,
      visit: '道路较窄，注意来往车辆，不要在路中央停留拍照。'
    },
    {
      id: 'goblin-yongdap-bridge', workId: 'goblin', name: '使者与公主初见 · 龙踏站天桥', ko: '용답역 육교', city: '首尔 · 城东区', group: '首尔',
      lat: 37.5636, lng: 127.0537, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“龙踏站 2 号口 46 米天桥”定位到龙踏站，坐标取车站位置；具体桥体位置待核实。',
      address: '서울특별시 성동구 사근동 235-1 인근', query: '용답역 육교', kind: 'seoul', sourceId: null,
      visit: '人行天桥，拍照时请保持通行。'
    },
    {
      id: 'goblin-sinchon-tunnel', workId: 'goblin', name: '鬼怪与使者买葱隧道 · 新村涂鸦隧道', ko: '신촌그래피티벽화터널', city: '首尔 · 西大门区', group: '首尔',
      lat: 37.5595, lng: 126.9429, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“京义中央线新村站 1 号口前”定位到新村站；涂鸦隧道在车站附近，机位待核实。',
      address: '서울특별시 서대문구 신촌동 (경의중앙선 신촌역 1번출구 앞)', query: '신촌그래피티벽화터널', kind: 'seoul', sourceId: null,
      visit: '隧道内较暗，注意安全；壁画为公共涂鸦。'
    },
    {
      id: 'goblin-hanmi-bookstore', workId: 'goblin', name: '鬼怪与新娘路过的书店 · 仁川韩美书店', ko: '한미서점', city: '仁川 · 济物浦区', group: '仁川',
      lat: 37.4726, lng: 126.6365, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按仁川市官网“한미서점：인천 동구 금곡동 14-4”与图注“금골로 9”定位；机位待核实。',
      address: '인천광역시 동구 금곡동 14-4 (금곡로 9)', query: '한미서점 인천', kind: 'inchon', sourceId: null,
      visit: '仍在营业的老书店；进店请先询问店主再拍摄。'
    },
    {
      id: 'obs-poster', workId: 'our-beloved-summer', name: '海报拍摄地', ko: '포스터 촬영지', city: '水原 · 八达区', group: '水原',
      lat: 37.2856, lng: 127.0120, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按笔记“91-9 Jangan-dong（位于小熊家后面）”定位；坐标取小熊家一带，机位待核实。',
      address: '경기도 수원시 팔달구 장안동 91-9', query: '수원 장안동 91-9', kind: 'suwon', sourceId: 'xhs-obs-note',
      visit: '位于居民区，请勿打扰住户。'
    },
    {
      id: 'obs-choi-house', workId: 'our-beloved-summer', name: '崔雄家', ko: '최웅네 집', city: '水原 · 八达区', group: '水原',
      lat: 37.2858, lng: 127.0123, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按笔记“108-1 Jangan-dong”定位；现场为“카페 피터”外墙，机位待核实。',
      address: '경기도 수원시 팔달구 장안동 108-1', query: '수원 장안동 108-1', kind: 'suwon', sourceId: 'xhs-obs-note',
      visit: '居民区/咖啡馆外墙，拍摄前请确认是否允许。'
    },
    {
      id: 'obs-yeonsu-house', workId: 'our-beloved-summer', name: '延秀家 · 池洞壁画村', ko: '지동벽화마을', city: '水原 · 八达区', group: '水原',
      lat: 37.283931, lng: 127.02399, coordinateStatus: 'venue', verifiedAt: '2026-11-07', entrance: null,
      coordinateSourceId: 'cartoontour-obs', coordinateNote: '韩国观光公社确认延秀家位于池洞壁画村，CartoonTour 标出 창룡문로 75-5；坐标指向景点地址，具体拍摄机位待现场核实。',
      address: '경기도 수원시 팔달구 창룡문로 75-5', query: '지동벽화마을', kind: 'suwon', sourceId: 'visitkorea-obs',
      visit: '居民区壁画村，请保持安静、勿打扰住户。'
    },
    {
      id: 'obs-haenggung-party', workId: 'our-beloved-summer', name: '崔雄家／工作室 · 旧行宫派对', ko: '행궁파티', city: '水原 · 八达区', group: '水原',
      lat: 37.285957, lng: 127.01088, coordinateStatus: 'venue', verifiedAt: '2026-11-07', entrance: null,
      coordinateSourceId: 'cartoontour-obs', coordinateNote: '水原市确认此处是崔雄家的取景地；长安洞 109-1 与 화서문로31번길 22 为同一地址，原“工作室”记录已并入。CartoonTour 坐标指向建筑，具体机位待现场核实。',
      address: '경기도 수원시 팔달구 화서문로31번길 22', query: '행궁파티', kind: 'suwon', sourceId: 'suwon-obs',
      visit: '旧咖啡馆，现状可能变化；从公共道路外观拍摄并保持安静。'
    },
    {
      id: 'obs-cafe', workId: 'our-beloved-summer', name: '川北废牧场新品咖啡馆 · 青麦仓库', ko: '청보리 창고', city: '保宁 · 川北面', group: '保宁',
      lat: 36.4797, lng: 126.5314, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: 'cartoontour-obs', coordinateNote: '韩国影视委员会确认 천광로 73-1 是《那年我们》取景的青麦田旧牧场；现有坐标取 CartoonTour“천북 보리밭”田地节点，非咖啡馆入口，机位待核实。',
      address: '충청남도 보령시 천북면 천광로 73-1', query: '청보리 창고 보령', kind: 'boryeong', sourceId: 'filmkorea-obs-cafe',
      visit: '青麦田为私有地，请勿踩踏；可携带宠物，停车在咖啡厅前路边。'
    },
    {
      id: 'tang-cheongsim', workId: 'when-life-gives-you-tangerines', name: '清心国际海洋修炼院', ko: '청심국제수련원', city: '丽水 · 华阳面', group: '全罗南道',
      lat: 34.644, lng: 127.6163, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按笔记“전남 여수시 화양면 장수로 183-5”定位到화양면 장수로一带；具体院址与机位待核实。',
      address: '전라남도 여수시 화양면 장수로 183-5', query: '청심국제수련원', kind: 'other', sourceId: 'xhs-tang-a',
      visit: '海边坡地，注意风大与湿滑。'
    },
    {
      id: 'tang-gogchang-farm', workId: 'when-life-gives-you-tangerines', name: '高敞学院农场', ko: '학원농장', city: '高敞 · 公音面', group: '全罗北道',
      lat: 35.3738, lng: 126.5422, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '韩国观光公社确认此农场是剧中油菜花田；Photon“학원농장”节点位于高敞公音面，农场范围大，具体机位待核实。',
      address: '전라북도 고창군 공음면 학원농장길 158-6', query: '고창 학원농장', kind: 'other', sourceId: 'visitkorea-tang-farm',
      visit: '农田为私有地，请勿踩踏；注意季节与开放时间。'
    },
    {
      id: 'tang-maechukji', workId: 'when-life-gives-you-tangerines', name: '梅楚池村', ko: '매축지마을', city: '釜山 · 东区', group: '釜山',
      lat: 35.1336, lng: 129.0518, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“좌천동 매축지마을”定位到좌천동一带；村落巷道狭窄，机位待核实。',
      address: '부산광역시 동구 좌천동 매축지마을', query: '매축지마을', kind: 'other', sourceId: 'xhs-tang-a',
      visit: '居民区，请保持安静、勿扰住户。'
    },
    {
      id: 'tang-seongnam', workId: 'when-life-gives-you-tangerines', name: '城南二路 46 号 10-2', ko: '성남이로46번길 10-2', city: '釜山 · 东区', group: '釜山',
      lat: 35.134, lng: 129.0579, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“성남이로 46번길 10-2”定位到성남이로一带；具体门牌与机位待核实。',
      address: '부산광역시 동구 성남이로 46번길 10-2', query: '부산 동구 성남이로46번길', kind: 'other', sourceId: 'xhs-tang-a',
      visit: '居民区，请勿打扰住户。'
    },
    {
      id: 'tang-jangheung', workId: 'when-life-gives-you-tangerines', name: '张奂村海岸', ko: '고마장환길', city: '长兴 · 冠山邑', group: '全罗南道',
      lat: 34.5578, lng: 126.9415, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“장흥군 관산읍 고마장환길 542”定位到관산읍一带；海岸线较长，机位待核实。',
      address: '전라남도 장흥군 관산읍 고마장환길 542', query: '장흥 고마장환길', kind: 'other', sourceId: 'xhs-tang-a',
      visit: '海岸道路，注意车辆与潮汐。'
    },
    {
      id: 'tang-unmunsa', workId: 'when-life-gives-you-tangerines', name: '云门寺', ko: '운문사', city: '清道 · 云门面', group: '庆尚北道',
      lat: 35.6611, lng: 128.9603, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '笔记误写“전북 청도군”，实际在경북 청도군；坐标取운문사寺址，机位待核实。',
      address: '경상북도 청도군 운문면 운문사길 264', query: '운문사', kind: 'other', sourceId: 'xhs-tang-a',
      visit: '寺庙为宗教场所，请遵守礼仪、保持安静。'
    },
    {
      id: 'tang-andong-homin', workId: 'when-life-gives-you-tangerines', name: '胡民里', ko: '호민리', city: '安东 · 丰川面', group: '庆尚北道',
      lat: 36.5558, lng: 128.5066, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“안동시 풍천면 호민리”定位到풍천면一带；村落机位待核实。',
      address: '경상북도 안동시 풍천면 호민리', query: '안동 풍천면 호민리', kind: 'other', sourceId: 'xhs-tang-a',
      visit: '乡村居民区，请勿打扰。'
    },
    {
      id: 'tang-jejumok', workId: 'when-life-gives-you-tangerines', name: '济州牧官衙遗址', ko: '제주목관아', city: '济州 · 济州市', group: '济州',
      lat: 33.5139, lng: 126.5223, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: 'Photon“제주목관아”节点；为开放景区，机位待核实。',
      address: '제주특별자치도 제주시 관덕로 25', query: '제주목관아', kind: 'other', sourceId: 'xhs-tang-a',
      visit: '景区开放时间请以现场为准。'
    },
    {
      id: 'tang-jeonbuk-univ', workId: 'when-life-gives-you-tangerines', name: '全北大学医院', ko: '전북대학교병원', city: '全州 · 德津区', group: '全罗北道',
      lat: 35.847, lng: 127.1394, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“전북대학교 건지로 20”定位到全北大学医院一带；医院内部不开放拍摄。',
      address: '전라북도 전주시 덕진구 건지로 20', query: '전북대학교병원', kind: 'other', sourceId: 'xhs-tang-a',
      visit: '医院为营业场所，请勿影响就医秩序。'
    },
    {
      id: 'tang-incheon-uhyeon', workId: 'when-life-gives-you-tangerines', name: '雨岘路 67 号 19', ko: '우현로67번길 19', city: '仁川 · 中区', group: '仁川',
      lat: 37.4716, lng: 126.6301, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“우현로 67번길 19”定位到우현로一带；具体门牌与机位待核实。',
      address: '인천광역시 중구 우현로 67번길 19', query: '인천 중구 우현로67번길', kind: 'other', sourceId: 'xhs-tang-a',
      visit: '居民/商业混合区，拍摄前请确认是否允许。'
    },
    {
      id: 'tang-jeonnam-univ', workId: 'when-life-gives-you-tangerines', name: '全南大学（光州校区）', ko: '전남대학교', city: '光州 · 北区', group: '光州',
      lat: 35.1769, lng: 126.9069, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: 'Photon“전남대학교”节点；剧中作为“首尔大”出现，机位待核实。',
      address: '광주광역시 북구 용봉로 77', query: '전남대학교', kind: 'other', sourceId: 'xhs-tang-a',
      visit: '校园，请遵守学校规定。'
    },
    {
      id: 'tang-jeonju-paldal', workId: 'when-life-gives-you-tangerines', name: '八达路 140', ko: '팔달로 140', city: '全州 · 完山区', group: '全罗北道',
      lat: 35.819, lng: 127.147, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“전주 완산구 팔달로 140”定位到팔달로一带；具体门牌与机位待核实。',
      address: '전라북도 전주시 완산구 팔달로 140', query: '전주 완산구 팔달로', kind: 'other', sourceId: 'xhs-tang-a',
      visit: '商业街，注意车辆与行人。'
    },
    {
      id: 'tang-deokwon', workId: 'when-life-gives-you-tangerines', name: '德院', ko: '덕원', city: '首尔 · 永登浦区', group: '首尔',
      lat: 37.5223, lng: 126.912, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: 'Photon“덕원”节点，位于영등포동；机位待核实。',
      address: '서울특별시 영등포구 버드나무로6길 6', query: '서울 영등포 덕원', kind: 'other', sourceId: 'xhs-tang-a',
      visit: '餐馆/店铺，营业时间内拍摄请先询问。'
    },
    {
      id: 'tang-jungang-high', workId: 'when-life-gives-you-tangerines', name: '首尔中央高等学校', ko: '중앙고등학교', city: '首尔 · 钟路区', group: '首尔',
      lat: 37.5842, lng: 126.9868, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: 'Photon“중앙고등학교”节点；学校仍在办学，机位待核实。',
      address: '서울특별시 종로구 창덕궁길 164', query: '중앙고등학교', kind: 'other', sourceId: 'xhs-tang-a',
      visit: '学校，请勿进入校园；在公共道路拍摄。'
    },
    {
      id: 'tang-sinseongru', workId: 'when-life-gives-you-tangerines', name: '仁川新盛楼', ko: '신성루', city: '仁川 · 中区', group: '仁川',
      lat: 37.4715, lng: 126.6305, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“우현로 19-14 신성루”定位到우현로一带；具体店址与机位待核实。',
      address: '인천광역시 중구 우현로 19-14', query: '인천 신성루', kind: 'other', sourceId: 'xhs-tang-b',
      visit: '餐馆仍在营业，进店拍摄请先征得同意。'
    },
    {
      id: 'tang-bugyo-bus', workId: 'when-life-gives-you-tangerines', name: '浮桥公交站', ko: '조정래길', city: '宝城 · 筏桥邑', group: '全罗南道',
      lat: 34.848, lng: 127.3472, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: 'Photon“조정래길”节点，位于벌교읍；公交站机位待核实。',
      address: '전라남도 보성군 벌교읍 조정래길 2-8', query: '벌교 조정래길', kind: 'other', sourceId: 'xhs-tang-b',
      visit: '乡间公交站，注意来往车辆。'
    },
    {
      id: 'tang-daegu-cathedral', workId: 'when-life-gives-you-tangerines', name: '大邱桂山圣堂', ko: '계산성당', city: '大邱 · 中区', group: '大邱',
      lat: 35.8679, lng: 128.5878, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '大邱文化艺术振兴院确认桂山圣堂是本剧取景地；坐标取教堂位置，婚礼内景的具体机位待核实。',
      address: '대구광역시 중구 서성로 10', query: '대구 계산성당', kind: 'other', sourceId: 'daegu-tang',
      visit: '宗教场所，请遵守礼仪、保持安静。'
    },
    {
      id: 'tang-yongsan-jangmun', workId: 'when-life-gives-you-tangerines', name: '长文路 49 街', ko: '장문로49길', city: '首尔 · 龙山区', group: '首尔',
      lat: 37.5262, lng: 126.9984, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“장문로 49길”定位到장문로一带；具体机位待核实。',
      address: '서울특별시 용산구 장문로 49길', query: '서울 용산구 장문로49길', kind: 'other', sourceId: 'xhs-tang-b',
      visit: '居民区，请保持安静。'
    },
    {
      id: 'tang-junggu-45', workId: 'when-life-gives-you-tangerines', name: '45 大楼', ko: '사오빌딩', city: '首尔 · 中区', group: '首尔',
      lat: 37.5636, lng: 126.9954, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“퇴계로41길 29”定位；具体店址与机位待核实。',
      address: '서울특별시 중구 퇴계로41길 29', query: '서울 중구 퇴계로41길29', kind: 'other', sourceId: 'xhs-tang-b',
      visit: '商业楼，拍摄前请确认是否允许。'
    },
    {
      id: 'tang-incheon-songhyeon', workId: 'when-life-gives-you-tangerines', name: '松岘公园路（背景+CG）', ko: '송현동', city: '仁川 · 东区', group: '仁川',
      lat: 37.4823, lng: 126.6427, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“송현동 22-127”定位到송현동一带；剧中背景含 CG 效果，机位待核实。',
      address: '인천광역시 동구 송현동 22-127', query: '인천 동구 송현동', kind: 'other', sourceId: 'xhs-tang-b',
      visit: '居民区，请勿打扰住户。'
    },
    {
      id: 'tang-gangnam-pilgyeongjae', workId: 'when-life-gives-you-tangerines', name: '必敬齋', ko: '필경재', city: '首尔 · 江南区', group: '首尔',
      lat: 37.4849, lng: 127.0952, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '江南区政府确认此处拍摄金明与英凡两家相见礼；坐标取餐厅位置，具体室内机位待核实。',
      address: '서울특별시 강남구 광평로 205', query: '필경재', kind: 'other', sourceId: 'gangnam-tang',
      visit: '餐厅营业时间内拍摄请先询问。'
    },
    {
      id: 'tang-changseong', workId: 'when-life-gives-you-tangerines', name: '昌盛洞 6', ko: '창성동 6', city: '首尔 · 钟路区', group: '首尔',
      lat: 37.5809, lng: 126.9725, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“창성동 6”定位到창성동一带；具体门牌与机位待核实。',
      address: '서울특별시 종로구 창성동 6', query: '서울 종로구 창성동', kind: 'other', sourceId: 'xhs-tang-b',
      visit: '居民区，请保持安静。'
    },
    {
      id: 'tang-guro-hyeondae', workId: 'when-life-gives-you-tangerines', name: '五柳路现代城住宅', ko: '오류로62-15', city: '首尔 · 九老区', group: '首尔',
      lat: 37.4902, lng: 126.8405, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“오류로 62-15”定位到오류로一带；具体楼栋与机位待核实。',
      address: '서울특별시 구로구 오류로 62-15', query: '서울 구로구 오류로62-15', kind: 'other', sourceId: 'xhs-tang-b',
      visit: '居民区，请勿打扰住户。'
    },
    {
      id: 'tang-yeouido-hanyang', workId: 'when-life-gives-you-tangerines', name: '汉阳公寓 E 栋附近', ko: '여의도동 4-2', city: '首尔 · 永登浦区', group: '首尔',
      lat: 37.5207, lng: 126.9385, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“여의도동 4-2”定位到여의도一带；具体楼栋与机位待核实。',
      address: '서울특별시 영등포구 여의도동 4-2', query: '서울 영등포구 여의도동', kind: 'other', sourceId: 'xhs-tang-b',
      visit: '居民区，请保持安静。'
    },
    {
      id: 'tang-ora-buckwheat', workId: 'when-life-gives-you-tangerines', name: '梧罗洞荞麦田', ko: '오라이동 산76', city: '济州 · 济州市', group: '济州',
      lat: 33.4708, lng: 126.5099, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“오라이동 산76”定位到오라이동一带；荞麦田为农地，机位待核实。',
      address: '제주특별자치도 제주시 오라이동 산76', query: '제주 오라이동', kind: 'other', sourceId: 'xhs-tang-b',
      visit: '农田，请勿踩踏作物。'
    },
    {
      id: 'tang-jeonju-paldal-147', workId: 'when-life-gives-you-tangerines', name: '八达路 147-2', ko: '팔달로 147-2', city: '全州 · 完山区', group: '全罗北道',
      lat: 35.819, lng: 127.147, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“전주 완산구 팔달로 147-2”定位到팔달로一带；具体门牌与机位待核实。',
      address: '전라북도 전주시 완산구 팔달로 147-2', query: '전주 완산구 팔달로', kind: 'other', sourceId: 'xhs-tang-b',
      visit: '商业街，注意车辆。'
    },
    {
      id: 'lr-house', workId: 'lovely-runner', name: '善宰家外观 · 蓝色大门', ko: '화서문로48번길', city: '水原 · 八达区', group: '水原',
      lat: 37.2861, lng: 127.0126, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '韩国观光公社确认街对面 몽테드 咖啡馆是小率家；媒体实地报道确认蓝色大门为善宰家外观。现有坐标仅为这一带示意位置，蓝色大门具体门牌与机位待现场核实。',
      address: '경기도 수원시 팔달구 화서문로48번길 14 对面', query: '몽테드 수원', kind: 'other', sourceId: 'joongang-lr-house',
      visit: '蓝色大门为居民住宅，请安静拍照、不要逗留打扰。'
    },
    {
      id: 'lr-wallpush', workId: 'lovely-runner', name: '小率壁咚善宰 · 新风路 43', ko: '신풍로 43', city: '水原 · 八达区', group: '水原',
      lat: 37.2845, lng: 127.0138, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '韩国观光公社确认壁咚场景在行宫洞壁画村；“신풍로 43”为投稿线索，尚未证实与官方所述巷道一致，现有坐标仅示意。',
      address: '경기도 수원시 팔달구 신풍로 43', query: '수원 신풍로 43', kind: 'other', sourceId: 'visitkorea-lr',
      visit: '居民区巷道，请保持安静。'
    },
    {
      id: 'lr-flying-kick', workId: 'lovely-runner', name: '大舅哥飞踢 · 正祖路 886 巷 21', ko: '정조로886번길 21', city: '水原 · 八达区', group: '水原',
      lat: 37.2871, lng: 127.0161, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按笔记“정조로886번길 21”定位到정조로886번길一带；具体门牌与机位待核实。',
      address: '경기도 수원시 팔달구 정조로886번길 21', query: '수원 정조로886번길', kind: 'other', sourceId: 'xhs-lr',
      visit: '居民区，请勿打扰住户。'
    },
    {
      id: 'lr-hwahongmun', workId: 'lovely-runner', name: '告白名场面 · 华虹门', ko: '수원화성 화홍문', city: '水原 · 八达区', group: '水原',
      lat: 37.2875, lng: 127.0176, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '韩国观光公社确认告白场景拍于华虹门前的桥；现有坐标取华虹门景点节点，桥上具体机位待核实。',
      address: '경기도 수원시 팔달구 북수동 수원화성 화홍문', query: '수원화성 화홍문', kind: 'other', sourceId: 'visitkorea-lr',
      visit: '华虹门夜景最美，建议傍晚去；注意水边安全。'
    },
    {
      id: 'lr-bus-stop', workId: 'lovely-runner', name: '善宰追公交 · 延武洞公营停车场', ko: '연무동 공영주차장', city: '水原 · 长安区', group: '水原',
      lat: 37.2885, lng: 127.0195, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: 'GQ Korea 报道追公交场景在延武洞公营停车场，地址为 경수대로743번길 57；现场并无真正公交站，现有坐标取该路段示意位置，机位待核实。',
      address: '경기도 수원시 장안구 경수대로743번길 57', query: '연무동 공영주차장', kind: 'other', sourceId: 'gq-lr-bus',
      visit: '现场是停车场，没有真实公交站；注意车辆进出。'
    },
    {
      id: 'gp-janggeum', workId: 'perfect-crown', name: '大长今主题公园', ko: '용인 대장금파크', city: '龙仁 · 处仁区', group: '京畿道',
      lat: 37.1256, lng: 127.3619, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按笔记“용천리 778-1”定位到백암면一带；园区范围大，机位待核实。',
      address: '경기 용인시 처인구 백암면 용천리 778-1', query: '대장금파크', kind: 'other', sourceId: 'xhs-gp',
      visit: '影视基地，开放时间与门票请查官方信息。'
    },
    {
      id: 'gp-baekje', workId: 'perfect-crown', name: '百济文化园区', ko: '백제문화단지', city: '扶余 · 窥岩面', group: '忠清南道',
      lat: 36.307382, lng: 126.907241, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: 'Photon“백제문화단지”节点；园区开放时间请以现场为准。',
      address: '충남 부여군 규암면 백제문로 455', query: '백제문화단지', kind: 'other', sourceId: 'chungnam-gp',
      visit: '大型文化园区，建议预留半天。'
    },
    {
      id: 'gp-mujinjeong', workId: 'perfect-crown', name: '无尽亭', ko: '무진정', city: '咸安 · 咸安面', group: '庆尚南道',
      lat: 35.2351, lng: 128.4253, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按笔记“괴산4길 25”定位到함안면一带；坐标取면中心，机位待核实。',
      address: '경남 함안군 함안면 괴산4길 25', query: '함안 무진정', kind: 'other', sourceId: 'kversal-gp',
      visit: '亭子为开放景点，注意水边安全。'
    },
    {
      id: 'gp-hwaseomun', workId: 'perfect-crown', name: '水原华西门', ko: '화서문', city: '水原 · 八达区', group: '京畿道',
      lat: 37.28561, lng: 127.00967, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: 'Photon“화서문”节点；世界文化遗产，机位待核实。',
      address: '경기 수원시 팔달구 장안동 334', query: '수원 화서문', kind: 'other', sourceId: 'xhs-gp',
      visit: '夜景灯光秀期间人流较多，注意安全。'
    },
    {
      id: 'gp-jongmyo', workId: 'perfect-crown', name: '宗庙', ko: '종묘', city: '首尔 · 钟路区', group: '首尔',
      lat: 37.5754, lng: 126.9939, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: 'Photon“훈정동”节点；宗庙为世界文化遗产，需预约参观。',
      address: '서울 종로구 훈정동 157', query: '종묘', kind: 'other', sourceId: 'xhs-gp',
      visit: '世界文化遗产，参观需按官方预约与时段。'
    },
    {
      id: 'gp-oreung', workId: 'perfect-crown', name: '庆州五陵', ko: '경주 오릉', city: '庆州 · 塔洞', group: '庆尚北道',
      lat: 35.823024, lng: 129.208371, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: 'Photon“경주 오릉”节点；为皇家陵墓（世遗），机位待核实。',
      address: '경북 경주시 탑동 67-1', query: '경주 오릉', kind: 'other', sourceId: 'kversal-gp',
      visit: '皇家陵墓，请勿踩踏草坪、保持肃静。'
    },
    {
      id: 'gp-gwanghallu', workId: 'perfect-crown', name: '广寒楼苑', ko: '광한루원', city: '南原 · 完山区', group: '全罗北道',
      lat: 35.402798, lng: 127.379539, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: 'Photon“광한루원”节点；为开放景区，机位待核实。',
      address: '전북 남원시 요천로 1447', query: '광한루원', kind: 'other', sourceId: 'kversal-gp',
      visit: '景区开放时间请以现场为准。'
    },
    {
      id: 'gp-ordaon', workId: 'perfect-crown', name: '杨平 Ordaon', ko: '양평 오르다온', city: '杨平 · 西宗面', group: '京畿道',
      lat: 37.6055, lng: 127.3494, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按笔记“서후리 529-34”定位到서종면一带；坐标取면中心，机位待核实。',
      address: '경기 양평군 서종면 서후리 529-34', query: '양평 오르다온', kind: 'other', sourceId: 'xhs-gp',
      visit: '婚礼/活动场地，非公开时请勿进入。'
    },
    {
      id: 'gp-gwanghwamun', workId: 'perfect-crown', name: '光化门广场', ko: '광화문광장', city: '首尔 · 钟路区', group: '首尔',
      lat: 37.571616, lng: 126.976903, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: 'Photon“광화문”节点；广场为公共空间，机位待核实。',
      address: '서울 종로구 세종대로 172', query: '광화문광장', kind: 'other', sourceId: 'xhs-gp',
      visit: '公共广场，拍摄时注意人流与交通管制。'
    },
    {
      id: 'gp-awon', workId: 'perfect-crown', name: '我园古宅', ko: '아원고택', city: '完州 · 所阳面', group: '全罗北道',
      lat: 35.903255, lng: 127.244283, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: 'Photon“아원고택”节点（오성한옥마을）；机位待核实。',
      address: '전북 완주군 소양면 송광수만로 516-7', query: '아원고택', kind: 'other', sourceId: 'kversal-gp',
      visit: '古宅为住宿/文化空间，进入前请确认。'
    },
    {
      id: 'gp-soyang', workId: 'perfect-crown', name: '所阳古宅', ko: '소양고택', city: '完州 · 所阳面', group: '全罗北道',
      lat: 35.903737, lng: 127.243543, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '按“송광수만로 472-23”定位到오성한옥마을；机位待核实。',
      address: '전북 완주군 소양면 송광수만로 472-23', query: '소양고택', kind: 'other', sourceId: 'xhs-gp',
      visit: '古宅/韩屋村，请保持安静。'
    },
    {
      id: 'gp-provincial', workId: 'perfect-crown', name: '道厅大楼（庆尚北道厅）', ko: '경상북도청', city: '安东 · 丰川面', group: '庆尚北道',
      lat: 36.575391, lng: 128.505163, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: 'Photon“경상북도청”节点；政府机构，机位待核实。',
      address: '경상북도 안동시 풍천면 도청대로 455', query: '경상북도청', kind: 'other', sourceId: 'xhs-gp',
      visit: '政府办公场所，请勿影响办公秩序。'
    },
    {
      id: 'qbc-chateau', workId: 'goblin', name: '芳堤娜城堡酒店', ko: 'Fairmont Le Château Frontenac', city: '魁北克城 · 老城', group: '加拿大',
      lat: 46.811817, lng: -71.205144, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: 'Photon“Fairmont Le Château Frontenac”节点；大堂可免费进入，机位待核实。',
      address: '1 Rue des Carrières, Québec, QC, Canada', query: 'Château Frontenac', kind: 'other', sourceId: 'quebec-goblin',
      visit: '剧中“鬼怪大叔的家”；大堂有同款复古信箱，不住店也可进入大堂拍照。'
    },
    {
      id: 'qbc-noel', workId: 'goblin', name: '魁北克圣诞商店', ko: 'La Boutique de Noël de Québec', city: '魁北克城 · 老城', group: '加拿大',
      lat: 46.813556, lng: -71.206785, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: '魁北克市旅游局确认圣诞商店是《鬼怪》取景地；坐标取店铺位置，店内拍摄规则与具体机位待核实。',
      address: '47 Rue De Buade, Québec, QC, Canada', query: 'La Boutique de Noël de Québec', kind: 'other', sourceId: 'quebec-goblin',
      visit: '全年圣诞氛围，二楼可俯瞰老城。'
    },
    {
      id: 'qbc-bastion', workId: 'goblin', name: '鬼怪大草坪 · 王后堡垒公园', ko: 'Parc du Bastion-de-la-Reine', city: '魁北克城 · 老城', group: '加拿大',
      lat: 46.808594, lng: -71.209264, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: 'Photon“Parc du Bastion-de-la-Reine”节点；魁北克市旅游局取景清单未列出此公园，剧中机位待核实。',
      address: 'Parc du Bastion-de-la-Reine, Québec, QC, Canada', query: 'Parc du Bastion-de-la-Reine', kind: 'other', sourceId: 'xhs-qbc',
      visit: '鬼怪与恩倬散步、墓地名场面取景地；秋叶铺满山坡，是最出圈机位。'
    },
    {
      id: 'qbc-cassecou', workId: 'goblin', name: '断头台阶（告白楼梯）', ko: 'Escalier Casse-Cou', city: '魁北克城 · 老城', group: '加拿大',
      lat: 46.812767, lng: -71.203565, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: 'Photon“Escalier Casse-cou”节点；台阶陡峭，注意安全。',
      address: 'Escalier Casse-Cou, Québec, QC, Canada', query: 'Escalier Casse-Cou', kind: 'other', sourceId: 'quebec-goblin',
      visit: '鬼怪新娘告白“撒浪嘿”的台阶，从上往下直通小香普兰街。'
    },
    {
      id: 'qbc-petit', workId: 'goblin', name: '小香普兰街 + 鬼怪红门', ko: 'Rue du Petit Champlain', city: '魁北克城 · 老城', group: '加拿大',
      lat: 46.811551, lng: -71.203632, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: 'Photon“Rue du Petit-Champlain”节点；68号红门为剧场后门，门打不开，只适合拍照。',
      address: '68 Rue du Petit Champlain, Québec, QC, Canada', query: 'Rue du Petit Champlain', kind: 'other', sourceId: 'quebec-goblin',
      visit: '68号小红门是剧中金信带恩倬穿越到魁北克的那扇门；彩色法式小楼、雨伞小巷都很好拍。'
    },
    {
      id: 'qbc-royale', workId: 'goblin', name: '皇家广场', ko: 'Place Royale', city: '魁北克城 · 老城', group: '加拿大',
      lat: 46.813173, lng: -71.202808, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: 'Photon“Place Royale”节点；目前没有找到支持《鬼怪》在此广场取景的独立来源，保留为投稿线索。',
      address: 'Place Royale, Québec, QC, Canada', query: 'Place Royale', kind: 'other', sourceId: 'xhs-qbc',
      visit: '巨大老城壁画，剧里街头镜头取景地。'
    },
    {
      id: 'qbc-tourny', workId: 'goblin', name: '图尔尼喷泉', ko: 'Fontaine de Tourny', city: '魁北克城 · 议会大厦', group: '加拿大',
      lat: 46.809604, lng: -71.212672, coordinateStatus: 'approximate', verifiedAt: null, entrance: null,
      coordinateSourceId: null, coordinateNote: 'Photon“Fontaine de Tourny”节点；开篇喷泉镜头。',
      address: 'Fontaine de Tourny, Québec, QC, Canada', query: 'Fontaine de Tourny', kind: 'other', sourceId: 'quebec-goblin',
      visit: '省议会大厦前，开篇喷泉镜头取景地。'
    },
  ],

  // 一处地标可以有多条场景记录；episode、timeSeconds、image 都需要独立核实。
  // 注文津场景的描述与集数待核实，暂不添加场景记录。
  scenes: [
    { id: 'noksapyeong-01', landmarkId: 'noksapyeong', description: '世路与以瑞相遇、眺望南山塔的天桥。', episode: null, timeSeconds: null, image: null, sourceId: 'visitkorea-itaewon' },
    { id: 'baekbeom-01', landmarkId: 'baekbeom', description: '世路与以瑞的吻戏拍摄于南山公园入口通往白凡广场的道路。', episode: null, timeSeconds: null, image: null, sourceId: 'visitkorea-itaewon' },
    { id: 'itaewonpark-01', landmarkId: 'itaewonpark', description: '根秀向世路道歉；另一段跟踪世路的情节也在此拍摄。', episode: null, timeSeconds: null, image: null, sourceId: 'visitkorea-itaewon' },
    { id: 'cheongha-01', landmarkId: 'cheongha', description: '此市场作为剧中“公辰市场”的拍摄地；市场内设有剧集取景位置指示牌。', episode: null, timeSeconds: null, image: null, sourceId: 'visitkorea-cheongha' },
    { id: 'sabang-01', landmarkId: 'sabang', description: '第 1 集慧珍与洪班长在山顶小船相遇；小船也是剧中的洪班长秘密基地。', episode: 1, timeSeconds: null, image: null, sourceId: 'visitkorea-hometown', episodeSourceId: 'visitkorea-hometown-episode' },
    { id: 'submission-scene-6c44f329-6172-4bc7-a6d5-8903ff6c1274', landmarkId: 'jumunjin', description: '', episode: null, timeSeconds: null, image: './assets/scenes/jumunjin-approved-6c44f329.jpg', imageCredit: '', sourceId: null },
    { id: 'goblin-anguk-meet-01', landmarkId: 'goblin-anguk-meet', description: '第一集：鬼怪与新娘在安国站旁的巷道雨中初遇。', episode: 1, timeSeconds: null, image: './assets/scenes/goblin/goblin-anguk-meet.jpg', imageCredit: '', sourceId: null, episodeSourceId: null },
    { id: 'goblin-goblin-house-01', landmarkId: 'goblin-goblin-house', description: '剧中“鬼怪的家”外观，取景于德成女子大学云岘宫洋馆。', episode: null, timeSeconds: null, image: './assets/scenes/goblin/goblin-duksung-palace.jpg', imageCredit: '', sourceId: null, episodeSourceId: null },
    { id: 'goblin-jungang-high-01', landmarkId: 'goblin-jungang-high', description: '剧中新娘就读的“大学”外观，实为首尔中央高中校园。', episode: null, timeSeconds: null, image: './assets/scenes/goblin/goblin-jungang-high.jpg', imageCredit: '', sourceId: null, episodeSourceId: null },
    { id: 'goblin-samcheong-wall-01', landmarkId: 'goblin-samcheong-wall', description: '第一集：鬼怪与地狱使者沿宫墙路第一次见面。', episode: 1, timeSeconds: null, image: './assets/scenes/goblin/goblin-deoksugung-wall.jpg', imageCredit: '', sourceId: null, episodeSourceId: null },
    { id: 'goblin-yongdap-bridge-01', landmarkId: 'goblin-yongdap-bridge', description: '第三集：地狱使者与公主（Sunny）在天桥上第一次见面。', episode: 3, timeSeconds: null, image: './assets/scenes/goblin/goblin-yongdap-bridge.jpg', imageCredit: '', sourceId: null, episodeSourceId: null },
    { id: 'goblin-sinchon-tunnel-01', landmarkId: 'goblin-sinchon-tunnel', description: '第十集：鬼怪与使者拎着大葱穿过涂鸦隧道。', episode: 10, timeSeconds: null, image: './assets/scenes/goblin/goblin-sinchon-tunnel.jpg', imageCredit: '', sourceId: null, episodeSourceId: null },
    { id: 'goblin-hanmi-bookstore-01', landmarkId: 'goblin-hanmi-bookstore', description: '第六集：鬼怪与新娘路过的书店，取景于仁川韩美书店。', episode: 6, timeSeconds: null, image: './assets/scenes/goblin/goblin-hanmi-bookstore.jpg', imageCredit: '', sourceId: null, episodeSourceId: null },
    { id: 'obs-choi-house-01', landmarkId: 'obs-choi-house', description: '崔雄家外墙（카페 피터）前，两人并肩而坐。', episode: null, timeSeconds: null, image: './assets/scenes/our-beloved-summer/obs-choi-house.jpg', imageCredit: '', sourceId: 'xhs-obs-note', episodeSourceId: null },
    { id: 'obs-yeonsu-house-01', landmarkId: 'obs-yeonsu-house', description: '冬季：成年后的两人站在延秀家（池洞壁画村）绿色大门前。', episode: null, timeSeconds: null, image: './assets/scenes/our-beloved-summer/obs-yeonsu-house-winter.jpg', imageCredit: '', sourceId: 'visitkorea-obs', episodeSourceId: null },
    { id: 'obs-yeonsu-house-02', landmarkId: 'obs-yeonsu-house', description: '学生时代：崔雄与国延秀在延秀家门口牵手。', episode: null, timeSeconds: null, image: './assets/scenes/our-beloved-summer/obs-yeonsu-house-summer.jpg', imageCredit: '', sourceId: 'visitkorea-obs', episodeSourceId: null },
    { id: 'obs-cafe-01', landmarkId: 'obs-cafe', description: '男女主雨中打伞的名场面，取景于青麦田旁的咖啡馆一带。', episode: null, timeSeconds: null, image: './assets/scenes/our-beloved-summer/obs-cafe.jpg', imageCredit: '', sourceId: 'filmkorea-obs-cafe', episodeSourceId: null },
    { id: 'tang-cheongsim-01', landmarkId: 'tang-cheongsim', description: '投稿线索称第 1 集（待核实）：老年爱纯回忆过去的日子。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-cheongsim.jpg', imageCredit: '', sourceId: 'xhs-tang-a', episodeSourceId: null },
    { id: 'tang-gogchang-farm-01', landmarkId: 'tang-gogchang-farm', description: '投稿线索称第 2 集（待核实）：爱纯撒娇、宽植在田野的场面。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-gogchang-farm.jpg', imageCredit: '', sourceId: 'visitkorea-tang-farm', episodeSourceId: null },
    { id: 'tang-maechukji-01', landmarkId: 'tang-maechukji', description: '投稿线索称第 2 集（待核实）：爱纯与宽植发愁的巷子。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-maechukji.jpg', imageCredit: '', sourceId: 'xhs-tang-a', episodeSourceId: null },
    { id: 'tang-seongnam-01', landmarkId: 'tang-seongnam', description: '投稿线索称第 2 集（待核实）：爱纯被老板娘压在地上的场面。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-seongnam.jpg', imageCredit: '', sourceId: 'xhs-tang-a', episodeSourceId: null },
    { id: 'tang-jangheung-01', landmarkId: 'tang-jangheung', description: '投稿线索称第 3 集（待核实）：宽植离开、爱纯哭着跑的海岸。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-jangheung.jpg', imageCredit: '', sourceId: 'xhs-tang-a', episodeSourceId: null },
    { id: 'tang-unmunsa-01', landmarkId: 'tang-unmunsa', description: '投稿线索称第 4 集（待核实）：爱纯与宽植结婚后求子的寺庙。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-unmunsa.jpg', imageCredit: '', sourceId: 'xhs-tang-a', episodeSourceId: null },
    { id: 'tang-andong-homin-01', landmarkId: 'tang-andong-homin', description: '投稿线索称第 5 集（待核实）：爱纯怀孕、聊宽植辛苦的场面。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-andong-homin.jpg', imageCredit: '', sourceId: 'xhs-tang-a', episodeSourceId: null },
    { id: 'tang-jejumok-01', landmarkId: 'tang-jejumok', description: '宽植与爱纯写诗的场面。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-jejumok.jpg', imageCredit: '', sourceId: 'xhs-tang-a', episodeSourceId: null },
    { id: 'tang-jeonbuk-univ-01', landmarkId: 'tang-jeonbuk-univ', description: '投稿线索称第 6 集（待核实）：金明带父母做内视镜的医院。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-jeonbuk-univ.jpg', imageCredit: '', sourceId: 'xhs-tang-a', episodeSourceId: null },
    { id: 'tang-incheon-uhyeon-01', landmarkId: 'tang-incheon-uhyeon', description: '投稿线索称第 6 集（待核实）：金明与英凡约会的地方。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-incheon-uhyeon.jpg', imageCredit: '', sourceId: 'xhs-tang-a', episodeSourceId: null },
    { id: 'tang-jeonnam-univ-01', landmarkId: 'tang-jeonnam-univ', description: '剧中“首尔大”的取景地。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-jeonnam-univ.jpg', imageCredit: '', sourceId: 'xhs-tang-a', episodeSourceId: null },
    { id: 'tang-jeonju-paldal-01', landmarkId: 'tang-jeonju-paldal', description: '投稿线索称第 6 集（待核实）：中年爱纯与宽植约会的地方。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-jeonju-paldal.jpg', imageCredit: '', sourceId: 'xhs-tang-a', episodeSourceId: null },
    { id: 'tang-deokwon-01', landmarkId: 'tang-deokwon', description: '投稿线索称第 7 集（待核实）：商吉当村长贿赂选民的小店。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-deokwon.jpg', imageCredit: '', sourceId: 'xhs-tang-a', episodeSourceId: null },
    { id: 'tang-jungang-high-01', landmarkId: 'tang-jungang-high', description: '投稿线索称第 7 集（待核实）：金明带补课的富二代女去学校。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-jungang-high.jpg', imageCredit: '', sourceId: 'xhs-tang-a', episodeSourceId: null },
    { id: 'tang-sinseongru-01', landmarkId: 'tang-sinseongru', description: '投稿线索称第 8 集（待核实）：金明和宽植去的中华食堂。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-sinseongru.jpg', imageCredit: '', sourceId: 'xhs-tang-b', episodeSourceId: null },
    { id: 'tang-bugyo-bus-01', landmarkId: 'tang-bugyo-bus', description: '投稿线索称第 8 集（待核实）：金明和宽植离别的车站。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-bugyo-bus.jpg', imageCredit: '', sourceId: 'xhs-tang-b', episodeSourceId: null },
    { id: 'tang-daegu-cathedral-01', landmarkId: 'tang-daegu-cathedral', description: '投稿线索称第 8 集（待核实）：金明结婚的礼堂。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-daegu-cathedral.jpg', imageCredit: '', sourceId: 'xhs-tang-b', episodeSourceId: null },
    { id: 'tang-yongsan-jangmun-01', landmarkId: 'tang-yongsan-jangmun', description: '投稿线索称第 10 集（待核实）：金明和忠燮去的小吃篷子。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-yongsan-jangmun.jpg', imageCredit: '', sourceId: 'xhs-tang-b', episodeSourceId: null },
    { id: 'tang-junggu-45-01', landmarkId: 'tang-junggu-45', description: '投稿线索称第 10 集（待核实）：忠燮母亲的商店。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-junggu-45.jpg', imageCredit: '', sourceId: 'xhs-tang-b', episodeSourceId: null },
    { id: 'tang-incheon-songhyeon-01', landmarkId: 'tang-incheon-songhyeon', description: '投稿线索称第 11 集（待核实）：金明与忠燮在金明小区散步（背景+CG）。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-incheon-songhyeon.jpg', imageCredit: '', sourceId: 'xhs-tang-b', episodeSourceId: null },
    { id: 'tang-gangnam-pilgyeongjae-01', landmarkId: 'tang-gangnam-pilgyeongjae', description: '投稿线索称第 11 集（待核实）：金明、英凡与双方父母去的餐厅。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-gangnam-pilgyeongjae.jpg', imageCredit: '', sourceId: 'gangnam-tang', episodeSourceId: null },
    { id: 'tang-changseong-01', landmarkId: 'tang-changseong', description: '投稿线索称第 11 集（待核实）：母亲爱纯因金明家庭地位在路上吵。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-changseong.jpg', imageCredit: '', sourceId: 'xhs-tang-b', episodeSourceId: null },
    { id: 'tang-guro-hyeondae-01', landmarkId: 'tang-guro-hyeondae', description: '投稿线索称第 11 集（待核实）：金明与英凡吵架的公寓。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-guro-hyeondae.jpg', imageCredit: '', sourceId: 'xhs-tang-b', episodeSourceId: null },
    { id: 'tang-yeouido-hanyang-01', landmarkId: 'tang-yeouido-hanyang', description: '投稿线索称第 11 集（待核实）：金明怪英凡太听母亲话。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-yeouido-hanyang.jpg', imageCredit: '', sourceId: 'xhs-tang-b', episodeSourceId: null },
    { id: 'tang-ora-buckwheat-01', landmarkId: 'tang-ora-buckwheat', description: '投稿线索称第 12 集（待核实）：爱纯回忆和儿时的金明。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-ora-buckwheat.jpg', imageCredit: '', sourceId: 'xhs-tang-b', episodeSourceId: null },
    { id: 'tang-jeonju-paldal-147-01', landmarkId: 'tang-jeonju-paldal-147', description: '投稿线索称第 12 集（待核实）：忠燮偶然看见金明在公交上，路上追。', episode: null, timeSeconds: null, image: './assets/scenes/when-life-gives-you-tangerines/tang-jeonju-paldal-147.jpg', imageCredit: '', sourceId: 'xhs-tang-b', episodeSourceId: null },
    { id: 'lr-house-01', landmarkId: 'lr-house', description: '黄色雨伞场景背景中的蓝色大门是善宰家的外观，小率家在街对面。', episode: null, timeSeconds: null, image: './assets/scenes/lovely-runner/lr-house.jpg', imageCredit: '', sourceId: 'joongang-lr-house', episodeSourceId: null },
    { id: 'lr-wallpush-01', landmarkId: 'lr-wallpush', description: '小率壁咚善宰的场面；投稿线索称第 5 集，集数待核实。', episode: null, timeSeconds: null, image: './assets/scenes/lovely-runner/lr-wallpush.jpg', imageCredit: '', sourceId: 'visitkorea-lr', episodeSourceId: null },
    { id: 'lr-flying-kick-01', landmarkId: 'lr-flying-kick', description: '大舅哥飞踢的场面；投稿线索称第 6 集，集数待核实。', episode: null, timeSeconds: null, image: './assets/scenes/lovely-runner/lr-flying-kick.jpg', imageCredit: '', sourceId: 'xhs-lr', episodeSourceId: null },
    { id: 'lr-hwahongmun-01', landmarkId: 'lr-hwahongmun', description: '华虹门前桥上的告白场景；投稿线索称第 6 集，集数待核实。', episode: null, timeSeconds: null, image: './assets/scenes/lovely-runner/lr-hwahongmun.jpg', imageCredit: '', sourceId: 'visitkorea-lr', episodeSourceId: null },
    { id: 'lr-bus-stop-01', landmarkId: 'lr-bus-stop', description: '善宰追上公交替小率停车的场景，实际在公营停车场拍摄；投稿线索称第 2 集，集数待核实。', episode: null, timeSeconds: null, image: './assets/scenes/lovely-runner/lr-bus-stop.jpg', imageCredit: '', sourceId: 'gq-lr-bus', episodeSourceId: null },
    { id: 'gp-janggeum-01', landmarkId: 'gp-janggeum', description: '皇宫内苑（剧中大部分皇室戏份）。', episode: null, timeSeconds: null, image: './assets/scenes/perfect-crown/gp-janggeum.jpg', imageCredit: '', sourceId: 'xhs-gp', episodeSourceId: null },
    { id: 'gp-baekje-01', landmarkId: 'gp-baekje', description: '大君和府院君相遇。', episode: null, timeSeconds: null, image: './assets/scenes/perfect-crown/gp-baekje.jpg', imageCredit: '', sourceId: 'chungnam-gp', episodeSourceId: null },
    { id: 'gp-mujinjeong-a-01', landmarkId: 'gp-mujinjeong', description: '观看落火（夜景）。', episode: null, timeSeconds: null, image: './assets/scenes/perfect-crown/gp-mujinjeong-a.jpg', imageCredit: '', sourceId: 'kversal-gp', episodeSourceId: null },
    { id: 'gp-mujinjeong-b-01', landmarkId: 'gp-mujinjeong', description: '无尽亭周边。', episode: null, timeSeconds: null, image: './assets/scenes/perfect-crown/gp-mujinjeong-b.jpg', imageCredit: '', sourceId: 'kversal-gp', episodeSourceId: null },
    { id: 'gp-hwaseomun-01', landmarkId: 'gp-hwaseomun', description: '主诞日灯光秀。', episode: null, timeSeconds: null, image: './assets/scenes/perfect-crown/gp-hwaseomun.jpg', imageCredit: '', sourceId: 'xhs-gp', episodeSourceId: null },
    { id: 'gp-jongmyo-01', landmarkId: 'gp-jongmyo', description: '宗庙祭祀。', episode: null, timeSeconds: null, image: './assets/scenes/perfect-crown/gp-jongmyo.jpg', imageCredit: '', sourceId: 'xhs-gp', episodeSourceId: null },
    { id: 'gp-oreung-01', landmarkId: 'gp-oreung', description: '翻墙浪漫 kiss。', episode: null, timeSeconds: null, image: './assets/scenes/perfect-crown/gp-oreung.jpg', imageCredit: '', sourceId: 'kversal-gp', episodeSourceId: null },
    { id: 'gp-gwanghallu-a-01', landmarkId: 'gp-gwanghallu', description: '内进宴求婚（白天）。', episode: null, timeSeconds: null, image: './assets/scenes/perfect-crown/gp-gwanghallu-a.jpg', imageCredit: '', sourceId: 'kversal-gp', episodeSourceId: null },
    { id: 'gp-gwanghallu-b-01', landmarkId: 'gp-gwanghallu', description: '广寒楼苑夜景。', episode: null, timeSeconds: null, image: './assets/scenes/perfect-crown/gp-gwanghallu-b.jpg', imageCredit: '', sourceId: 'kversal-gp', episodeSourceId: null },
    { id: 'gp-ordaon-01', landmarkId: 'gp-ordaon', description: '熙周与大君成亲。', episode: null, timeSeconds: null, image: './assets/scenes/perfect-crown/gp-ordaon.jpg', imageCredit: '', sourceId: 'xhs-gp', episodeSourceId: null },
    { id: 'gp-gwanghwamun-01', landmarkId: 'gp-gwanghwamun', description: '婚礼游行。', episode: null, timeSeconds: null, image: './assets/scenes/perfect-crown/gp-gwanghwamun.jpg', imageCredit: '', sourceId: 'xhs-gp', episodeSourceId: null },
    { id: 'gp-awon-a-01', landmarkId: 'gp-awon', description: '大君私宅（外景）。', episode: null, timeSeconds: null, image: './assets/scenes/perfect-crown/gp-awon-a.jpg', imageCredit: '', sourceId: 'kversal-gp', episodeSourceId: null },
    { id: 'gp-awon-b-01', landmarkId: 'gp-awon', description: '大君私宅（室内）。', episode: null, timeSeconds: null, image: './assets/scenes/perfect-crown/gp-awon-b.jpg', imageCredit: '', sourceId: 'kversal-gp', episodeSourceId: null },
    { id: 'gp-soyang-01', landmarkId: 'gp-soyang', description: '大君私宅庭院。', episode: null, timeSeconds: null, image: './assets/scenes/perfect-crown/gp-soyang.jpg', imageCredit: '', sourceId: 'xhs-gp', episodeSourceId: null },
    { id: 'gp-provincial-01', landmarkId: 'gp-provincial', description: '国家政府机构。', episode: null, timeSeconds: null, image: './assets/scenes/perfect-crown/gp-provincial.jpg', imageCredit: '', sourceId: 'xhs-gp', episodeSourceId: null },
    { id: 'qbc-chateau-01', landmarkId: 'qbc-chateau', description: '芳堤娜城堡外景（鬼怪大叔的家）。', episode: null, timeSeconds: null, image: './assets/scenes/goblin-quebec/qbc-chateau.jpg', imageCredit: '', sourceId: 'quebec-goblin', episodeSourceId: null },
    { id: 'qbc-chateau-mailbox-01', landmarkId: 'qbc-chateau', description: '大堂内同款复古信箱（女主收信处）。', episode: null, timeSeconds: null, image: './assets/scenes/goblin-quebec/qbc-chateau-mailbox.jpg', imageCredit: '', sourceId: 'quebec-goblin', episodeSourceId: null },
    { id: 'qbc-lobby-01', landmarkId: 'qbc-chateau', description: '酒店大堂。', episode: null, timeSeconds: null, image: './assets/scenes/goblin-quebec/qbc-lobby.jpg', imageCredit: '', sourceId: 'quebec-goblin', episodeSourceId: null },
    { id: 'qbc-noel-a-01', landmarkId: 'qbc-noel', description: '剧中出现的圣诞小店。', episode: null, timeSeconds: null, image: './assets/scenes/goblin-quebec/qbc-noel-a.jpg', imageCredit: '', sourceId: 'quebec-goblin', episodeSourceId: null },
    { id: 'qbc-noel-b-01', landmarkId: 'qbc-noel', description: '圣诞商店夜景。', episode: null, timeSeconds: null, image: './assets/scenes/goblin-quebec/qbc-noel-b.jpg', imageCredit: '', sourceId: 'quebec-goblin', episodeSourceId: null },
    { id: 'qbc-petit-01', landmarkId: 'qbc-petit', description: '小香普兰街。', episode: null, timeSeconds: null, image: './assets/scenes/goblin-quebec/qbc-petit.jpg', imageCredit: '', sourceId: 'quebec-goblin', episodeSourceId: null },
    { id: 'qbc-red-door-01', landmarkId: 'qbc-petit', description: '鬼怪穿越红门（68号）。', episode: null, timeSeconds: null, image: './assets/scenes/goblin-quebec/qbc-red-door.jpg', imageCredit: '', sourceId: 'quebec-goblin', episodeSourceId: null },
    { id: 'qbc-tourny-01', landmarkId: 'qbc-tourny', description: '开篇喷泉镜头。', episode: null, timeSeconds: null, image: './assets/scenes/goblin-quebec/qbc-tourny.jpg', imageCredit: '', sourceId: 'quebec-goblin', episodeSourceId: null },
  ],
  updates: [
    { landmarkId: 'jumunjin', reviewedAt: '2026-11-06T14:24:29.372Z' }
  ]
};
