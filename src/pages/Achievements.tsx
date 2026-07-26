import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import type { Achievement } from '@/types';
import { IconBookmark, IconCheck, IconStar } from '@/components/Icons';

export default function Achievements() {
  const state = useStore();
  const achievements = state.achievements;
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = totalCount ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* ===== Header ===== */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 text-brand-500 mb-2">
          <IconBookmark width={22} height={22} />
          <span className="text-sm font-semibold tracking-wide">ACHIEVEMENTS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">成就</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">解锁你的旅行里程碑</p>
      </motion.div>

      {/* ===== Summary ===== */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="glass-strong glass-sheen rounded-glass p-5 sm:p-6 mb-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="grid place-items-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-glow">
              <IconStar width={26} height={26} fill="currentColor" />
            </div>
            <div>
              <div className="text-3xl font-extrabold leading-none">
                <span className="text-brand-600 dark:text-brand-300">{unlockedCount}</span>
                <span className="text-gray-400 mx-1">/</span>
                <span className="text-gray-500">{totalCount}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">已解锁成就</div>
            </div>
          </div>
          <span className="chip">
            <IconCheck width={14} height={14} /> {progress.toFixed(0)}% 完成
          </span>
        </div>

        <div className="h-3 rounded-full bg-white/30 dark:bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(progress, 2)}%` }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </motion.div>

      {/* ===== Grid ===== */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((a, i) => (
          <AchievementCard key={a.id} achievement={a} index={i} />
        ))}
      </div>
    </div>
  );
}

function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  const { icon, title, desc, unlocked, unlockedAt } = achievement;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className={[
        'relative rounded-glass p-5 overflow-hidden transition-all',
        unlocked
          ? 'glass glass-sheen shadow-glow'
          : 'glass opacity-50 grayscale',
      ].join(' ')}
    >
      {/* Icon */}
      <div className="flex items-start justify-between mb-3">
        <div
          className={[
            'grid place-items-center w-14 h-14 rounded-2xl text-3xl',
            unlocked
              ? 'bg-gradient-to-br from-amber-400/30 to-orange-500/30 shadow-glow'
              : 'bg-gradient-to-br from-slate-400/20 to-slate-500/20',
          ].join(' ')}
        >
          <span aria-hidden>{icon}</span>
        </div>

        {unlocked ? (
          <span className="chip !bg-emerald-500/15 !text-emerald-600 dark:!text-emerald-300 !border-emerald-500/30">
            <IconCheck width={14} height={14} /> 已解锁
          </span>
        ) : (
          <span className="chip !bg-slate-500/15 !text-slate-500 !border-slate-500/30">
            <IconBookmark width={14} height={14} /> 未解锁
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{desc}</p>

      {unlocked && unlockedAt && (
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          解锁于 {unlockedAt.slice(0, 10)}
        </div>
      )}

      {/* Lock overlay for locked */}
      {!unlocked && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="grid place-items-center w-12 h-12 rounded-full bg-slate-500/20 backdrop-blur-sm">
            <IconBookmark width={20} height={20} className="text-slate-500" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
