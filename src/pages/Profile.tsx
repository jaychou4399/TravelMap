import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, computeStats } from '@/store/useStore';
import AnimatedNumber from '@/components/AnimatedNumber';
import {
  IconUser, IconEdit, IconCheck, IconClose, IconBookmark,
  IconLocation, IconGlobe, IconMap, IconPhoto, IconCalendar,
  IconArrowRight,
} from '@/components/Icons';

interface EditForm {
  avatar: string;
  nickname: string;
  bio: string;
}

const STAT_CARDS = [
  { key: 'cityCount', label: '城市数', icon: IconLocation, color: 'from-sky-400 to-blue-500', suffix: '' },
  { key: 'countryCount', label: '国家数', icon: IconGlobe, color: 'from-violet-400 to-purple-500', suffix: '' },
  { key: 'provinceCount', label: '省份数', icon: IconMap, color: 'from-emerald-400 to-teal-500', suffix: '' },
  { key: 'photoCount', label: '照片数', icon: IconPhoto, color: 'from-amber-400 to-orange-500', suffix: '' },
] as const;

export default function Profile() {
  const state = useStore();
  const stats = computeStats(state);
  const profile = state.profile;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EditForm>({
    avatar: profile.avatar,
    nickname: profile.nickname,
    bio: profile.bio,
  });

  const unlockedCount = state.achievements.filter((a) => a.unlocked).length;
  const totalCount = state.achievements.length;

  const startEdit = () => {
    setForm({ avatar: profile.avatar, nickname: profile.nickname, bio: profile.bio });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const saveEdit = () => {
    state.setProfile({
      avatar: form.avatar.trim(),
      nickname: form.nickname.trim() || '旅行者',
      bio: form.bio.trim(),
    });
    setEditing(false);
  };

  const handleReset = () => {
    if (confirm('确定要重置为示例数据吗？所有自定义数据将会丢失。')) {
      state.resetData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* ===== Profile Header ===== */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-strong glass-sheen rounded-glass p-6 sm:p-8 mb-5"
      >
        <AnimatePresence mode="wait">
          {editing ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-3"
            >
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5 block">头像 URL</span>
                  <input
                    className="input-glass"
                    placeholder="https://…"
                    value={form.avatar}
                    onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5 block">昵称</span>
                  <input
                    className="input-glass"
                    placeholder="你的昵称"
                    value={form.nickname}
                    onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5 block">个人简介</span>
                <textarea
                  rows={3}
                  className="input-glass resize-none"
                  placeholder="一句话介绍自己…"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </label>
              <div className="flex gap-3">
                <button onClick={saveEdit} className="btn-primary">
                  <IconCheck width={18} height={18} /> 保存
                </button>
                <button onClick={cancelEdit} className="btn-glass">
                  <IconClose width={18} height={18} /> 取消
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex items-start sm:items-center gap-5 flex-wrap sm:flex-nowrap"
            >
              <div className="relative shrink-0">
                <img
                  src={profile.avatar}
                  alt={profile.nickname}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white/60 dark:border-white/15 shadow-glass"
                />
                <span className="absolute -bottom-1 -right-1 grid place-items-center w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-glow">
                  <IconUser width={16} height={16} />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight truncate">
                  {profile.nickname}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                  {profile.bio || '这个人很懒，什么都没留下。'}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <IconCalendar width={12} height={12} />
                  加入于 {profile.joinedAt}
                </div>
              </div>
              <button onClick={startEdit} className="btn-glass shrink-0">
                <IconEdit width={16} height={16} /> 编辑资料
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ===== Stats Row ===== */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5"
      >
        {STAT_CARDS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass glass-sheen rounded-glass p-4 sm:p-5"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} grid place-items-center text-white mb-3`}>
                <Icon width={20} height={20} />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                <AnimatedNumber value={stats[s.key]} suffix={s.suffix} />
              </div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ===== Map completion + Achievements ===== */}
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        {/* Map completion */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass glass-sheen rounded-glass p-5 lg:col-span-2"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white">
              <IconMap width={18} height={18} />
            </span>
            <div>
              <h2 className="font-bold">地图完成度</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">足迹遍布的广度</p>
            </div>
          </div>

          <CompletionBar
            label="中国省份完成率"
            value={stats.chinaCompletion * 100}
            gradient="from-emerald-400 to-teal-500"
            icon={<IconMap width={14} height={14} />}
          />
          <div className="h-3" />
          <CompletionBar
            label="世界国家完成率"
            value={stats.worldCompletion * 100}
            gradient="from-sky-400 to-blue-500"
            icon={<IconGlobe width={14} height={14} />}
          />
        </motion.div>

        {/* Achievements preview */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass glass-sheen rounded-glass p-5 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
              <IconBookmark width={18} height={18} />
            </span>
            <div>
              <h2 className="font-bold">成就</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">里程碑一览</p>
            </div>
          </div>

          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-extrabold tracking-tight text-brand-600 dark:text-brand-300">
              <AnimatedNumber value={unlockedCount} />
            </span>
            <span className="text-lg text-gray-500 mb-1">/ {totalCount}</span>
          </div>

          <div className="h-2 rounded-full bg-white/30 dark:bg-white/10 overflow-hidden mb-5">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
              initial={{ width: 0 }}
              whileInView={{ width: `${totalCount ? (unlockedCount / totalCount) * 100 : 0}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <Link to="/achievements" className="btn-glass mt-auto">
            查看全部 <IconArrowRight width={16} height={16} />
          </Link>
        </motion.div>
      </div>

      {/* ===== Data management ===== */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass rounded-glass p-5 flex items-center justify-between flex-wrap gap-4"
      >
        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 text-white">
            <IconUser width={18} height={18} />
          </span>
          <div>
            <h2 className="font-bold">数据管理</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              将所有数据重置为示例数据，无法撤销
            </p>
          </div>
        </div>
        <button onClick={handleReset} className="btn-glass hover:!text-rose-500">
          重置示例数据
        </button>
      </motion.div>
    </div>
  );
}

function CompletionBar({
  label,
  value,
  gradient,
  icon,
}: {
  label: string;
  value: number;
  gradient: string;
  icon: React.ReactNode;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
          <span className="text-brand-500">{icon}</span>
          {label}
        </span>
        <span className="text-sm font-bold">
          <AnimatedNumber value={pct} decimals={1} suffix="%" />
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-white/30 dark:bg-white/10 overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${gradient}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.max(pct, 2)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
