import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Photo } from '@/types';
import { IconClose, IconArrowLeft, IconArrowRight, IconPlay } from './Icons';
import { getThumbUrl } from '@/utils/image';

interface Props {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}

export default function Lightbox({ photos, index, onClose, onIndexChange }: Props) {
  const [slideshow, setSlideshow] = useState(false);
  const [imgState, setImgState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const photo = photos[index];
  const containerRef = useRef<HTMLDivElement>(null);

  const next = useCallback(() => onIndexChange((index + 1) % photos.length), [index, photos.length, onIndexChange]);
  const prev = useCallback(() => onIndexChange((index - 1 + photos.length) % photos.length), [index, photos.length, onIndexChange]);

  // 键盘导航
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, onClose]);

  // 锁定 body 滚动
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // 幻灯片
  useEffect(() => {
    if (!slideshow) return;
    const id = setInterval(next, 3000);
    return () => clearInterval(id);
  }, [slideshow, next]);

  // 切换图片时重置状态
  useEffect(() => {
    setImgState('loading');
  }, [photo?.id]);

  if (!photo) return null;

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-lg grid place-items-center select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* 顶部工具栏 */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-white grid place-items-center transition-colors"
          onClick={(e) => { e.stopPropagation(); setSlideshow((s) => !s); }}
          aria-label="幻灯片"
        >
          <IconPlay width={18} height={18} />
        </button>
        <button
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-white grid place-items-center transition-colors"
          onClick={onClose}
          aria-label="关闭"
        >
          <IconClose width={18} height={18} />
        </button>
      </div>

      {/* 页码指示器 */}
      <div className="absolute top-4 left-4 z-10 text-white/70 text-sm font-medium">
        {index + 1} / {photos.length}
        {slideshow && <span className="ml-2 text-brand-400">● 幻灯片</span>}
      </div>

      {/* 左箭头 */}
      <button
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur text-white grid place-items-center z-10 transition-colors"
        onClick={(e) => { e.stopPropagation(); prev(); }}
        aria-label="上一张"
      >
        <IconArrowLeft width={20} height={20} />
      </button>

      {/* 图片主区域 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={photo.id}
          className="max-w-[90vw] max-h-[85vh] flex flex-col items-center relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Loading spinner */}
          {imgState === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            </div>
          )}

          {/* Error state */}
          {imgState === 'error' && (
            <div className="flex flex-col items-center gap-3 text-white/60 py-16 px-8">
              <span className="text-4xl">📷</span>
              <p className="text-sm">图片加载失败</p>
              <button
                onClick={(e) => { e.stopPropagation(); setImgState('loading'); }}
                className="text-xs px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                重试
              </button>
            </div>
          )}

          {/* 实际图片 */}
          <img
            src={photo.url}
            alt={photo.caption}
            className={`max-w-full max-h-[75vh] rounded-2xl object-contain shadow-2xl transition-opacity duration-300 ${imgState === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgState('loaded')}
            onError={() => setImgState('error')}
            draggable={false}
          />

          {/* 图片信息 */}
          {imgState === 'loaded' && (
            <motion.div
              className="text-center text-white mt-3 px-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-sm opacity-90">{photo.caption}</p>
              <p className="text-xs opacity-50 mt-1">{photo.date}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 右箭头 */}
      <button
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur text-white grid place-items-center z-10 transition-colors"
        onClick={(e) => { e.stopPropagation(); next(); }}
        aria-label="下一张"
      >
        <IconArrowRight width={20} height={20} />
      </button>

      {/* 底部缩略图条（照片多时显示） */}
      {photos.length > 3 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 max-w-[80vw] overflow-x-auto px-2 py-1.5 rounded-xl bg-black/40 backdrop-blur">
          {photos.map((p, i) => (
            <button
              key={p.id}
              onClick={(e) => { e.stopPropagation(); onIndexChange(i); }}
              className={`shrink-0 w-10 h-10 rounded-lg overflow-hidden ring-2 transition-all ${i === index ? 'ring-white scale-110' : 'ring-transparent opacity-50 hover:opacity-80'}`}
            >
              <img src={getThumbUrl(p.url, 80, 80)} alt="" className="w-full h-full object-cover" loading="lazy" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
