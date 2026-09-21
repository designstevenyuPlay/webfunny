import emailjs from '@emailjs/browser';

/** ------------------------------------------------------------------
 *  自動寄送測驗報告到 designstevenyu@gmail.com
 *  ------------------------------------------------------------------
 *  優先順序：
 *   1) .env 的 VITE_EMAILJS_*（正式部署用）
 *   2) localStorage（本頁「設定」面板填入，方便立即測試）
 *   3) 皆為空 → 進入「示範模式」，只在畫面上顯示報告內容不實際寄出
 *  ------------------------------------------------------------------ */

export const REPORT_TO = 'designstevenyu@gmail.com';

export interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

const LS_KEY = 'sumikko-zodiac-emailjs';

const env = {
  serviceId: (import.meta.env.VITE_EMAILJS_SERVICE_ID as string) || '',
  templateId: (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string) || '',
  publicKey: (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string) || '',
};

export function loadConfig(): EmailConfig {
  let local: Partial<EmailConfig> = {};
  try {
    local = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
  } catch {
    /* ignore */
  }
  return {
    serviceId: env.serviceId || local.serviceId || '',
    templateId: env.templateId || local.templateId || '',
    publicKey: env.publicKey || local.publicKey || '',
  };
}

export function saveConfig(cfg: EmailConfig) {
  localStorage.setItem(LS_KEY, JSON.stringify(cfg));
}

export function isConfigured(cfg = loadConfig()) {
  return Boolean(cfg.serviceId && cfg.templateId && cfg.publicKey);
}

export interface ReportPayload {
  nickname: string;
  colorNames: string[]; // ['櫻花粉','奶油黃','薄荷綠']
  colorHex: string[];
  characterName: string;
  signName: string;
  elementLabel: string;
  qualityLabel: string;
}

/** 組出 EmailJS Template 使用的變數（Template 內用 {{變數名}} 取用） */
export function buildTemplateParams(p: ReportPayload) {
  const now = new Date();
  const time = now.toLocaleString('zh-TW', { hour12: false });
  return {
    to_email: REPORT_TO,
    subject: `【角落星座小夥伴】${p.nickname || '小朋友'} 的顏色測驗報告`,
    nickname: p.nickname || '小朋友',
    color_combo: p.colorNames.join(' ＋ '),
    color_main: p.colorNames[0] ?? '',
    color_sub: p.colorNames[1] ?? '',
    color_accent: p.colorNames[2] ?? '',
    color_hex: p.colorHex.join(' / '),
    character_name: p.characterName,
    zodiac_sign: p.signName,
    element: p.elementLabel,
    quality: p.qualityLabel,
    test_time: time,
    user_agent: navigator.userAgent,
    page_url: location.href,
    message:
      `測驗時間：${time}\n` +
      `暱稱：${p.nickname || '（未填）'}\n` +
      `顏色組合：${p.colorNames.join(' ＋ ')}（${p.colorHex.join(' / ')}）\n` +
      `對應角色：${p.characterName}（${p.signName}）\n` +
      `元素屬性：${p.elementLabel} ／ ${p.qualityLabel}\n` +
      `來源網址：${location.href}`,
  };
}

export type SendStatus = 'idle' | 'sending' | 'sent' | 'demo' | 'error';

export async function sendReport(
  p: ReportPayload,
): Promise<{ status: SendStatus; detail: string; params: Record<string, string> }> {
  const params = buildTemplateParams(p);
  const cfg = loadConfig();

  if (!isConfigured(cfg)) {
    return {
      status: 'demo',
      detail: '示範模式：尚未填入 EmailJS 金鑰，報告未實際寄出（內容已在下方預覽）。',
      params,
    };
  }

  try {
    await emailjs.send(cfg.serviceId, cfg.templateId, params, { publicKey: cfg.publicKey });
    return { status: 'sent', detail: `報告已自動寄到 ${REPORT_TO} 📮`, params };
  } catch (e: any) {
    return {
      status: 'error',
      detail: `寄送失敗：${e?.text || e?.message || '請檢查 Service / Template / Public Key'}`,
      params,
    };
  }
}
