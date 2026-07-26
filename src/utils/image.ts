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
