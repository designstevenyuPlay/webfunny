import { useState } from 'react';

interface Props {
  shareText: string;
  onSaveImage: () => void;
  onShareImage: () => void;
  saving: boolean;
}

/** 底部社群分享列：WhatsApp / Facebook / Threads / 複製連結 */
export function ShareBar({ shareText, onSaveImage, onShareImage, saving }: Props) {
  const [copied, setCopied] = useState(false);
  const url = typeof location !== 'undefined' ? location.href : '';
  const enc = encodeURIComponent(`${shareText}\n${url}`);

  const links = [
    { k: 'wa', label: 'WhatsApp', emoji: '💬', bg: '#DCF8C6', href: `https://wa.me/?text=${enc}` },
    { k: 'fb', label: 'Facebook', emoji: '📘', bg: '#DEE9FB', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { k: 'th', label: 'Threads', emoji: '🧵', bg: '#EFEAE4', href: `https://www.threads.net/intent/post?text=${enc}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${url}`);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = `${shareText}\n${url}`;
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        <button onClick={onSaveImage} disabled={saving}
          className="squish rounded-2xl bg-[#FFE9A8] py-3 text-[13px] font-black text-[#8A6438] shadow-md shadow-amber-100 disabled:opacity-60">
          {saving ? '產生中…' : '🖼️ 儲存圖卡'}
        </button>
        <button onClick={onShareImage} disabled={saving}
          className="squish rounded-2xl bg-[#D8CCF5] py-3 text-[13px] font-black text-[#5E4C9A] shadow-md shadow-violet-100 disabled:opacity-60">
          📤 分享圖卡
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {links.map((l) => (
          <a key={l.k} href={l.href} target="_blank" rel="noreferrer"
            className="squish flex flex-col items-center gap-0.5 rounded-2xl py-2.5 text-[11px] font-black text-[#6B5546]"
            style={{ background: l.bg }}>
            <span className="text-lg">{l.emoji}</span>{l.label}
          </a>
        ))}
      </div>

      <button onClick={copy}
        className="squish w-full rounded-2xl border-2 border-dashed border-[#FFC2D4] bg-white py-2.5 text-[12.5px] font-black text-[#E0708F]">
        {copied ? '已複製連結！快貼給好朋友 💌' : '🔗 一鍵複製遊戲連結'}
      </button>

      <p className="px-2 text-center text-[11px] leading-relaxed text-[#9C8375]">
        IG 限動玩法：先按「儲存圖卡」下載圖片 → 開 Instagram 限時動態 → 上傳圖片並貼上連結貼紙，
        就可以邀請朋友一起測囉！
      </p>
    </div>
  );
}
