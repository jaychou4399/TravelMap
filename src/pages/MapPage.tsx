import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ChinaMap from '@/components/maps/ChinaMap';
import WorldMap from '@/components/maps/WorldMap';
import { useStore, computeStats, getCityStatus } from '@/store/useStore';
import { CHINA_PROVINCE_NAMES, cityMap } from '@/data/cities';
import AnimatedNumber from '@/components/AnimatedNumber';
import {
  IconMap, IconGlobe, IconLocation, IconCompass, IconPlane,
  IconPhoto, IconCalendar, IconStar, IconHeart, IconBookmark,
} from '@/components/Icons';
import type { CityStatus, City } from '@/types';

type Tab = 'china' | 'world';
type WorldMode = 'markers' | 'heatmap' | 'route';

const STATUS_LABEL: Record<CityStatus, string> = { none: '未去', want: '想去', visited: '已去', favorite: '特别喜欢' };
const STATUS_COLOR: Record<CityStatus, string> = { none: '#c8d0dc', want: '#60a5fa', visited: '#34d399', favorite: '#fbbf24' };

export default function MapPage() {
  const state = useStore();
  const stats = computeStats(state);
  const [tab, setTab] = useState<Tab>('china');
  const [worldMode, setWorldMode] = useState<WorldMode>('markers');

  const citiesByStatus = useMemo(() => {
    const groups: Record<'favorite' | 'visited' | 'want', City[]> = { favorite: [], visited: [], want: [] };
    for (const c of Object.values(cityMap)) {
      const s = getCityStatus(c.id, state);
      if (s === 'favorite') groups.favorite.push(c);
      else if (s === 'visited') groups.visited.push(c);
      else if (s === 'want') groups.want.push(c);
    }
    return groups;
  }, [state]);

  const totalMarked = citiesByStatus.favorite.length + citiesByStatus.visited.length + citiesByStatus.want.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-6 mb-5 flex items-end justify-between flex-wrap gap-3"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-brand-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
            旅行地图
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {tab === 'china'
              ? '点击省份切换状态，点击城市点查看详情'
              : '探索全球足迹，蓝色虚线圆为你的愿望清单'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* 世界模式切换 */}
          <AnimatePresence>
            {tab === 'world' && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="glass rounded-full p-1 flex gap-1"
              >
                <ModeBtn active={worldMode === 'markers'} onClick={() => setWorldMode('markers')} icon={IconLocation} label="标记" />
                <ModeBtn active={worldMode === 'heatmap'} onClick={() => setWorldMode('heatmap')} icon={IconCompass} label="热力" />
                <ModeBtn active={worldMode === 'route'} onClick={() => setWorldMode('route')} icon={IconPlane} label="路线" />
              </motion.div>
            )}
          </AnimatePresence>
          {/* Tab switch */}
          <div className="glass rounded-full p-1 flex gap-1">
            <TabBtn active={tab === 'china'} onClick={() => setTab('china')} icon={IconMap} label="中国" />
            <TabBtn active={tab === 'world'} onClick={() => setTab('world')} icon={IconGlobe} label="世界" />
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Map main */}
        <div className="lg:col-span-3 space-y-3">
          <div className="glass rounded-glass p-2 sm:p-3 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {tab === 'china' ? (
                <motion.div key="china" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <ChinaMap height={600} />
                </motion.div>
              ) : (
                <motion.div key="world" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <WorldMap mode={worldMode} height={600} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 图例栏 */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-glass px-4 py-3 flex items-center justify-between flex-wrap gap-3"
          >
            {tab === 'china' ? (
              <div className="flex flex-wrap items-center gap-4">
                {(['none', 'want', 'visited', 'favorite'] as CityStatus[]).map((s) => (
                  <span key={s} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-sm"
                      style={{ background: STATUS_COLOR[s], boxShadow: `0 0 8px ${STATUS_COLOR[s]}40` }}
                    />
                    {STATUS_LABEL[s]}
                  </span>
                ))}
                <span className="flex items-center gap-1.5 text-xs text-blue-500">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-blue-400" />
                  愿望清单
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                  <span className="w-3 h-3 rounded-full bg-green-400" /> 已去
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                  <span className="w-3 h-3 rounded-full bg-yellow-400" /> 收藏
                </span>
                <span className="flex items-center gap-1.5 text-xs text-blue-500">
                  <span className="w-3 h-3 rounded-full border-2 border-dashed border-blue-400" /> 想去
                </span>
              </div>
            )}
            <span className="text-xs text-gray-400 font-medium">
              {tab === 'china'
                ? `${stats.provinceCount}/${CHINA_PROVINCE_NAMES.length} 省份 · ${stats.cityCount} 城市`
                : `${stats.countryCount} 国家 · ${stats.cityCount} 城市`}
            </span>
          </motion.div>
        </div>

        {/* Right panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* 核心数据 */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass rounded-glass p-3 space-y-2.5">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">数据总览</h3>
            <div className="grid grid-cols-2 gap-2">
              <MiniStat icon={IconLocation} value={stats.cityCount} label="城市" color="text-emerald-500" />
              <MiniStat icon={IconMap} value={stats.provinceCount} label="省份" color="text-blue-500" />
              <MiniStat icon={IconGlobe} value={stats.countryCount} label="国家" color="text-purple-500" />
              <MiniStat icon={IconCalendar} value={stats.totalDays} label="天数" color="text-amber-500" />
              <MiniStat icon={IconPlane} value={Math.round(stats.totalDistance)} label="公里" color="text-rose-500" />
              <MiniStat icon={IconPhoto} value={stats.photoCount} label="照片" color="text-fuchsia-500" />
            </div>
          </motion.div>

          {/* 完成进度 */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass rounded-glass p-3 space-y-3">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">探索进度</h3>
            <ProgressRing label="中国省份" value={stats.chinaCompletion * 100} sub={`${stats.provinceCount}/${CHINA_PROVINCE_NAMES.length}`} color="from-blue-500 to-cyan-400" />
            <ProgressRing label="世界国家" value={stats.worldCompletion * 100} sub={`${stats.countryCount} 国`} color="from-purple-500 to-fuchsia-400" />
          </motion.div>

          {/* 城市列表 */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass rounded-glass p-3 space-y-2">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              城市列表 <span className="text-gray-400 font-normal">({totalMarked})</span>
            </h3>
            <CityGroup title="特别喜欢" color={STATUS_COLOR.favorite} icon={IconHeart} cities={citiesByStatus.favorite} trips={state.trips} defaultOpen />
            <CityGroup title="已去" color={STATUS_COLOR.visited} icon={IconStar} cities={citiesByStatus.visited} trips={state.trips} />
            <CityGroup title="想去" color={STATUS_COLOR.want} icon={IconLocation} cities={citiesByStatus.want} trips={state.trips} />
            {totalMarked === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">还没有标记城市，点击地图开始记录</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

function TabBtn({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof IconMap; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${active ? 'text-white' : 'text-gray-600 dark:text-gray-300 hover:text-brand-500'}`}
    >
      {active && <motion.span layoutId="map-tab" className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
      <Icon width={15} height={15} className="relative z-10" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

function ModeBtn({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof IconMap; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
        active
          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/10'
      }`}
    >
      <Icon width={13} height={13} /> {label}
    </button>
  );
}

function MiniStat({ icon: Icon, value, label, color }: { icon: typeof IconMap; value: number; label: string; color: string }) {
  return (
    <div className="rounded-xl bg-white/40 dark:bg-white/5 p-2 text-center hover:-translate-y-0.5 transition-transform">
      <Icon width={16} height={16} className={`${color} mx-auto mb-0.5`} />
      <div className="text-base font-extrabold tabular-nums"><AnimatedNumber value={value} /></div>
      <div className="text-[10px] text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}

function ProgressRing({ label, value, sub, color }: { label: string; value: number; sub: string; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="font-medium">{label}</span>
        <span className="text-gray-500">{sub}</span>
      </div>
      <div className="h-2 rounded-full bg-white/30 dark:bg-white/10 overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="text-right text-[11px] text-gray-500 mt-0.5">
        <AnimatedNumber value={value} decimals={1} suffix="%" />
      </div>
    </div>
  );
}

function CityGroup({
  title, color, icon: Icon, cities, trips, defaultOpen = false,
}: {
  title: string;
  color: string;
  icon: typeof IconMap;
  cities: City[];
  trips: { cityId: string }[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  if (cities.length === 0) return null;
  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between text-xs py-1">
        <span className="flex items-center gap-1.5 font-semibold">
          <span className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}60` }} />
          <Icon width={12} height={12} style={{ color }} />
          {title}
        </span>
        <span className="text-gray-400">{cities.length} · {open ? '收起' : '展开'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-1 space-y-0.5 overflow-hidden"
          >
            {cities.map((c) => {
              const visits = trips.filter((t) => t.cityId === c.id).length;
              return (
                <Link
                  key={c.id}
                  to={`/city/${c.id}`}
                  className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-white/30 dark:hover:bg-white/5 transition-colors text-xs"
                >
                  <span className="font-medium truncate">{c.name}</span>
                  <span className="text-gray-400 shrink-0 ml-2">{visits > 0 ? `${visits}次` : c.country}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
