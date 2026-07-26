import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { cityMap } from '@/data/cities';
import { IconVideo, IconPlay, IconClose, IconLocation, IconCalendar } from '@/components/Icons';
import type { Video } from '@/types';

function formatDuration(s: number): string {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export default function VideoPage() {
  const state = useStore();
  const videos = useMemo(() => {
    const map = new Map<string, Video>();
    for (const v of state.videos) map.set(v.id, v);
    for (const t of state.trips) for (const v of t.videos) map.set(v.id, v);
    return Array.from(map.values());
  }, [state.videos, state.trips]);

  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-6 sm:pt-10 pb-6"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">旅行视频</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          用镜头记录旅程的动态瞬间，共 {videos.length} 支视频
        </p>
      </motion.div>

      {videos.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {videos.map((v, i) => {
            const city = cityMap[v.cityId];
            return (
              <motion.button
                key={v.id}
                type="button"
                onClick={() => setActiveVideo(v)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
                className="glass glass-sheen rounded-glass overflow-hidden text-left group block"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="grid place-items-center w-14 h-14 rounded-full bg-white/30 backdrop-blur-md border border-white/50 text-white shadow-glow transition-transform duration-300 group-hover:scale-110">
                      <IconPlay width={24} height={24} fill="currentColor" />
                    </span>
                  </div>
                  <span className="absolute bottom-2 right-2 chip !bg-black/55 !text-white !border-white/20 !px-2 !py-0.5 text-[11px]">
                    {formatDuration(v.duration)}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-1">{v.title}</h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    {city && (
                      <span className="inline-flex items-center gap-1">
                        <IconLocation width={13} height={13} /> {city.name}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <IconCalendar width={13} height={13} /> {v.date}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            key="video-modal"
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md grid place-items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
          >
            <button
              className="absolute top-4 right-4 btn-glass !p-2.5 text-white z-10"
              onClick={(e) => { e.stopPropagation(); setActiveVideo(null); }}
              aria-label="关闭"
            >
              <IconClose width={18} height={18} />
            </button>
            <motion.div
              className="w-full max-w-4xl"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-strong rounded-glass-lg overflow-hidden">
                <video
                  src={activeVideo.url}
                  controls
                  autoPlay
                  className="w-full max-h-[80vh] bg-black"
                />
                <div className="p-4 text-white">
                  <h3 className="font-semibold">{activeVideo.title}</h3>
                  <p className="text-xs opacity-70 mt-1 inline-flex items-center gap-1">
                    {cityMap[activeVideo.cityId]?.name} · {activeVideo.date} · {formatDuration(activeVideo.duration)}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass rounded-glass p-16 text-center">
      <div className="inline-grid place-items-center w-16 h-16 rounded-2xl bg-brand-400/15 text-brand-500 mb-4">
        <IconVideo width={28} height={28} />
      </div>
      <p className="text-gray-500 dark:text-gray-400">还没有旅行视频</p>
      <p className="text-sm text-gray-400 mt-1">记录旅行视频后，会在这里展示</p>
    </div>
  );
}
