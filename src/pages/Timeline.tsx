import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore, tripsByYear } from '@/store/useStore';
import { cityMap } from '@/data/cities';
import {
  IconTimeline, IconCalendar, IconStar, IconLocation, IconCompass,
} from '@/components/Icons';
import { getThumbUrl } from '@/utils/image';
import type { Trip } from '@/types';

export default function Timeline() {
  const state = useStore();
  const grouped = useMemo(() => tripsByYear(state.trips), [state.trips]);
  const yearKeys = Object.keys(grouped);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <span className="chip mb-4">
          <IconTimeline width={14} height={14} /> 足迹流年
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">时间轴</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">按年份回顾你的足迹</p>
      </motion.div>

      {yearKeys.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="relative pl-6 sm:pl-10">
          {/* Vertical gradient line */}
          <div
            className="absolute top-2 bottom-2 left-2 sm:left-4 w-[3px] rounded-full bg-gradient-to-b from-brand-400 via-fuchsia-500 to-amber-400 opacity-70"
            aria-hidden
          />

          {yearKeys.map((year, yi) => {
            const trips = grouped[year];
            return (
              <section key={year} className="mb-12 last:mb-0">
                {/* Year header — sticky pill */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="sticky top-20 z-10 -ml-6 sm:-ml-10 mb-6"
                >
                  <div className="inline-flex items-center gap-2 glass-strong glass-sheen rounded-full pl-3 pr-4 py-2 shadow-glass">
                    <span className="grid place-items-center w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-fuchsia-500 text-white text-xs font-bold">
                      {yi + 1}
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold tracking-tight">{year}</span>
                    <span className="chip !py-0.5 !px-2 !text-[10px]">{trips.length} 次旅行</span>
                  </div>
                </motion.div>

                {/* Entries */}
                <div className="space-y-5">
                  {trips.map((t, i) => (
                    <TimelineEntry key={t.id} trip={t} index={i} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TimelineEntry({ trip, index }: { trip: Trip; index: number }) {
  const city = cityMap[trip.cityId];
  const delay = Math.min(index * 0.08, 0.4);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay }}
      className="relative"
    >
      {/* Dot on the line */}
      <span
        className="absolute -left-[1.35rem] sm:-left-[2.35rem] top-6 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-brand-400 to-fuchsia-500 ring-4 ring-white/70 dark:ring-black/30 shadow-glow"
        aria-hidden
      />

      <Link
        to={`/city/${trip.cityId}`}
        className="block group glass glass-sheen rounded-glass overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-glass"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Cover thumbnail */}
          <div className="relative sm:w-48 h-40 sm:h-auto shrink-0 overflow-hidden">
            <img
              src={getThumbUrl(trip.cover, 400, 300)}
              alt={city?.name ?? ''}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:bg-gradient-to-r" />
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-5 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <IconLocation width={14} height={14} />
                  <span className="truncate">{city?.name ?? '未知'} · {city?.country}</span>
                </div>
                <h3 className="text-lg font-bold mt-1 group-hover:text-brand-500 transition-colors">
                  {city?.name ?? '未知城市'}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-semibold">
                <IconStar width={15} height={15} fill="currentColor" className="star-active" />
                <span>{trip.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-2">
              <IconCalendar width={13} height={13} />
              <span>{trip.startDate} → {trip.endDate}</span>
              <span className="mx-1 opacity-40">·</span>
              <span>{trip.days} 天</span>
            </div>

            {trip.feeling && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{trip.feeling}</p>
            )}

            {trip.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {trip.tags.slice(0, 5).map((tag) => (
                  <span key={tag} className="chip !text-[10px] !px-2 !py-0.5">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-glass p-12 text-center"
    >
      <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-fuchsia-500 grid place-items-center text-white mb-4">
        <IconCompass width={28} height={28} />
      </div>
      <h3 className="text-lg font-bold mb-1">还没有旅行记录</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">去地图上点亮你的第一座城市吧</p>
      <Link to="/map" className="btn-primary">开始记录</Link>
    </motion.div>
  );
}
