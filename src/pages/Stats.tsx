import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore, computeStats } from '@/store/useStore';
import { cityMap } from '@/data/cities';
import AnimatedNumber from '@/components/AnimatedNumber';
import type { Trip } from '@/types';
import type { TravelStats } from '@/store/useStore';
import {
  IconChart, IconLocation, IconCompass, IconPlane, IconTrain,
  IconCalendar, IconStar, IconPhoto,
} from '@/components/Icons';

interface StatCardDef {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  icon: typeof IconLocation;
  color: string;
}

export default function Stats() {
  const state = useStore();
  const stats = useMemo(() => computeStats(state), [state]);

  const cards: StatCardDef[] = [
    { label: '城市数', value: stats.cityCount, icon: IconLocation, color: 'from-sky-400 to-blue-500' },
    { label: '国家数', value: stats.countryCount, icon: IconCompass, color: 'from-violet-400 to-purple-500' },
    { label: '省份数', value: stats.provinceCount, icon: IconChart, color: 'from-emerald-400 to-teal-500' },
    { label: '飞机次数', value: stats.planeCount, icon: IconPlane, color: 'from-cyan-400 to-sky-500' },
    { label: '火车次数', value: stats.trainCount, icon: IconTrain, color: 'from-indigo-400 to-blue-500' },
    { label: '总旅行天数', value: stats.totalDays, suffix: '天', icon: IconCalendar, color: 'from-amber-400 to-orange-500' },
    { label: '最长旅行', value: stats.longestTripDays, suffix: '天', icon: IconStar, color: 'from-pink-400 to-rose-500' },
    { label: '最远距离', value: stats.farthestDistance, suffix: 'km', icon: IconPlane, color: 'from-fuchsia-400 to-pink-500' },
    { label: '平均评分', value: stats.avgRating, decimals: 1, suffix: '星', icon: IconStar, color: 'from-amber-400 to-orange-500' },
    { label: '总里程', value: stats.totalDistance, suffix: 'km', icon: IconChart, color: 'from-teal-400 to-cyan-500' },
  ];

  // Visualizations data
  const provinceData = useMemo(() => topProvinces(state.trips), [state.trips]);
  const countryData = useMemo(() => topCountries(state.trips), [state.trips]);
  const ratingData = useMemo(() => ratingDistribution(state.trips), [state.trips]);
  const monthData = useMemo(() => monthDistribution(state.trips), [state.trips]);

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
          <IconChart width={14} height={14} /> 数据洞察
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">旅行统计</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">数据可视化你的旅行</p>
      </motion.div>

      {/* Stat cards grid */}
      <section className="mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.04, 0.32) }}
              className="glass glass-sheen rounded-glass p-4 sm:p-5"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} grid place-items-center text-white mb-3`}>
                <c.icon width={20} height={20} />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                <AnimatedNumber value={c.value} suffix={c.suffix} decimals={c.decimals} />
              </div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{c.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Visualizations */}
      <section className="grid lg:grid-cols-2 gap-4 sm:gap-5">
        <BarCard
          title="省份足迹 Top"
          subtitle="中国省份旅行次数排行"
          icon={IconChart}
          gradient="from-emerald-400 to-teal-500"
        >
          <HorizBars items={provinceData} gradient="from-emerald-400 to-teal-500" suffix="次" />
        </BarCard>

        <BarCard
          title="国家足迹"
          subtitle="按国家统计旅行次数"
          icon={IconCompass}
          gradient="from-violet-400 to-purple-500"
        >
          <HorizBars items={countryData} gradient="from-violet-400 to-purple-500" suffix="次" />
        </BarCard>

        <BarCard
          title="评分分布"
          subtitle="各评分等级的旅行数量"
          icon={IconStar}
          gradient="from-amber-400 to-orange-500"
        >
          <VertBars items={ratingData} gradient="from-amber-400 to-orange-500" />
        </BarCard>

        <BarCard
          title="月度旅行"
          subtitle="全年各月份出行次数"
          icon={IconCalendar}
          gradient="from-sky-400 to-blue-500"
        >
          <VertBars items={monthData} gradient="from-sky-400 to-blue-500" />
        </BarCard>
      </section>

      <PhotoStrip stats={stats} />
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

function BarCard({
  title, subtitle, icon: Icon, gradient, children,
}: {
  title: string;
  subtitle: string;
  icon: typeof IconChart;
  gradient: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="glass rounded-glass p-5 sm:p-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} grid place-items-center text-white`}>
          <Icon width={18} height={18} />
        </div>
        <div>
          <h3 className="font-bold leading-tight">{title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

interface BarItem {
  label: string;
  value: number;
}

function HorizBars({ items, gradient, suffix }: { items: BarItem[]; gradient: string; suffix: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-400 py-4">暂无数据</p>;
  }
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-3">
      {items.map((it, i) => {
        const pct = (it.value / max) * 100;
        return (
          <div key={it.label} className="text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium truncate pr-2">{it.label}</span>
              <span className="text-gray-500 dark:text-gray-400 tabular-nums">{it.value} {suffix}</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/30 dark:bg-white/10 overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function VertBars({ items, gradient }: { items: BarItem[]; gradient: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-400 py-4">暂无数据</p>;
  }
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="flex items-end gap-2">
      {items.map((it, i) => {
        const pct = (it.value / max) * 100;
        return (
          <div key={it.label} className="flex-1 flex flex-col items-center gap-2 min-w-0">
            <div className="text-xs font-bold tabular-nums h-4">{it.value || ''}</div>
            <div className="w-full h-32 flex items-end">
              <motion.div
                className={`w-full rounded-t-lg bg-gradient-to-t ${gradient}`}
                initial={{ height: 0 }}
                whileInView={{ height: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                style={{ minHeight: it.value > 0 ? 6 : 0 }}
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate w-full text-center" title={it.label}>
              {it.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PhotoStrip({ stats }: { stats: TravelStats }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass glass-sheen rounded-glass p-5 sm:p-6 mt-5 flex flex-wrap items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-500 grid place-items-center text-white">
          <IconPhoto width={24} height={24} />
        </div>
        <div>
          <div className="text-2xl font-extrabold">
            <AnimatedNumber value={stats.photoCount} suffix=" 张" />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">已记录的旅行照片 · 共 {stats.tripCount} 次旅行</div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="rounded-2xl bg-white/30 dark:bg-white/5 px-4 py-2 text-center">
          <div className="text-lg font-bold tabular-nums">{stats.cityCount}</div>
          <div className="text-xs text-gray-500">城市</div>
        </div>
        <div className="rounded-2xl bg-white/30 dark:bg-white/5 px-4 py-2 text-center">
          <div className="text-lg font-bold tabular-nums">{stats.countryCount}</div>
          <div className="text-xs text-gray-500">国家</div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// Pure data computations
// ============================================================

function topProvinces(trips: Trip[], limit = 10): BarItem[] {
  const counts = new Map<string, number>();
  for (const t of trips) {
    const city = cityMap[t.cityId];
    if (!city || !city.isChina) continue;
    counts.set(city.province, (counts.get(city.province) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function topCountries(trips: Trip[], limit = 8): BarItem[] {
  const counts = new Map<string, number>();
  for (const t of trips) {
    const city = cityMap[t.cityId];
    if (!city) continue;
    counts.set(city.country, (counts.get(city.country) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function ratingDistribution(trips: Trip[]): BarItem[] {
  const buckets = [1, 2, 3, 4, 5];
  const counts = new Map<number, number>();
  for (const b of buckets) counts.set(b, 0);
  for (const t of trips) {
    const r = Math.round(t.rating);
    if (r >= 1 && r <= 5) counts.set(r, (counts.get(r) ?? 0) + 1);
  }
  return buckets.map((b) => ({ label: `${b}星`, value: counts.get(b) ?? 0 }));
}

function monthDistribution(trips: Trip[]): BarItem[] {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const counts = new Map<number, number>();
  for (const m of months) counts.set(m, 0);
  for (const t of trips) {
    const m = Number(t.startDate.slice(5, 7));
    if (m >= 1 && m <= 12) counts.set(m, (counts.get(m) ?? 0) + 1);
  }
  return months.map((m) => ({ label: `${m}月`, value: counts.get(m) ?? 0 }));
}
