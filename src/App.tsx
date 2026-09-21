import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { PALETTE, ROLE_LABEL, ROLE_SHORT, colorById } from './data/palette';
import { matchCreature } from './lib/match';
import { REPORT_TO, sendReport, type SendStatus } from './lib/mailer';
import { CreatureArt } from './components/Creature';
import { ResultCard } from './components/ResultCard';
import { ShareBar } from './components/ShareBar';
import { EmailSetup, Gallery, LogicDoc, Modal } from './components/Panels';

type Screen = 'intro' | 'pick' | 'loading' | 'result';

/* 可愛小音效（Web Audio，不需音檔） */
let actx: AudioContext | null = null;
function blip(freq = 660, dur = 0.12, type: OscillatorType = 'sine') {
  try {
    if (!actx) actx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (actx.state === 'suspended') void actx.resume();
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.16, actx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
    o.connect(g).connect(actx.destination);
    o.start(); o.stop(actx.currentTime + dur + 0.02);
  } catch { /* ignore */ }
}
const fanfare = () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => blip(f, 0.22, 'triangle'), i * 130));

export default function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [picked, setPicked] = useState<string[]>([]);
  const [nickname, setNickname] = useState('');
  const [modal, setModal] = useState<null | 'gallery' | 'logic' | 'email'>(null);
  const [mail, setMail] = useState<{ status: SendStatus; detail: string; params?: any }>({ status: 'idle', detail: '' });
  const [saving, setSaving] = useState(false);
  const [bubbles, setBubbles] = useState<{ id: number; x: number; emoji: string }[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const result = useMemo(() => (picked.length === 3 ? matchCreature(picked) : null), [picked]);
  const colors = picked.map(colorById);

  /* 選色 */
  const pick = (id: string) => {
    if (picked.length >= 3 || picked.includes(id)) return;
    const next = [...picked, id];
    setPicked(next);
    blip(560 + next.length * 140, 0.14, 'triangle');
    const c = colorById(id);
    setBubbles((b) => [...b, { id: Date.now(), x: 10 + Math.random() * 80, emoji: c.emoji }]);
    if (next.length === 3) setTimeout(() => setScreen('loading'), 420);
  };

  const undo = () => { setPicked((p) => p.slice(0, -1)); blip(320, 0.1, 'sine'); };

  const restart = () => {
    setPicked([]); setMail({ status: 'idle', detail: '' }); setScreen('pick'); blip(480, 0.1);
  };

  /* 轉場動畫 → 結果 + 自動寄信 */
  useEffect(() => {
    if (screen !== 'loading' || !result) return;
    const t = setTimeout(() => {
      setScreen('result');
      fanfare();
      setMail({ status: 'sending', detail: '正在把報告寄給大朋友…' });
      void sendReport({
        nickname,
        colorNames: colors.map((c) => c.name),
        colorHex: colors.map((c) => c.hex),
        characterName: result.creature.name,
        signName: result.creature.sign,
        elementLabel: result.elementLabel,
        qualityLabel: result.qualityLabel,
      }).then(setMail);
    }, 2300);
    return () => clearTimeout(t);
  }, [screen]); // eslint-disable-line react-hooks/exhaustive-deps

  /* 泡泡清理 */
  useEffect(() => {
    if (!bubbles.length) return;
    const t = setTimeout(() => setBubbles((b) => b.slice(1)), 2400);
    return () => clearTimeout(t);
  }, [bubbles]);

  /* 圖卡輸出 */
  const makePng = useCallback(async () => {
    if (!cardRef.current) return null;
    return toPng(cardRef.current, { pixelRatio: 2.5, cacheBust: true, skipFonts: true });
  }, []);

  const saveImage = async () => {
    setSaving(true);
    try {
      const url = await makePng();
      if (!url) return;
      const a = document.createElement('a');
      a.href = url;
      a.download = `我的角落星座小夥伴-${result?.creature.name ?? ''}.png`;
      a.click();
    } finally { setSaving(false); }
  };

  const shareImage = async () => {
    setSaving(true);
    try {
      const url = await makePng();
      if (!url) return;
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], 'sumikko-zodiac.png', { type: 'image/png' });
      const text = `我是「${result?.creature.name}」🌟 你也來測測看自己的角落星座小夥伴！`;
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text, title: '角落星座顏色小遊戲' });
      } else if (navigator.share) {
        await navigator.share({ text, url: location.href, title: '角落星座顏色小遊戲' });
      } else {
        const a = document.createElement('a');
        a.href = url; a.download = 'sumikko-zodiac.png'; a.click();
      }
    } catch { /* 使用者取消 */ } finally { setSaving(false); }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* 背景 */}
      <div className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: 'linear-gradient(170deg,#FFF3F7 0%,#FFF9EC 40%,#EFF9F4 75%,#F1F4FE 100%)' }} />
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-60">
        <div className="bg-drift absolute -left-16 top-10 h-52 w-52 rounded-full bg-[#FFD9E6] blur-3xl" />
        <div className="bg-drift absolute -right-20 top-52 h-60 w-60 rounded-full bg-[#CFE9FB] blur-3xl" style={{ animationDelay: '2s' }} />
        <div className="bg-drift absolute bottom-10 left-8 h-56 w-56 rounded-full bg-[#DFF4E8] blur-3xl" style={{ animationDelay: '4s' }} />
      </div>

      {/* 浮出的小泡泡 */}
      <div className="pointer-events-none fixed inset-0 z-40">
        {bubbles.map((b) => (
          <span key={b.id} className="float-up absolute bottom-40 text-3xl" style={{ left: `${b.x}%` }}>{b.emoji}</span>
        ))}
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col px-4 pb-8 pt-5">
        {/* Header */}
        <header className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-black leading-tight text-[#5C4437]">
              角落星座 <span className="text-[#E0708F]">顏色小遊戲</span>
            </h1>
            <p className="text-[11px] font-bold text-[#A08A7A]">選 3 個喜歡的顏色，找到你的可愛小夥伴 🌈</p>
          </div>
          <button onClick={() => setModal('gallery')}
            className="squish rounded-full bg-white/80 px-3 py-2 text-[11px] font-black text-[#8A6E5C] shadow-sm">
            圖鑑<br />12隻
          </button>
        </header>

        {/* ---------- 開始畫面 ---------- */}
        {screen === 'intro' && (
          <div className="fade-up flex flex-1 flex-col items-center justify-center text-center">
            <div className="flex -space-x-6">
              <CreatureArt c={CREATURE_SAMPLES[0]} size={112} />
              <CreatureArt c={CREATURE_SAMPLES[1]} size={132} />
              <CreatureArt c={CREATURE_SAMPLES[2]} size={112} />
            </div>
            <div className="mt-4 rounded-[28px] border-2 border-white bg-white/80 p-5 shadow-lg shadow-pink-100">
              <h2 className="text-[19px] font-black text-[#5C4437]">你是哪一隻角落小夥伴呢？</h2>
              <p className="mt-2 text-[12.5px] leading-relaxed text-[#7C6153]">
                只要依序點選 <b>3 個最喜歡的顏色</b>，<br />
                我們就會找出躲在角落裡、<br />
                跟你個性最像的星座小夥伴 💕
              </p>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value.slice(0, 12))}
                placeholder="想先告訴我你的名字嗎？（可跳過）"
                className="mt-3 w-full rounded-2xl border-2 border-[#F4E1D4] bg-white px-3 py-2.5 text-center text-[13px] outline-none focus:border-[#FFC2D4]"
              />
              <button onClick={() => { setScreen('pick'); blip(700, 0.15, 'triangle'); }}
                className="squish mt-3 w-full rounded-full bg-gradient-to-r from-[#FFC2D4] to-[#FFD1B3] py-3.5 text-[16px] font-black text-white shadow-lg shadow-pink-200">
                開始玩 ✨
              </button>
            </div>
            <div className="mt-3 flex gap-2 text-[11px] font-bold">
              <button onClick={() => setModal('logic')} className="squish rounded-full bg-white/80 px-3 py-2 text-[#8A6E5C]">🎨 對應邏輯</button>
              <button onClick={() => setModal('email')} className="squish rounded-full bg-white/80 px-3 py-2 text-[#8A6E5C]">📮 Email 設定</button>
            </div>
          </div>
        )}

        {/* ---------- 選色畫面 ---------- */}
        {screen === 'pick' && (
          <div className="fade-up flex flex-1 flex-col">
            {/* 進度 */}
            <div className="mb-3 flex items-center justify-center gap-2">
              {[0, 1, 2].map((i) => {
                const c = picked[i] ? colorById(picked[i]) : null;
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-full border-[3px] text-xl transition-all ${
                      c ? 'wiggle border-white' : 'border-dashed border-[#E8D5C8] bg-white/60'}`}
                      style={c ? { background: c.hex, boxShadow: '0 6px 14px -6px rgba(0,0,0,.35)' } : {}}>
                      {c ? c.emoji : <span className="text-[11px] font-black text-[#C8B2A2]">{i + 1}</span>}
                    </div>
                    <span className="mt-1 text-[10px] font-black text-[#A08A7A]">{ROLE_SHORT[i]}</span>
                  </div>
                );
              })}
            </div>

            <div className="mb-2 text-center">
              <div className="inline-block rounded-full bg-white/80 px-4 py-1.5 text-[12.5px] font-black text-[#7C6153]">
                {picked.length < 3 ? `請選你的${ROLE_LABEL[picked.length]}` : '完成囉！'}
              </div>
            </div>

            {/* 色票 */}
            <div className="grid grid-cols-2 gap-3">
              {PALETTE.map((c) => {
                const used = picked.includes(c.id);
                const order = picked.indexOf(c.id) + 1;
                return (
                  <button key={c.id} onClick={() => pick(c.id)} disabled={used}
                    className="squish relative overflow-hidden rounded-[26px] border-[3px] border-white p-3 text-left shadow-md disabled:opacity-45"
                    style={{ background: c.hex }}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{c.emoji}</span>
                      <div>
                        <div className="text-[14px] font-black" style={{ color: c.deep }}>{c.name}</div>
                        <div className="text-[10px] font-bold leading-tight" style={{ color: c.deep, opacity: 0.85 }}>{c.taste}</div>
                      </div>
                    </div>
                    {used && (
                      <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-black" style={{ color: c.deep }}>
                        {order}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={undo} disabled={!picked.length}
                className="squish flex-1 rounded-2xl bg-white/80 py-3 text-[13px] font-black text-[#8A6E5C] disabled:opacity-40">↩︎ 上一步</button>
              <button onClick={() => { setPicked([]); blip(360, 0.1); }}
                className="squish flex-1 rounded-2xl bg-white/80 py-3 text-[13px] font-black text-[#8A6E5C]">🔄 全部重選</button>
            </div>
          </div>
        )}

        {/* ---------- 轉場動畫 ---------- */}
        {screen === 'loading' && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="relative flex h-44 w-44 items-center justify-center">
              <div className="spin-slow absolute inset-0 rounded-full border-[6px] border-dashed"
                style={{ borderColor: colors[0]?.hex ?? '#FFC2D4' }} />
              <div className="flex gap-1 text-4xl">
                {colors.map((c, i) => (
                  <span key={c.id} className="creature-bob" style={{ animationDelay: `${i * 0.2}s` }}>{c.emoji}</span>
                ))}
              </div>
            </div>
            <p className="mt-6 text-[16px] font-black text-[#5C4437]">正在角落裡尋找你的小夥伴…</p>
            <p className="mt-1 text-[12px] font-bold text-[#A08A7A]">
              {colors.map((c) => c.name).join(' ＋ ')}
            </p>
            <div className="mt-4 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#FFC2D4]" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* ---------- 結果 ---------- */}
        {screen === 'result' && result && (
          <div className="pop-in flex-1 space-y-4">
            <ResultCard ref={cardRef} result={result} colors={colors} nickname={nickname} />

            {/* 詳細說明 */}
            <div className="rounded-[26px] border-2 border-white bg-white/80 p-4 text-[12.5px] leading-relaxed text-[#6B5546]">
              <Row k="🎨 顏色組合" v={colors.map((c) => c.name).join(' ＋ ')} />
              <Row k="🔮 元素屬性" v={`${result.elementLabel}　${result.qualityLabel}`} />
              <Row k="💪 小天賦" v={result.creature.superpower} />
              <Row k="🎁 幸運小物" v={result.creature.lucky} />
              <Row k="💞 速配夥伴" v={result.creature.match} />
              <div className="mt-2 flex gap-1.5">
                {result.elementScores.map((e) => (
                  <div key={e.key} className="flex-1 text-center">
                    <div className="h-14 w-full overflow-hidden rounded-xl bg-[#F6EDE6]">
                      <div className="mt-auto h-full w-full origin-bottom rounded-xl bg-[#FFC2D4]"
                        style={{ transform: `scaleY(${Math.max(0.08, e.pct / 60)})`, transformOrigin: 'bottom' }} />
                    </div>
                    <div className="mt-1 text-[10px] font-black text-[#8A6E5C]">{e.label.split('・')[0]}</div>
                    <div className="text-[10px] text-[#A08A7A]">{e.pct}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 寄信狀態 */}
            <div className={`rounded-2xl p-3 text-[12px] font-bold ${
              mail.status === 'sent' ? 'bg-[#E4F6EE] text-[#3F8E74]'
              : mail.status === 'error' ? 'bg-[#FFE8EF] text-[#D0607F]'
              : 'bg-[#FFF3E9] text-[#C98A4B]'}`}>
              {mail.status === 'sending' && '📮 正在寄出報告…'}
              {mail.status !== 'sending' && mail.detail}
              {mail.status === 'demo' && (
                <button onClick={() => setModal('email')} className="ml-1 underline">前往設定 EmailJS</button>
              )}
              {mail.params && (
                <details className="mt-1.5 font-normal">
                  <summary className="cursor-pointer text-[11px]">查看寄給 {REPORT_TO} 的內容</summary>
                  <pre className="no-bar mt-1 overflow-x-auto whitespace-pre-wrap rounded-xl bg-white/70 p-2 text-[10.5px] text-[#6B5546]">
                    {mail.params.message}
                  </pre>
                </details>
              )}
            </div>

            <ShareBar
              shareText={`我是「${result.creature.name}」${result.creature.title}🌟 快來測測你的角落星座小夥伴！`}
              onSaveImage={saveImage}
              onShareImage={shareImage}
              saving={saving}
            />

            <button onClick={restart}
              className="squish w-full rounded-full bg-gradient-to-r from-[#B8E6D2] to-[#BBDDF7] py-3.5 text-[15px] font-black text-white shadow-lg shadow-cyan-100">
              🔁 重新測驗
            </button>

            <div className="flex gap-2 text-[11px] font-bold">
              <button onClick={() => setModal('gallery')} className="squish flex-1 rounded-2xl bg-white/80 py-2.5 text-[#8A6E5C]">📖 看全部 12 隻</button>
              <button onClick={() => setModal('logic')} className="squish flex-1 rounded-2xl bg-white/80 py-2.5 text-[#8A6E5C]">🎨 對應邏輯</button>
            </div>
          </div>
        )}

        <footer className="mt-6 text-center text-[10px] font-bold text-[#BCA899]">
          角落星座顏色小遊戲 · 測驗報告會自動寄到 {REPORT_TO}
        </footer>
      </div>

      <Modal open={modal === 'gallery'} onClose={() => setModal(null)} title="角落星座圖鑑・12 隻"><Gallery /></Modal>
      <Modal open={modal === 'logic'} onClose={() => setModal(null)} title="顏色 → 星座 對應邏輯"><LogicDoc /></Modal>
      <Modal open={modal === 'email'} onClose={() => setModal(null)} title="EmailJS 自動寄信設定">
        <EmailSetup onSaved={() => setModal(null)} />
      </Modal>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2 border-b border-dashed border-[#F1E2D8] py-1.5 last:border-0">
      <span className="w-[86px] shrink-0 font-black text-[#8A6E5C]">{k}</span>
      <span className="flex-1">{v}</span>
    </div>
  );
}

import { CREATURES } from './data/characters';
const CREATURE_SAMPLES = [CREATURES[4], CREATURES[0], CREATURES[11]];
