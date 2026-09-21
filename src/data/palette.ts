/** ------------------------------------------------------------------
 *  馬卡龍粉彩色盤（8 色）
 *  每個顏色帶有「四元素親和度」與「三態性質」，
 *  用來推導 12 星座角色（詳見 src/lib/match.ts）
 *  ------------------------------------------------------------------ */

export type Element = 'fire' | 'earth' | 'air' | 'water';
export type Quality = 'cardinal' | 'fixed' | 'mutable';

export interface PastelColor {
  id: string;
  name: string; // 繁體中文名稱
  hex: string; // 主色
  soft: string; // 淺色（卡片底）
  deep: string; // 深色（文字/描邊）
  emoji: string;
  taste: string; // 給小朋友看的可愛形容
  element: Record<Element, number>;
  quality: Quality;
}

export const PALETTE: PastelColor[] = [
  {
    id: 'pink',
    name: '櫻花粉',
    hex: '#FFC2D4',
    soft: '#FFE8EF',
    deep: '#E0708F',
    emoji: '🌸',
    taste: '像草莓牛奶一樣甜甜的',
    element: { fire: 0.2, earth: 0.1, air: 0.3, water: 0.4 },
    quality: 'mutable',
  },
  {
    id: 'cream',
    name: '奶油黃',
    hex: '#FFE9A8',
    soft: '#FFF7DD',
    deep: '#D9A93C',
    emoji: '🧈',
    taste: '像剛烤好的鬆餅香香的',
    element: { fire: 0.3, earth: 0.4, air: 0.2, water: 0.1 },
    quality: 'fixed',
  },
  {
    id: 'mint',
    name: '薄荷綠',
    hex: '#B8E6D2',
    soft: '#E4F6EE',
    deep: '#4FA98A',
    emoji: '🍃',
    taste: '像涼涼的薄荷糖',
    element: { fire: 0.1, earth: 0.35, air: 0.2, water: 0.35 },
    quality: 'fixed',
  },
  {
    id: 'sky',
    name: '天空藍',
    hex: '#BBDDF7',
    soft: '#E7F3FD',
    deep: '#4E93C4',
    emoji: '☁️',
    taste: '像午睡時的白雲',
    element: { fire: 0.1, earth: 0.1, air: 0.5, water: 0.3 },
    quality: 'mutable',
  },
  {
    id: 'lavender',
    name: '薰衣草紫',
    hex: '#D8CCF5',
    soft: '#EFEAFD',
    deep: '#8674C9',
    emoji: '💜',
    taste: '像會作夢的葡萄軟糖',
    element: { fire: 0.1, earth: 0.1, air: 0.4, water: 0.4 },
    quality: 'mutable',
  },
  {
    id: 'peach',
    name: '蜜桃橘',
    hex: '#FFD1B3',
    soft: '#FFEDE1',
    deep: '#E08A54',
    emoji: '🍑',
    taste: '像暖暖的夕陽果汁',
    element: { fire: 0.5, earth: 0.2, air: 0.2, water: 0.1 },
    quality: 'cardinal',
  },
  {
    id: 'cocoa',
    name: '可可棕',
    hex: '#E4CBB4',
    soft: '#F6EBE0',
    deep: '#A87B57',
    emoji: '🍪',
    taste: '像躲在角落的小餅乾',
    element: { fire: 0.1, earth: 0.6, air: 0.1, water: 0.2 },
    quality: 'fixed',
  },
  {
    id: 'pearl',
    name: '珍珠白',
    hex: '#EFEAE4',
    soft: '#FBF8F5',
    deep: '#9A8F86',
    emoji: '🤍',
    taste: '像軟綿綿的棉花糖',
    element: { fire: 0.15, earth: 0.2, air: 0.35, water: 0.3 },
    quality: 'cardinal',
  },
];

export const colorById = (id: string) => PALETTE.find((c) => c.id === id)!;

export const ROLE_LABEL = ['主色（最喜歡）', '輔色（第二喜歡）', '點綴色（小亮點）'];
export const ROLE_SHORT = ['主色', '輔色', '點綴色'];
