import type { Creature as C } from '../data/characters';

/** 角落生物風可愛小怪物：共用「圓滾滾蛋形身體」＋各星座專屬配件 */
export function CreatureArt({
  c,
  ribbon,
  size = 200,
  animate = true,
}: {
  c: C;
  ribbon?: string;
  size?: number;
  animate?: boolean;
}) {
  const { body, belly, accent } = c;
  const line = 'rgba(120,96,80,0.55)';

  const parts = VARIANTS[c.variant]({ body, belly, accent });

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={animate ? 'creature-bob' : undefined}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id={`g-${c.id}`} cx="35%" cy="28%">
          <stop offset="0%" stopColor="#fff" stopOpacity=".75" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 影子 */}
      <ellipse cx="100" cy="182" rx="52" ry="9" fill="rgba(0,0,0,.07)" />

      {parts.behind}

      {/* 身體 */}
      <path
        d="M100 20C146 20 172 54 172 100c0 48-28 74-72 74S28 148 28 100C28 54 54 20 100 20Z"
        fill={body}
        stroke={line}
        strokeWidth="2.5"
      />
      <path
        d="M100 20C146 20 172 54 172 100c0 48-28 74-72 74S28 148 28 100C28 54 54 20 100 20Z"
        fill={`url(#g-${c.id})`}
      />
      {/* 肚子 */}
      <ellipse cx="100" cy="126" rx="40" ry="31" fill={belly} opacity=".9" />

      {parts.front}

      {/* 眼睛 */}
      <ellipse cx="79" cy="99" rx="6.2" ry="7" fill="#4A3B33" />
      <ellipse cx="121" cy="99" rx="6.2" ry="7" fill="#4A3B33" />
      <circle cx="81" cy="96" r="2.1" fill="#fff" />
      <circle cx="123" cy="96" r="2.1" fill="#fff" />
      {/* 腮紅 */}
      <ellipse cx="62" cy="116" rx="11" ry="7" fill={accent} opacity=".5" />
      <ellipse cx="138" cy="116" rx="11" ry="7" fill={accent} opacity=".5" />
      {/* 小嘴 */}
      <path d="M93 114q7 8 14 0" fill="none" stroke="#4A3B33" strokeWidth="2.4" strokeLinecap="round" />

      {/* 使用者點綴色小蝴蝶結 */}
      {ribbon && (
        <g transform="translate(150 52) rotate(14)">
          <path d="M0 0 -16 -9 -16 9Z" fill={ribbon} stroke={line} strokeWidth="2" strokeLinejoin="round" />
          <path d="M0 0 16 -9 16 9Z" fill={ribbon} stroke={line} strokeWidth="2" strokeLinejoin="round" />
          <circle cx="0" cy="0" r="4.5" fill={ribbon} stroke={line} strokeWidth="2" />
        </g>
      )}

      {/* 閃亮亮 */}
      <g className={animate ? 'creature-twinkle' : undefined} fill="#fff">
        <Star x={24} y={54} r={5} />
        <Star x={178} y={118} r={4} />
        <Star x={44} y={158} r={3.4} />
      </g>
    </svg>
  );
}

function Star({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <path
      d={`M${x} ${y - r} Q${x + r * 0.22} ${y - r * 0.22} ${x + r} ${y} Q${x + r * 0.22} ${y + r * 0.22} ${x} ${y + r} Q${x - r * 0.22} ${y + r * 0.22} ${x - r} ${y} Q${x - r * 0.22} ${y - r * 0.22} ${x} ${y - r}Z`}
      opacity=".9"
    />
  );
}

type P = { body: string; belly: string; accent: string };
type Parts = { behind?: React.ReactNode; front?: React.ReactNode };
const L = 'rgba(120,96,80,0.55)';
const sw = 2.5;

