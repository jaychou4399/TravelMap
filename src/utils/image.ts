// Image source helper — uses picsum.photos for fast, reliable placeholder images.
// (Deterministic by seed; loads instantly compared to on-the-fly generation.)

export type ImageSize =
  | 'square_hd'
  | 'square'
  | 'portrait_4_3'
  | 'portrait_16_9'
  | 'landscape_4_3'
  | 'landscape_16_9';

const SIZE_MAP: Record<ImageSize, { w: number; h: number }> = {
  square_hd: { w: 800, h: 800 },
  square: { w: 600, h: 600 },
  portrait_4_3: { w: 800, h: 600 },
  portrait_16_9: { w: 1080, h: 720 },
  landscape_4_3: { w: 960, h: 720 },
  landscape_16_9: { w: 1280, h: 720 },
};

/** Fast placeholder image URL from a seed (deterministic). */
export function genImage(prompt: string, size: ImageSize = 'landscape_16_9'): string {
  const { w, h } = SIZE_MAP[size];
  // Use the prompt as a seed so each prompt maps to a stable image.
  let seed = 0;
  for (let i = 0; i < prompt.length; i++) seed = (seed * 31 + prompt.charCodeAt(i)) >>> 0;
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

/** City cover image */
export function cityCover(cityName: string, nameEn: string): string {
  return genImage(`${cityName}-${nameEn}-cover`, 'landscape_16_9');
}

/** A travel scene photo */
export function travelPhoto(scene: string): string {
  return genImage(`${scene}-photo`, 'landscape_4_3');
}

/**
 * 生成缩略图 URL —— 用 wsrv.nl 代理远程图片并缩放，大幅降低带宽和解码开销。
 * - jsDelivr / Wikimedia / GitHub raw 等远程图：走 wsrv.nl 转成 webp 缩略图
 * - picsum 占位图：直接返回（已是小图）
 * - 本地/blob URL：直接返回（无法代理）
 *
 * 列表网格用 400x400，Lightbox 缩略图条用 80x80，Lightbox 主图保持原图。
 */
export function getThumbUrl(url: string, width = 400, height?: number): string {
  if (!url.startsWith('http')) return url;
  if (url.includes('picsum.photos')) return url;
  // Wikimedia Commons 自带缩略图参数，直接用（更稳更快）
  const commonsMatch = url.match(/^https?:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/[^/]+\/([^/]+)\/[^/]+$/);
  if (commonsMatch) {
    const file = commonsMatch[1];
    const ext = file.split('.').pop()?.toLowerCase();
    if (ext && ['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
      // 改写为指定宽度的缩略图 URL
      const base = url.replace(/\/\d+px-[^/]+$/, '');
      return `${base}/${width}px-${file}`;
    }
  }
  // 其他远程图：用 wsrv.nl 代理缩放为 webp
  const target = url.replace(/^https?:\/\//, '');
  let params = `url=${encodeURIComponent(target)}&w=${width}&output=webp&q=70`;
  if (height) params += `&h=${height}&fit=cover&a=attention`;
  return `https://wsrv.nl/?${params}`;
}
