import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore, computeStats, tripsByDateDesc } from '@/store/useStore';
import { cityMap } from '@/data/cities';
import AnimatedNumber from '@/components/AnimatedNumber';
import {
  IconArrowRight, IconMap, IconCompass, IconPhoto, IconPlane, IconTrain,
  IconCalendar, IconLocation, IconStar,
} from '@/components/Icons';

const statsConfig = (s: ReturnType<typeof computeStats>) => [
  { label: '已去城市', value: s.cityCount, suffix: '', icon: IconLocation, color: 'from-sky-400 to-blue-500' },
  { label: '已去国家', value: s.countryCount, suffix: '', icon: IconCompass, color: 'from-violet-400 to-purple-500' },
  { label: '已去省份', value: s.provinceCount, suffix: '', icon: IconMap, color: 'from-emerald-400 to-teal-500' },
  { label: '旅行次数', value: s.tripCount, suffix: '', icon: IconCalendar, color: 'from-amber-400 to-orange-500' },
  { label: '旅行天数', value: s.totalDays, suffix: '天', icon: IconStar, color: 'from-pink-400 to-rose-500' },
  { label: '总里程', value: s.totalDistance, suffix: 'km', icon: IconPlane, color: 'from-cyan-400 to-sky-500' },
  { label: '照片', value: s.photoCount, suffix: '', icon: IconPhoto, color: 'from-indigo-400 to-blue-500' },
  { label: '视频', value: s.videoCount, suffix: '', icon: IconTrain, color: 'from-fuchsia-400 to-pink-500' },
];

export default function Home() {
  const state = useStore();
  const stats = computeStats(state);
  const latest = tripsByDateDesc(state.trips).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* ===== Hero ===== */}
      <section className="relative pt-6 sm:pt-12 pb-10">
        {/* Floating glass orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-10 -left-10 w-64 h-64 rounded-full bg-brand-400/30 blur-3xl animate-float" />
          <div className="absolute top-32 right-0 w-72 h-72 rounded-full bg-fuchsia-400/20 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute bottom-0 left-1/3 w-56 h-56 rounded-full bg-emerald-400/20 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="relative grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="chip mb-5">
              <IconCompass width={14} height={14} /> 你的私人旅行档案
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              记录每一次
              <br />
              <span className="bg-gradient-to-r from-brand-500 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
                心动远行
              </span>
            </h1>
            <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 max-w-md">
              在地图上点亮你去过的城市，记录故事与照片，生成专属的旅行数据统计与年度回顾。
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/map" className="btn-primary">
                开始记录 <IconArrowRight width={18} height={18} />
              </Link>
              <Link to="/map" className="btn-glass">
                <IconMap width={18} height={18} /> 查看地图
              </Link>
              <Link to="/timeline" className="btn-glass">
                <IconCompass width={18} height={18} /> 浏览旅行故事
              </Link>
            </div>
          </motion.div>

          {/* Glass preview card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="glass-strong glass-sheen rounded-glass-lg p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">旅行足迹概览</span>
                <span className="chip">实时</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <PreviewStat label="中国完成率" value={stats.chinaCompletion * 100} suffix="%" decimals={1} gradient="from-emerald-400 to-teal-500" />
                <PreviewStat label="世界完成率" value={stats.worldCompletion * 100} suffix="%" decimals={1} gradient="from-sky-400 to-blue-500" />
                <PreviewStat label="最爱城市" value={0} text={topCityName(state)} gradient="from-amber-400 to-orange-500" />
                <PreviewStat label="平均评分" value={stats.avgRating} decimals={1} suffix="星" gradient="from-fuchsia-400 to-pink-500" />
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/30 dark:bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-400 to-fuchsia-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(stats.chinaCompletion * 100, 4)}%` }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                />
              </div>
            </div>
            <div className="absolute -bottom-5 -right-3 glass rounded-2xl px-4 py-3 flex items-center gap-2 animate-float">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white"><IconStar width={18} height={18} fill="currentColor" /></span>
              <div>
                <div className="text-xs text-gray-500">已解锁成就</div>
                <div className="font-bold">{state.achievements.filter((a) => a.unlocked).length} / {state.achievements.length}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Stats ===== */}
      <section className="py-10">
        <SectionTitle title="旅行数据" desc="你的脚步，一目了然" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {statsConfig(stats).map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass glass-sheen rounded-glass p-4 sm:p-5"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} grid place-items-center text-white mb-3`}>
                <s.icon width={20} height={20} />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                <AnimatedNumber value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== Latest trips ===== */}
      <section className="py-10">
        <div className="flex items-end justify-between mb-5">
          <SectionTitle title="最新旅行" desc="最近一次出发，去了哪里？" bare />
          <Link to="/timeline" className="btn-glass !py-2 text-sm">全部 <IconArrowRight width={16} height={16} /></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {latest.map((t, i) => {
            const city = cityMap[t.cityId];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link to={`/city/${t.cityId}`} className="block group">
                  <div className="glass glass-sheen rounded-glass overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-glass">
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={t.cover}
                        alt={city?.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <div className="flex items-center gap-1.5 text-sm opacity-90">
                          <IconLocation width={14} height={14} /> {city?.name} · {city?.country}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-80">{t.startDate}</span>
                          <span className="flex items-center gap-0.5 text-xs">
                            <IconStar width={12} height={12} fill="currentColor" className="star-active" /> {t.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{t.feeling}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {t.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="chip !text-[10px] !px-2 !py-0.5">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function PreviewStat({ label, value, suffix, decimals, text, gradient }: {
  label: string; value: number; suffix?: string; decimals?: number; text?: string; gradient: string;
}) {
  return (
    <div className="rounded-2xl bg-white/30 dark:bg-white/5 p-3">
      <div className={`text-xs font-semibold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{label}</div>
      <div className="text-xl font-bold mt-1">
        {text ?? <AnimatedNumber value={value} suffix={suffix} decimals={decimals} />}
      </div>
    </div>
  );
}

function topCityName(state: ReturnType<typeof useStore.getState>): string {
  const rated = [...state.trips].filter((t) => t.rating >= 5);
  if (rated.length) return cityMap[rated[0].cityId]?.name ?? '—';
  if (state.trips.length) return cityMap[state.trips[0].cityId]?.name ?? '—';
  return '—';
}

function SectionTitle({ title, desc, bare }: { title: string; desc: string; bare?: boolean }) {
  return (
    <div className={bare ? '' : 'mb-5'}>
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
    </div>
  );
}
