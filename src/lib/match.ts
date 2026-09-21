import { CREATURES, type Creature } from '../data/characters';
import { colorById, type Element, type Quality } from '../data/palette';

/** ------------------------------------------------------------------
 *  顏色 → 星座角色 對應邏輯
 *  ------------------------------------------------------------------
 *  Step 1  元素得分：主色 ×3、輔色 ×2、點綴色 ×1 加權四元素向量
 *  Step 2  取最高分元素 → 鎖定 3 個候選星座（火/土/風/水各 3 個）
 *  Step 3  三態判定：主色 ×2 + 輔色 ×1.5 + 點綴色 ×1 投票
 *          （cardinal 開創 / fixed 固定 / mutable 變動）
 *  Step 4  元素 × 三態 → 唯一對應 1 個星座角色
 *  → 完全可解釋、可重現，同樣的顏色順序永遠得到同樣的夥伴
 *  ------------------------------------------------------------------ */

const ELEMENT_LABEL: Record<Element, string> = {
  fire: '火系・熱情',
  earth: '土系・穩重',
  air: '風系・靈活',
  water: '水系・溫柔',
};

const QUALITY_LABEL: Record<Quality, string> = {
  cardinal: '開創型・想第一個出發',
  fixed: '固定型・認定了就不放手',
  mutable: '變動型・像風一樣自由',
};

const WEIGHT = [3, 2, 1];
const Q_WEIGHT = [2, 1.5, 1];

export interface MatchResult {
  creature: Creature;
  element: Element;
  quality: Quality;
  elementLabel: string;
  qualityLabel: string;
  elementScores: { key: Element; label: string; value: number; pct: number }[];
}

export function matchCreature(colorIds: string[]): MatchResult {
  const colors = colorIds.map(colorById);

  // Step 1 元素加權
  const el: Record<Element, number> = { fire: 0, earth: 0, air: 0, water: 0 };
  colors.forEach((c, i) => {
    (Object.keys(el) as Element[]).forEach((k) => {
      el[k] += c.element[k] * WEIGHT[i];
    });
  });

  // Step 2 最高元素（平手時以主色的最強元素為準）
  const entries = (Object.keys(el) as Element[]).map((k) => ({ k, v: el[k] }));
  entries.sort((a, b) => b.v - a.v);
  let element = entries[0].k;
  if (Math.abs(entries[0].v - entries[1].v) < 0.001) {
    const main = colors[0].element;
    element = main[entries[0].k] >= main[entries[1].k] ? entries[0].k : entries[1].k;
  }

  // Step 3 三態投票
  const q: Record<Quality, number> = { cardinal: 0, fixed: 0, mutable: 0 };
  colors.forEach((c, i) => {
    q[c.quality] += Q_WEIGHT[i];
  });
  const qEntries = (Object.keys(q) as Quality[]).map((k) => ({ k, v: q[k] }));
  qEntries.sort((a, b) => b.v - a.v);
  let quality = qEntries[0].k;
  if (Math.abs(qEntries[0].v - qEntries[1].v) < 0.001) quality = colors[0].quality;

  // Step 4 唯一對應
  const creature =
    CREATURES.find((c) => c.element === element && c.quality === quality) ?? CREATURES[0];

  const total = entries.reduce((s, e) => s + e.v, 0) || 1;
  const elementScores = (['fire', 'earth', 'air', 'water'] as Element[]).map((k) => ({
    key: k,
    label: ELEMENT_LABEL[k],
    value: Number(el[k].toFixed(2)),
    pct: Math.round((el[k] / total) * 100),
  }));

  return {
    creature,
    element,
    quality,
    elementLabel: ELEMENT_LABEL[element],
    qualityLabel: QUALITY_LABEL[quality],
    elementScores,
  };
}

export const ELEMENT_EMOJI: Record<Element, string> = {
  fire: '🔥', earth: '🌱', air: '🌬️', water: '💧',
};
