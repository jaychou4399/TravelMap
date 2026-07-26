import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { cityMap } from '@/data/cities';
import { computeTripDistances } from '@/utils/distance';
import AnimatedNumber from '@/components/AnimatedNumber';
import {
  IconCompass, IconLocation, IconPlane, IconPhoto, IconHeart,
  IconShare, IconDownload, IconStar, IconCalendar, IconWallet,
  IconMap, IconGlobe, IconTrain,
} from '@/components/Icons';
import { exportPNG, exportPDF, nativeShare } from '@/utils/share';
import { getThumbUrl } from '@/utils/image';
import type { Trip, Photo } from '@/types';

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemV = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Review() {
  const state = useStore();
  const reviewRef = useRef<HTMLDivElement>(null);

  const years = useMemo(() => {
    const set = new Set<string>();
    for (const t of state.trips) if (t.startDate) set.add(t.startDate.slice(0, 4));
    return [...set].sort((a, b) => b.localeCompare(a));
  }, [state.trips]);

  const [year, setYear] = useState<string>(years[0] ?? '');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const notify = (kind: 'ok' | 'err', text: string) => {
    console.log('[Review.notify]', kind, text);
    setToast({ kind, text });
    // alert 作为可靠反馈兜底（某些环境下 toast 状态渲染异常）
    window.setTimeout(() => {
      try { window.alert(`${kind === 'ok' ? '✓' : '✗'} ${text}`); } catch {}
    }, 50);
    window.setTimeout(() => setToast(null), 5000);
  };

  const yearTrips = useMemo<Trip[]>(() => {
    if (!year) return [];
    return state.trips
      .filter((t) => t.startDate.startsWith(year))
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [state.trips, year]);

  const summary = useMemo(() => {
    const cityIds = new Set<string>();
    const provinces = new Set<string>();
    const countries = new Set<string>();
    let distance = 0, photos = 0, days = 0;
    const distMap = computeTripDistances(state.trips);
    const months = Array.from({ length: 12 }, () => ({ count: 0, cities: new Set<string>() }));

    for (const t of yearTrips) {
      const city = cityMap[t.cityId];
      if (city) {
        cityIds.add(city.id);
        if (city.isChina) provinces.add(city.province);
        countries.add(city.country);
      }
      distance += distMap[t.id] ?? 0;
      photos += t.photos?.length || 0;
      days += t.days || 0;
      const m = Number(t.startDate.slice(5, 7)) - 1;
      if (m >= 0 && m < 12 && city) months[m].cities.add(city.name);
      if (m >= 0 && m < 12) months[m].count++;
    }

    let favorite: Trip | null = null;
    for (const t of yearTrips) {
      if (!favorite) { favorite = t; continue; }
      if (t.rating > favorite.rating || (t.rating === favorite.rating && t.startDate > favorite.startDate)) favorite = t;
    }

    const topPhotos: Photo[] = yearTrips.flatMap((t) => t.photos).slice(0, 8);
    return {
      cities: cityIds.size, provinces: provinces.size, countries: countries.size,
      distance, photos, trips: yearTrips.length, days,
      favoriteTrip: favorite, favoriteCity: favorite ? cityMap[favorite.cityId] : undefined,
      months, topPhotos,
      maxMonthCount: Math.max(1, ...months.map((m) => m.count)),
    };
  }, [yearTrips, state.trips]);

  const onPNG = async () => {
    if (!reviewRef.current) return;
    setBusy(true);
    const ok = await exportPNG(reviewRef.current, `travelmap-${year}.png`);
    setBusy(false);
    notify(ok ? 'ok' : 'err', ok ? 'PNG 已导出' : '导出失败，请重试');
  };
  const onPDF = async () => {
    if (!reviewRef.current) return;
    setBusy(true);
    const ok = await exportPDF(reviewRef.current, `travelmap-${year}.pdf`);
    setBusy(false);
    notify(ok ? 'ok' : 'err', ok ? 'PDF 已导出' : '导出失败，请重试');
  };
  const onShare = async () => {
    setBusy(true);
    const ok = await nativeShare(`我的 ${year} 旅行回顾`, `走过 ${summary.cities} 座城市，行程 ${summary.distance} km，拍摄 ${summary.photos} 张照片。`, window.location.href);
    setBusy(false);
    notify(ok ? 'ok' : 'err', ok ? '已复制到剪贴板' : '分享失败，请手动复制链接');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-sm font-semibold shadow-lg ring-1 ${toast.kind === 'ok' ? 'bg-emerald-500 text-white ring-emerald-400' : 'bg-rose-500 text-white ring-rose-400'}`}
        >
          {toast.text}
        </div>
      )}

      {/* Year pills */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pt-6 mb-5 flex flex-wrap gap-2 justify-center">
        {years.map((y) => (
          <button key={y} onClick={() => setYear(y)} className={`relative px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${year === y ? 'text-white' : 'glass text-gray-600 dark:text-gray-300 hover:-translate-y-0.5'}`}>
            {year === y && <motion.span layoutId="review-year-pill" className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
            <span className="relative z-10">{y}</span>
          </button>
        ))}
        {years.length === 0 && <span className="text-sm text-gray-400">还没有旅行记录</span>}
      </motion.div>

      <AnimatePresence mode="wait">
        {yearTrips.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-12 text-center">
            <span className="text-4xl mb-3 block">🧳</span>
            <p className="text-gray-500">这一年还没有旅行记录</p>
          </motion.div>
        ) : (
          <motion.div key={year} ref={reviewRef} variants={containerV} initial="hidden" animate="show" className="space-y-4">
            {/* ═══ Hero ═══ */}
            <motion.div variants={itemV} className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500 via-purple-500 to-fuchsia-500" />
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
              <div className="relative px-6 sm:px-10 py-8 sm:py-10 text-white">
                <div className="flex items-end justify-between flex-wrap gap-4">
                  <div>
                    <motion.h2 className="text-6xl sm:text-8xl font-black tracking-tighter opacity-90" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 0.9, x: 0 }} transition={{ delay: 0.1 }}>
                      {year}
                    </motion.h2>
                    <p className="text-sm sm:text-base opacity-80 mt-1">年度旅行报告</p>
                  </div>
                  <div className="flex gap-6 sm:gap-8">
                    <HeroStat value={summary.trips} label="旅程" />
                    <HeroStat value={summary.cities} label="城市" />
                    <HeroStat value={Math.round(summary.distance)} label="公里" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ═══ Stats grid ═══ */}
            <motion.div variants={itemV} className="glass rounded-2xl p-4 sm:p-5">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                <MiniStat icon={IconLocation} value={summary.cities} label="城市" color="text-emerald-500" />
                <MiniStat icon={IconMap} value={summary.provinces} label="省份" color="text-blue-500" />
                <MiniStat icon={IconGlobe} value={summary.countries} label="国家" color="text-purple-500" />
                <MiniStat icon={IconCalendar} value={summary.days} label="天数" color="text-amber-500" />
                <MiniStat icon={IconPlane} value={Math.round(summary.distance)} label="公里" color="text-rose-500" />
                <MiniStat icon={IconPhoto} value={summary.photos} label="照片" color="text-fuchsia-500" />
              </div>
            </motion.div>

            {/* ═══ Two-column: Month heatmap + Favorite city ═══ */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Month heatmap */}
              <motion.div variants={itemV} className="glass rounded-2xl p-4 sm:p-5">
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <IconCalendar width={12} height={12} className="text-amber-500" /> 出行月份
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {summary.months.map((m, i) => {
                    const intensity = m.count / summary.maxMonthCount;
                    const bg = m.count === 0
                      ? 'bg-white/20 dark:bg-white/5'
                      : intensity < 0.33 ? 'bg-brand-200 dark:bg-brand-900/40'
                      : intensity < 0.66 ? 'bg-brand-400 dark:bg-brand-700'
                      : 'bg-brand-600 dark:bg-brand-500';
                    return (
                      <div key={i} className={`rounded-xl ${bg} p-2 text-center transition-all hover:scale-105`}>
                        <div className="text-xs font-bold text-gray-700 dark:text-gray-200">{MONTHS[i]}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                          {m.count > 0 ? `${m.count}次` : '—'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Favorite city */}
              {summary.favoriteTrip && summary.favoriteCity && (
                <motion.div variants={itemV} className="relative rounded-2xl overflow-hidden min-h-[200px]">
                  <img src={getThumbUrl(summary.favoriteTrip.cover, 800)} alt={summary.favoriteCity.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                    <span className="text-[10px] uppercase tracking-wider opacity-70 mb-1 flex items-center gap-1">
                      <IconHeart width={10} height={10} fill="currentColor" className="text-red-400" /> 年度最爱
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black">{summary.favoriteCity.name}</h3>
                    <span className="text-xs opacity-70 mt-0.5">{summary.favoriteCity.country} · {summary.favoriteCity.province}</span>
                    <div className="flex items-center gap-1.5 mt-2">
                      <IconStar width={14} height={14} fill="currentColor" className="text-yellow-400" />
                      <span className="text-sm font-bold">{summary.favoriteTrip.rating.toFixed(1)}</span>
                      <span className="text-xs opacity-70 ml-2 line-clamp-1">{summary.favoriteTrip.feeling}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* ═══ Photo gallery ═══ */}
            {summary.topPhotos.length > 0 && (
              <motion.div variants={itemV} className="glass rounded-2xl p-4 sm:p-5">
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <IconPhoto width={12} height={12} className="text-fuchsia-500" /> 精彩瞬间
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {summary.topPhotos.map((p) => (
                    <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden ring-1 ring-white/20 dark:ring-white/10 group">
                      <img src={getThumbUrl(p.url, 200, 200)} alt={p.caption} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══ Timeline ═══ */}
            <motion.div variants={itemV} className="glass rounded-2xl p-4 sm:p-5">
              <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">旅程时间线</h4>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {yearTrips.map((t, i) => {
                  const city = cityMap[t.cityId];
                  return (
                    <div key={t.id} className="flex items-center gap-2 shrink-0">
                      {i > 0 && <div className="w-6 h-px bg-gradient-to-r from-brand-400/40 to-fuchsia-400/40" />}
                      <Link to={`/city/${t.cityId}`} className="flex items-center gap-1.5 rounded-full bg-white/40 dark:bg-white/5 px-3 py-1.5 ring-1 ring-white/30 dark:ring-white/10 hover:bg-white/60 dark:hover:bg-white/10 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-br from-brand-400 to-fuchsia-500" />
                        <span className="text-xs font-semibold">{city?.name}</span>
                        <span className="text-[10px] text-gray-400">{t.startDate.slice(5)}</span>
                        {t.rating > 0 && (
                          <span className="flex items-center gap-0.5 text-[10px] text-amber-500">
                            <IconStar width={9} height={9} fill="currentColor" />{t.rating}
                          </span>
                        )}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* ═══ Actions ═══ */}
            <motion.div variants={itemV} className="flex flex-wrap gap-2 justify-center pt-2">
              <button onClick={onPNG} disabled={busy} className="btn-glass !py-2 !px-5 text-xs disabled:opacity-50"><IconDownload width={14} height={14} /> 导出 PNG</button>
              <button onClick={onPDF} disabled={busy} className="btn-glass !py-2 !px-5 text-xs disabled:opacity-50"><IconDownload width={14} height={14} /> 导出 PDF</button>
              <button onClick={onShare} disabled={busy} className="btn-primary !py-2 !px-5 text-xs disabled:opacity-50"><IconShare width={14} height={14} /> 分享</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Sub-components ─── */

function HeroStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl font-black tabular-nums"><AnimatedNumber value={value} /></div>
      <div className="text-[10px] sm:text-xs opacity-70">{label}</div>
    </div>
  );
}

function MiniStat({ icon: Icon, value, label, color }: { icon: typeof IconLocation; value: number; label: string; color: string }) {
  return (
    <div className="rounded-xl bg-white/30 dark:bg-white/5 p-2.5 text-center hover:-translate-y-0.5 transition-transform">
      <Icon width={18} height={18} className={`${color} mx-auto mb-1`} />
      <div className="text-lg font-extrabold tabular-nums"><AnimatedNumber value={value} /></div>
      <div className="text-[10px] text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}