const VARIANTS: Record<string, (p: P) => Parts> = {
  /* 牡羊・棉花羊：捲捲角 + 蓬鬆瀏海 */
  sheep: ({ body, accent }) => ({
    behind: (
      <g stroke={L} strokeWidth={sw} fill={accent}>
        <path d="M40 58c-16-4-20 14-8 20s22-8 14-18" />
        <path d="M160 58c16-4 20 14 8 20s-22-8-14-18" />
      </g>
    ),
    front: (
      <g fill="#FFF8F2" stroke={L} strokeWidth="2">
        <circle cx="76" cy="54" r="15" />
        <circle cx="100" cy="45" r="17" />
        <circle cx="124" cy="54" r="15" />
        <circle cx="100" cy="62" r="14" fill={body} stroke="none" opacity=".25" />
      </g>
    ),
  }),

  /* 金牛・布丁牛：小角 + 耳朵 + 斑點 */
  cow: ({ accent }) => ({
    behind: (
      <g fill={accent} stroke={L} strokeWidth={sw}>
        <ellipse cx="40" cy="74" rx="16" ry="11" transform="rotate(-20 40 74)" />
        <ellipse cx="160" cy="74" rx="16" ry="11" transform="rotate(20 160 74)" />
        <path d="M72 34c-4-12 6-18 12-10" fill="#FFF3E6" />
        <path d="M128 34c4-12-6-18-12-10" fill="#FFF3E6" />
      </g>
    ),
    front: (
      <g fill={accent} opacity=".45">
        <ellipse cx="60" cy="70" rx="12" ry="9" />
        <ellipse cx="140" cy="148" rx="13" ry="8" />
      </g>
    ),
  }),

  /* 雙子・棉花雲：旁邊多一顆小分身 */
  cloud: ({ body, accent }) => ({
    behind: (
      <g>
        <circle cx="42" cy="86" r="30" fill={body} stroke={L} strokeWidth={sw} />
        <circle cx="34" cy="82" r="3.4" fill="#4A3B33" />
        <circle cx="50" cy="82" r="3.4" fill="#4A3B33" />
        <ellipse cx="42" cy="94" rx="7" ry="4" fill={accent} opacity=".5" />
      </g>
    ),
    front: (
      <g fill="#fff" opacity=".7">
        <circle cx="84" cy="48" r="13" />
        <circle cx="108" cy="42" r="16" />
        <circle cx="130" cy="52" r="12" />
      </g>
    ),
  }),

  /* 巨蟹・小螃蟹：螯 + 眼柄 */
  crab: ({ accent }) => ({
    behind: (
      <g fill={accent} stroke={L} strokeWidth={sw}>
        <path d="M30 118c-16 2-22 16-12 24s26 0 24-12" />
        <path d="M170 118c16 2 22 16 12 24s-26 0-24-12" />
        <path d="M78 30V16M122 30V16" strokeLinecap="round" />
        <circle cx="78" cy="12" r="7" />
        <circle cx="122" cy="12" r="7" />
      </g>
    ),
    front: <path d="M70 148h60" stroke={accent} strokeWidth="3" strokeLinecap="round" opacity=".6" />,
  }),

  /* 獅子・炸蝦獅：蓬蓬鬃毛 */
  lion: ({ accent }) => ({
    behind: (
      <g fill={accent} stroke={L} strokeWidth="2">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <circle key={i} cx={100 + Math.cos(a) * 76} cy={98 + Math.sin(a) * 76} r="17" />;
        })}
      </g>
    ),
    front: (
      <g>
        <ellipse cx="100" cy="46" rx="20" ry="10" fill="#fff" opacity=".45" />
      </g>
    ),
  }),

  /* 處女・豆芽兔：長耳朵 + 頭上小葉子 */
  bunny: ({ body, accent }) => ({
    behind: (
      <g fill={body} stroke={L} strokeWidth={sw}>
        <ellipse cx="72" cy="28" rx="13" ry="34" transform="rotate(-10 72 28)" />
        <ellipse cx="128" cy="28" rx="13" ry="34" transform="rotate(10 128 28)" />
        <ellipse cx="72" cy="30" rx="6" ry="24" fill={accent} stroke="none" opacity=".45" />
        <ellipse cx="128" cy="30" rx="6" ry="24" fill={accent} stroke="none" opacity=".45" />
      </g>
    ),
    front: <ellipse cx="100" cy="150" rx="12" ry="10" fill="#fff" opacity=".75" />,
  }),

  /* 天秤・企鵝：翅膀 + 尖嘴 */
  penguin: ({ body, accent }) => ({
    behind: (
      <g fill={body} stroke={L} strokeWidth={sw}>
        <ellipse cx="26" cy="112" rx="13" ry="30" transform="rotate(14 26 112)" />
        <ellipse cx="174" cy="112" rx="13" ry="30" transform="rotate(-14 174 112)" />
      </g>
    ),
    front: (
      <g>
        <path d="M100 104 92 116h16Z" fill={accent} stroke={L} strokeWidth="2" strokeLinejoin="round" />
        <path d="M74 44q26-18 52 0" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" opacity=".6" />
      </g>
    ),
  }),

  /* 天蠍・葡萄布丁蠍：捲尾巴 + 葡萄串 */
  grape: ({ accent }) => ({
    behind: (
      <g>
        <path d="M168 140c26 6 24 34 2 34" fill="none" stroke={accent} strokeWidth="9" strokeLinecap="round" />
        <circle cx="168" cy="172" r="9" fill={accent} stroke={L} strokeWidth="2" />
      </g>
    ),
    front: (
      <g fill={accent} stroke={L} strokeWidth="1.6">
        <circle cx="92" cy="40" r="9" />
        <circle cx="110" cy="38" r="9" />
        <circle cx="101" cy="52" r="9" />
        <path d="M101 30v-8" stroke="#7BA05B" strokeWidth="3" />
      </g>
    ),
  }),

  /* 射手・菠蘿麵包小馬：鬃毛 + 小箭 */
  pony: ({ accent }) => ({
    behind: (
      <g fill={accent} stroke={L} strokeWidth={sw}>
        <path d="M66 40c-8-16 4-26 16-18" />
        <path d="M134 40c8-16-4-26-16-18" />
        <path d="M176 126c18-8 22 10 10 18" fill="none" strokeLinecap="round" strokeWidth="8" />
      </g>
    ),
    front: (
      <g>
        <path d="M78 46q22-16 44 0" fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round" />
        <path d="M100 30v-14M94 22l6-6 6 6" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      </g>
    ),
  }),

  /* 摩羯・仙貝山羊：彎角 + 小鬍鬚 */
  goat: ({ accent, belly }) => ({
    behind: (
      <g fill="none" stroke={accent} strokeWidth="9" strokeLinecap="round">
        <path d="M70 32C50 16 34 26 36 46" />
        <path d="M130 32c20-16 36-6 34 14" />
      </g>
    ),
    front: (
      <g>
        <path d="M100 132q-8 20 0 26" fill="none" stroke={belly} strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="100" cy="158" rx="9" ry="12" fill={belly} stroke={L} strokeWidth="2" />
      </g>
    ),
  }),

  /* 水瓶・汽水水獺：圓耳 + 泡泡 */
  otter: ({ body, accent }) => ({
    behind: (
      <g fill={body} stroke={L} strokeWidth={sw}>
        <circle cx="46" cy="52" r="16" />
        <circle cx="154" cy="52" r="16" />
      </g>
    ),
    front: (
      <g fill={accent} opacity=".55">
        <circle cx="168" cy="44" r="9" />
        <circle cx="184" cy="66" r="6" />
        <circle cx="160" cy="24" r="5" />
        <ellipse cx="100" cy="128" rx="14" ry="11" fill="#fff" opacity=".8" />
      </g>
    ),
  }),

  /* 雙魚・麻糬魚：側鰭 + 尾鰭 + 背鰭 */
  fish: ({ accent }) => ({
    behind: (
      <g fill={accent} stroke={L} strokeWidth={sw} strokeLinejoin="round">
        <path d="M24 100 -2 74v54Z" transform="translate(6 0)" />
        <path d="M176 100l26-26v54Z" transform="translate(-6 0)" />
        <path d="M100 24 78 2q22-8 44 0Z" />
      </g>
    ),
    front: (
      <g fill="#fff" opacity=".6">
        <circle cx="150" cy="140" r="6" />
        <circle cx="160" cy="126" r="4" />
      </g>
    ),
  }),
};
