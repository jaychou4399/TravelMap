import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

// 跨域样式表（如 Google Fonts）的 CSS rules 无法被 html-to-image 读取，
// 会抛 SecurityError 导致整个导出失败。skipFonts 跳过字体嵌入即可规避。
// cacheBust 避免缓存。filter 跳过跨域 <img>（jsDelivr/Wikimedia 等无 CORS 头的图）
// 避免 html-to-image 在 fetch 图片时永远挂起。
const PNG_OPTS = {
  quality: 0.95,
  backgroundColor: '#0b1220',
  pixelRatio: 2,
  skipFonts: true,
  cacheBust: true,
  filter: (node: Node) => {
    if (node instanceof HTMLImageElement) {
      // 跨域且无 crossorigin 属性的 <img> 跳过，避免 fetch 挂起
      try {
        const u = new URL(node.src, window.location.href);
        if (u.origin !== window.location.origin && !node.crossOrigin) return false;
      } catch {
        return false;
      }
    }
    return true;
  },
} as const;

/** 带超时保护的 toPng —— 跨域资源有时会让 toPng 永久挂起。 */
function toPngWithTimeout(node: HTMLElement, ms = 12000): Promise<string> {
  return Promise.race([
    toPng(node, PNG_OPTS),
    new Promise<string>((_, reject) =>
      setTimeout(() => reject(new Error('toPng timeout')), ms),
    ),
  ]);
}

/** Export a DOM node to PNG (triggers download). Returns false on failure. */
export async function exportPNG(node: HTMLElement, filename = 'travelmap.png'): Promise<boolean> {
  try {
    const dataUrl = await toPngWithTimeout(node);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
    return true;
  } catch (e) {
    console.warn('[exportPNG] failed:', e);
    return false;
  }
}

/** Export a DOM node to PDF. Returns false on failure. */
export async function exportPDF(node: HTMLElement, filename = 'travelmap.pdf'): Promise<boolean> {
  try {
    const dataUrl = await toPngWithTimeout(node);
    const img = new Image();
    img.src = dataUrl;
    await new Promise((r) => (img.onload = r));
    const pdf = new jsPDF({ orientation: img.width >= img.height ? 'landscape' : 'portrait', unit: 'px', format: [img.width, img.height] });
    pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height);
    pdf.save(filename);
    return true;
  } catch (e) {
    console.warn('[exportPDF] failed:', e);
    return false;
  }
}

/** Copy / open a shareable link (uses current location). */
export function shareLink(): string {
  return window.location.href;
}

/** Generate a QR code URL for a given text (uses public QR API). */
export function qrCodeUrl(text: string, size = 240): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
}

/** Native share with fallback to copy. */
export async function nativeShare(title: string, text: string, url: string) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch {
      return false;
    }
  }
  try {
    await navigator.clipboard.writeText(`${title}\n${text}\n${url}`);
    return true;
  } catch {
    return false;
  }
}
