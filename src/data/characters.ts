import type { Element, Quality } from './palette';

export type Variant =
  | 'sheep' | 'cow' | 'cloud' | 'crab' | 'lion' | 'bunny'
  | 'penguin' | 'grape' | 'pony' | 'goat' | 'otter' | 'fish';

export interface Creature {
  id: string;
  sign: string; // 星座中文
  signEn: string;
  date: string;
  element: Element;
  quality: Quality;
  variant: Variant;
  name: string; // 角色名稱
  title: string; // 稱號
  body: string; // 身體主色
  belly: string; // 肚子/淺色
  accent: string; // 點綴色（角、鰭、腮紅…）
  line: string; // 角色口頭禪
  personality: string; // 個性評語
  superpower: string; // 小天賦
  lucky: string; // 幸運小物
  match: string; // 速配夥伴
}

export const CREATURES: Creature[] = [
  {
    id: 'aries', sign: '牡羊座', signEn: 'Aries', date: '3/21 – 4/19',
    element: 'fire', quality: 'cardinal', variant: 'sheep',
    name: '蜜桃棉花羊', title: '衝第一的毛毛球',
    body: '#FFD1B3', belly: '#FFF3E9', accent: '#FF9E7D',
    line: '「衝衝衝…咦？要往哪邊衝？」',
    personality: '你是第一個舉手、第一個衝出教室的小勇者！雖然偶爾會忘記要去哪裡，但那股熱熱的勇氣總會把大家一起帶著跑。',
    superpower: '三秒鐘交到新朋友', lucky: '一顆紅紅的軟糖', match: '汽水瓶小水獺',
  },
  {
    id: 'taurus', sign: '金牛座', signEn: 'Taurus', date: '4/20 – 5/20',
    element: 'earth', quality: 'fixed', variant: 'cow',
    name: '可可布丁牛', title: '角落裡的甜點守護者',
    body: '#E4CBB4', belly: '#FAF0E6', accent: '#A87B57',
    line: '「這個布丁…我要慢慢吃。」',
    personality: '你最喜歡溫暖、柔軟、好吃的東西。做事慢慢來但超級認真，答應過的事情一定會做到，是大家最安心的靠枕。',
    superpower: '把小房間佈置得超舒服', lucky: '一條小毛毯', match: '薄荷豆芽兔',
  },
  {
    id: 'gemini', sign: '雙子座', signEn: 'Gemini', date: '5/21 – 6/21',
    element: 'air', quality: 'mutable', variant: 'cloud',
    name: '雙子棉花雲', title: '兩顆頭一起想事情',
    body: '#BBDDF7', belly: '#F0F8FE', accent: '#FFC2D4',
    line: '「左邊說好，右邊說再想一下！」',
    personality: '你的腦袋裡有一百個好點子，講話像小鈴鐺一樣叮叮噹噹。今天想當太空人、明天想當甜點師，每天都好好玩。',
    superpower: '講故事讓全班笑出來', lucky: '一支彩色筆', match: '蜜桃棉花羊',
  },
  {
    id: 'cancer', sign: '巨蟹座', signEn: 'Cancer', date: '6/22 – 7/22',
    element: 'water', quality: 'cardinal', variant: 'crab',
    name: '奶泡泡小螃蟹', title: '橫著走也要保護大家',
    body: '#FFC2D4', belly: '#FFF0F5', accent: '#E0708F',
    line: '「別怕，躲到我的殼後面來。」',
    personality: '你心軟又溫柔，看到朋友哭會第一個跑過去。雖然自己害羞得想躲進角落，但保護別人的時候超級勇敢。',
    superpower: '記得每個人的生日', lucky: '一個小貝殼', match: '薰衣草麻糬魚',
  },
  {
    id: 'leo', sign: '獅子座', signEn: 'Leo', date: '7/23 – 8/22',
    element: 'fire', quality: 'fixed', variant: 'lion',
    name: '奶油炸蝦獅', title: '蓬蓬鬃毛小明星',
    body: '#FFE9A8', belly: '#FFF9E4', accent: '#E0A23C',
    line: '「看我！……好啦不要看太久。」',
    personality: '你亮亮的像小太陽，喜歡表演也喜歡被稱讚。心地很大方，有好吃的一定會分一半給朋友。',
    superpower: '把氣氛炒得超熱鬧', lucky: '一頂金色小皇冠', match: '櫻花天秤企鵝',
  },
  {
    id: 'virgo', sign: '處女座', signEn: 'Virgo', date: '8/23 – 9/22',
    element: 'earth', quality: 'mutable', variant: 'bunny',
    name: '薄荷豆芽兔', title: '整理達人小耳朵',
    body: '#B8E6D2', belly: '#EBF9F3', accent: '#4FA98A',
    line: '「這裡…歪了 0.5 公分喔。」',
    personality: '你觀察力超強，連橡皮擦屑都要排整齊。對自己很嚴格，其實是因為想把每件事都做到最好。',
    superpower: '找到所有人弄丟的東西', lucky: '一塊乾淨的小手帕', match: '可可布丁牛',
  },
  {
    id: 'libra', sign: '天秤座', signEn: 'Libra', date: '9/23 – 10/23',
    element: 'air', quality: 'cardinal', variant: 'penguin',
    name: '櫻花天秤企鵝', title: '公平分蛋糕的和事佬',
    body: '#EFEAE4', belly: '#FFFDFB', accent: '#FFC2D4',
    line: '「一人一半，這樣才公平～」',
    personality: '你最討厭吵架，總是想辦法讓大家都開心。很會搭配顏色，選的衣服跟畫的圖都特別好看。',
    superpower: '一秒鐘化解爭吵', lucky: '一面小鏡子', match: '奶油炸蝦獅',
  },
  {
    id: 'scorpio', sign: '天蠍座', signEn: 'Scorpio', date: '10/24 – 11/22',
    element: 'water', quality: 'fixed', variant: 'grape',
    name: '葡萄布丁蠍', title: '藏著秘密的神秘小尾巴',
    body: '#D8CCF5', belly: '#F3EFFE', accent: '#8674C9',
    line: '「這是秘密…只告訴你一個人。」',
    personality: '你安安靜靜卻什麼都看在眼裡，一旦認定的朋友就會守護到底。心裡藏著一座只有自己知道的小宇宙。',
    superpower: '一直記得最重要的約定', lucky: '一把小鑰匙', match: '奶泡泡小螃蟹',
  },
  {
    id: 'sagittarius', sign: '射手座', signEn: 'Sagittarius', date: '11/23 – 12/21',
    element: 'fire', quality: 'mutable', variant: 'pony',
    name: '菠蘿麵包小馬', title: '想去更遠地方的旅行家',
    body: '#FFE9A8', belly: '#FFF6DC', accent: '#E08A54',
    line: '「前面那個轉角有什麼呀？」',
    personality: '你像小風一樣停不下來，對世界充滿好奇。心直口快又愛笑，走到哪裡都能撿到新朋友。',
    superpower: '發現別人沒注意到的風景', lucky: '一張小地圖', match: '雙子棉花雲',
  },
  {
    id: 'capricorn', sign: '摩羯座', signEn: 'Capricorn', date: '12/22 – 1/19',
    element: 'earth', quality: 'cardinal', variant: 'goat',
    name: '可可仙貝山羊', title: '一步一步爬上山頂',
    body: '#E4CBB4', belly: '#F8F0E8', accent: '#7D6250',
    line: '「再一步…再一步就到了。」',
    personality: '你看起來慢慢的，其實心裡有一張很大的計畫表。不喊累、不放棄，最後總是你先站上山頂。',
    superpower: '堅持到最後一秒', lucky: '一個小鬧鐘', match: '汽水瓶小水獺',
  },
  {
    id: 'aquarius', sign: '水瓶座', signEn: 'Aquarius', date: '1/20 – 2/18',
    element: 'air', quality: 'fixed', variant: 'otter',
    name: '汽水瓶小水獺', title: '腦袋冒泡泡的發明家',
    body: '#B8E6D2', belly: '#EDF9F4', accent: '#4E93C4',
    line: '「我剛剛想到一個超奇怪的點子！」',
    personality: '你的想法總是跟別人不一樣，而且你一點都不介意。喜歡自由自在，也會替被欺負的小夥伴說話。',
    superpower: '想出沒人想過的玩法', lucky: '一顆會冒泡的彈珠', match: '可可仙貝山羊',
  },
  {
    id: 'pisces', sign: '雙魚座', signEn: 'Pisces', date: '2/19 – 3/20',
    element: 'water', quality: 'mutable', variant: 'fish',
    name: '薰衣草麻糬魚', title: '住在雲朵水池裡的夢遊者',
    body: '#D8CCF5', belly: '#F5F1FE', accent: '#BBDDF7',
    line: '「剛剛…我又發呆了對不對？」',
    personality: '你很會做夢也很會畫畫，心軟到看卡通都會哭。你的溫柔像水一樣，悄悄包住每一個難過的人。',
    superpower: '安慰別人的超能力', lucky: '一個小泡泡', match: '奶泡泡小螃蟹',
  },
];

export const byId = (id: string) => CREATURES.find((c) => c.id === id)!;
