import { forwardRef } from 'react';
import { CreatureArt } from './Creature';
import type { MatchResult } from '../lib/match';
import { ELEMENT_EMOJI } from '../lib/match';
import { ROLE_SHORT, type PastelColor } from '../data/palette';

interface Props {
  result: MatchResult;
  colors: PastelColor[];
  nickname: string;
}

/** 可儲存 / 分享的圖卡（固定 1:1.25 比例，適合 IG 限動與 WhatsApp） */
export const ResultCard = forwardRef<HTMLDivElement, Props>(function ResultCard(
  { result, colors, nickname },
  ref,
) {
  const c = result.creature;
  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-[360px] overflow-hidden rounded-[32px] p-5 text-center"
      style={{
        background: `linear-gradient(160deg, ${colors[0].soft} 0%, ${colors[1].soft} 55%, ${colors[2].soft} 100%)`,
        boxShadow: '0 18px 40px -18px rgba(180,140,120,.55)',
        border: '3px solid rgba(255,255,255,.9)',
      }}
    >
      {/* 背景圓點 */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full" style={{ background: colors[2].hex, opacity: 0.35 }} />
        <div className="absolute -right-10 top-24 h-24 w-24 rounded-full" style={{ background: colors[1].hex, opacity: 0.35 }} />
        <div className="absolute -bottom-10 left-10 h-28 w-28 rounded-full" style={{ background: colors[0].hex, opacity: 0.3 }} />
      </div>

      <div className="relative">
        <div className="inline-block rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold tracking-wide text-amber-700">
          ✨ 我的角落星座小夥伴 ✨
        </div>

        <div className="mt-1 flex justify-center">
          <CreatureArt c={c} ribbon={colors[2].hex} size={200} />
        </div>

        <div className="mt-1 text-[13px] font-bold text-amber-700/80">
          {c.sign}・{c.date}
        </div>
        <h2 className="text-[26px] font-black leading-tight text-[#5C4437]">{c.name}</h2>
        <div className="text-[13px] font-semibold text-[#8A6E5C]">{c.title}</div>

        <div className="mx-auto mt-3 max-w-[300px] rounded-2xl bg-white/85 px-4 py-3 text-left">
          <p className="text-[12.5px] font-bold text-[#7C5F4E]">{c.line}</p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#6B5546]">{c.personality}</p>
        </div>

        {/* 顏色組合 */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {colors.map((col, i) => (
            <div key={col.id} className="flex flex-col items-center gap-1">
              <div
                className="h-10 w-10 rounded-full border-[3px] border-white"
                style={{ background: col.hex, boxShadow: '0 4px 10px -4px rgba(0,0,0,.3)' }}
              />
              <span className="text-[9px] font-bold text-[#8A6E5C]">{ROLE_SHORT[i]}</span>
              <span className="text-[10px] font-bold text-[#6B5546]">{col.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap justify-center gap-1.5 text-[10.5px] font-bold">
          <Chip>{ELEMENT_EMOJI[result.element]} {result.elementLabel}</Chip>
          <Chip>🎁 幸運小物：{c.lucky}</Chip>
          <Chip>💞 速配：{c.match}</Chip>
        </div>

        <div className="mt-3 text-[10px] font-semibold text-[#9C8375]">
          {nickname ? `${nickname} 的專屬結果 · ` : ''}角落星座顏色小遊戲
        </div>
      </div>
    </div>
  );
});

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/80 px-2.5 py-1 text-[#7C5F4E]">{children}</span>
  );
}
