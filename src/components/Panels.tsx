import { useState } from 'react';
import { CreatureArt } from './Creature';
import { CREATURES } from '../data/characters';
import { PALETTE } from '../data/palette';
import { REPORT_TO, isConfigured, loadConfig, saveConfig, type EmailConfig } from '../lib/mailer';

/* ---------------- 通用彈窗 ---------------- */
export function Modal({
  open, onClose, title, children,
}: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#5C4437]/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}>
      <div
        className="pop-in no-bar max-h-[88vh] w-full max-w-[460px] overflow-y-auto rounded-t-[28px] bg-[#FFFBF7] p-5 shadow-2xl sm:rounded-[28px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-black text-[#5C4437]">{title}</h3>
          <button onClick={onClose}
            className="squish h-9 w-9 rounded-full bg-[#FFE8EF] text-lg font-bold text-[#E0708F]">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------------- 12 隻角色圖鑑 ---------------- */
export function Gallery() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {CREATURES.map((c) => (
        <div key={c.id} className="rounded-3xl border-2 border-white bg-white/70 p-2 text-center shadow-sm">
          <div className="flex justify-center">
            <CreatureArt c={c} size={96} animate={false} />
          </div>
          <div className="mt-1 text-[10px] font-bold text-amber-700/80">{c.sign}</div>
          <div className="text-[13px] font-black leading-tight text-[#5C4437]">{c.name}</div>
          <div className="mt-0.5 text-[10px] text-[#8A6E5C]">{c.title}</div>
          <div className="mt-1 text-[10px] leading-snug text-[#7C6153]">{c.superpower}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- 顏色對應邏輯說明 ---------------- */
export function LogicDoc() {
  return (
    <div className="space-y-3 text-[12.5px] leading-relaxed text-[#6B5546]">
      <Step n={1} t="每個顏色都有「元素個性」">
        8 個馬卡龍色各自帶有 🔥火 / 🌱土 / 🌬️風 / 💧水 的比重，例如蜜桃橘火系最強、可可棕土系最強。
      </Step>
      <div className="overflow-hidden rounded-2xl border-2 border-white bg-white/70">
        <table className="w-full text-[11px]">
          <thead className="bg-[#FFE8EF] text-[#8A6E5C]">
            <tr><th className="p-1.5 text-left">顏色</th><th>火</th><th>土</th><th>風</th><th>水</th><th className="pr-2">三態</th></tr>
          </thead>
          <tbody>
            {PALETTE.map((c) => (
              <tr key={c.id} className="border-t border-[#F4E7DE] text-center">
                <td className="p-1.5 text-left">
                  <span className="mr-1 inline-block h-3 w-3 rounded-full align-middle" style={{ background: c.hex }} />
                  {c.name}
                </td>
                <td>{c.element.fire}</td><td>{c.element.earth}</td>
                <td>{c.element.air}</td><td>{c.element.water}</td>
                <td className="pr-2 text-[10px]">
                  {c.quality === 'cardinal' ? '開創' : c.quality === 'fixed' ? '固定' : '變動'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Step n={2} t="加權計分">主色 ×3、輔色 ×2、點綴色 ×1，四元素各自加總，分數最高的就是你的元素。</Step>
      <Step n={3} t="三態投票">主色 ×2、輔色 ×1.5、點綴色 ×1 投票決定「開創 / 固定 / 變動」。</Step>
      <Step n={4} t="元素 × 三態 = 唯一星座">
        火土風水（4）× 開創固定變動（3）＝ 剛好 12 個組合，對應 12 個角落星座小夥伴，
        所以同樣的顏色順序永遠會得到同一隻夥伴，換順序就可能變成別隻喔！
      </Step>
      <div className="rounded-2xl bg-[#FFF3E9] p-3 font-mono text-[11px] text-[#8A6E5C]">
        火×開創=牡羊 / 火×固定=獅子 / 火×變動=射手<br />
        土×開創=摩羯 / 土×固定=金牛 / 土×變動=處女<br />
        風×開創=天秤 / 風×固定=水瓶 / 風×變動=雙子<br />
        水×開創=巨蟹 / 水×固定=天蠍 / 水×變動=雙魚
      </div>
    </div>
  );
}

function Step({ n, t, children }: { n: number; t: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-white bg-white/70 p-3">
      <div className="mb-1 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFC2D4] text-[11px] font-black text-white">{n}</span>
        <span className="text-[13px] font-black text-[#5C4437]">{t}</span>
      </div>
      {children}
    </div>
  );
}

/* ---------------- EmailJS 設定 + 教學 ---------------- */
export function EmailSetup({ onSaved }: { onSaved: () => void }) {
  const [cfg, setCfg] = useState<EmailConfig>(loadConfig());
  const [saved, setSaved] = useState(false);
  const ok = isConfigured(cfg);

  return (
    <div className="space-y-3 text-[12.5px] text-[#6B5546]">
      <div className={`rounded-2xl p-3 text-[12px] font-bold ${ok ? 'bg-[#E4F6EE] text-[#3F8E74]' : 'bg-[#FFF3E9] text-[#C98A4B]'}`}>
        {ok ? '✅ 已設定完成，測驗結束會自動寄出報告' : '⚠️ 目前為示範模式：填入下面 3 個欄位後就會真的寄信'}
        <div className="mt-1 font-normal">收件信箱固定為 <b>{REPORT_TO}</b></div>
      </div>

      {([
        ['serviceId', 'Service ID', 'service_xxxxxxx'],
        ['templateId', 'Template ID', 'template_xxxxxxx'],
        ['publicKey', 'Public Key', 'AbCdEf12345XyZ'],
      ] as const).map(([k, label, ph]) => (
        <label key={k} className="block">
          <span className="text-[11px] font-bold text-[#8A6E5C]">{label}</span>
          <input
            value={cfg[k]}
            onChange={(e) => { setCfg({ ...cfg, [k]: e.target.value.trim() }); setSaved(false); }}
            placeholder={ph}
            className="mt-1 w-full rounded-2xl border-2 border-[#F4E1D4] bg-white px-3 py-2.5 font-mono text-[12px] outline-none focus:border-[#FFC2D4]"
          />
        </label>
      ))}

      <button
        onClick={() => { saveConfig(cfg); setSaved(true); onSaved(); }}
        className="squish w-full rounded-2xl bg-[#FFC2D4] py-3 text-[14px] font-black text-white shadow-lg shadow-pink-200"
      >
        {saved ? '已儲存 ✓' : '儲存設定'}
      </button>

      <details className="rounded-2xl border-2 border-white bg-white/70 p-3" open>
        <summary className="cursor-pointer text-[13px] font-black text-[#5C4437]">📮 EmailJS 開通步驟（3 分鐘）</summary>
        <ol className="mt-2 space-y-2 text-[12px] leading-relaxed">
          {[
            ['註冊帳號', '到 emailjs.com 用 Google 註冊，免費方案每月 200 封信，足夠小遊戲使用。'],
            ['建立 Service', '左側 Email Services → Add New Service → 選 Gmail → 授權 designstevenyu@gmail.com → 取得 Service ID（service_xxx）。'],
            ['建立 Template', 'Email Templates → Create New Template。收件者 To Email 填 {{to_email}}，主旨填 {{subject}}，內容貼上下方範本 → 取得 Template ID（template_xxx）。'],
            ['取得 Public Key', 'Account → General → API Keys → 複製 Public Key。'],
            ['填入本頁', '把三組 ID 貼到上面欄位並儲存；正式部署時也可改用環境變數 VITE_EMAILJS_SERVICE_ID / TEMPLATE_ID / PUBLIC_KEY。'],
          ].map(([t, d], i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#BBDDF7] text-[10px] font-black text-white">{i + 1}</span>
              <span><b>{t}</b>｜{d}</span>
            </li>
          ))}
        </ol>

        <div className="mt-3 text-[11px] font-bold text-[#8A6E5C]">Template 內容範本（直接複製）</div>
        <pre className="no-bar mt-1 overflow-x-auto rounded-xl bg-[#5C4437] p-3 text-[10.5px] leading-relaxed text-[#FFE8EF]">
{`主旨：{{subject}}

哈囉！有一位小朋友完成了角落星座顏色測驗 🎨

暱稱：{{nickname}}
測驗時間：{{test_time}}
顏色組合：{{color_combo}}
　主色：{{color_main}}
　輔色：{{color_sub}}
　點綴色：{{color_accent}}
色碼：{{color_hex}}

對應角色：{{character_name}}（{{zodiac_sign}}）
元素屬性：{{element}}
性格型態：{{quality}}

來源網址：{{page_url}}
裝置資訊：{{user_agent}}`}
        </pre>
        <div className="mt-2 rounded-xl bg-[#FFF3E9] p-2.5 text-[11px]">
          💡 小提醒：Template 設定頁的 <b>To Email</b> 一定要填 <code>{'{{to_email}}'}</code>（或直接寫死 {REPORT_TO}），
          否則 EmailJS 會回報 <code>recipients address is empty</code>。
        </div>
      </details>
    </div>
  );
}
