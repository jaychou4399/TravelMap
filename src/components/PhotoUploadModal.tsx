import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { cityMap } from '@/data/cities';
import type { Trip, Photo } from '@/types';
import { IconClose, IconLink, IconUpload, IconPhoto } from '@/components/Icons';

interface Props {
  open: boolean;
  onClose: () => void;
  /** 默认关联的 trip（从城市详情页打开时锁定到该 trip） */
  defaultTripId?: string;
  /** 是否锁定 trip（城市详情页：只有该城市的旅行可选，且默认选中） */
  lockTrip?: boolean;
}

/**
 * 通过粘贴外部图床 URL 批量添加照片。
 * 支持每行一个 URL，自动生成照片记录并关联到选中的旅行。
 */
export default function PhotoUploadModal({ open, onClose, defaultTripId, lockTrip }: Props) {
  const state = useStore();
  const addPhoto = useStore((s) => s.addPhoto);

  const [tripId, setTripId] = useState(defaultTripId ?? state.trips[0]?.id ?? '');
  const [urlText, setUrlText] = useState('');
  const [caption, setCaption] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [done, setDone] = useState(0);
  const [err, setErr] = useState('');

  if (!open) return null;

  // 可选的旅行列表
  const trips: Trip[] = lockTrip && defaultTripId
    ? state.trips.filter((t) => t.id === defaultTripId)
    : state.trips;

  const urls = urlText
    .split(/[\n,，\s]+/)
    .map((u) => u.trim())
    .filter((u) => u.length > 0 && /^https?:\/\//i.test(u));

  const handleAdd = () => {
    setErr('');
    if (!tripId) {
      setErr('请先选择关联的旅行记录');
      return;
    }
    if (urls.length === 0) {
      setErr('请粘贴至少一个图片链接（以 http 开头）');
      return;
    }
    const trip = state.trips.find((t) => t.id === tripId);
    if (!trip) {
      setErr('找不到关联的旅行记录');
      return;
    }
    const tags = tagsText.split(/[\s,，#]+/).map((t) => t.trim()).filter(Boolean);
    const cap = caption.trim();
    let count = 0;
    for (const url of urls) {
      const photo: Photo = {
        id: `ph-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        url,
        cityId: trip.cityId,
        tripId: trip.id,
        date,
        caption: cap || cityMap[trip.cityId]?.name || '旅行照片',
        tags: tags.length ? tags : [cityMap[trip.cityId]?.name].filter(Boolean) as string[],
        width: 1280,
        height: 960,
      };
      addPhoto(trip.id, photo);
      count++;
    }
    setDone(count);
    setUrlText('');
    setCaption('');
    setTagsText('');
    // 1.2s 后自动关闭
    setTimeout(() => {
      setDone(0);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="relative glass glass-sheen rounded-glass w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-glass"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <IconUpload width={20} height={20} className="text-brand-500" />
              添加照片
            </h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition">
              <IconClose width={18} height={18} />
            </button>
          </div>

          {done > 0 ? (
            <div className="py-8 text-center">
              <div className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-green-400/20 text-green-500 mb-3">
                <IconPhoto width={28} height={28} />
              </div>
              <p className="font-medium">成功添加 {done} 张照片</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 关联旅行 */}
              <label className="block">
                <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">关联旅行</span>
                <select
                  className="input-glass !py-2 text-sm w-full"
                  value={tripId}
                  onChange={(e) => setTripId(e.target.value)}
                  disabled={lockTrip}
                >
                  {trips.length === 0 && <option value="">暂无旅行记录</option>}
                  {trips.map((t) => {
                    const city = cityMap[t.cityId];
                    return (
                      <option key={t.id} value={t.id}>
                        {city?.name} · {t.startDate}
                      </option>
                    );
                  })}
                </select>
              </label>

              {/* 图片链接（批量） */}
              <label className="block">
                <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                  <IconLink width={12} height={12} /> 图片链接（每行一个，支持批量）
                </span>
                <textarea
                  className="input-glass !py-2 text-sm w-full h-28 resize-none font-mono"
                  placeholder={'https://图床/xxx1.jpg\nhttps://图床/xxx2.jpg\nhttps://图床/xxx3.jpg'}
                  value={urlText}
                  onChange={(e) => setUrlText(e.target.value)}
                />
                {urls.length > 0 && (
                  <span className="block text-xs text-brand-500 mt-1">
                    检测到 {urls.length} 个有效链接
                  </span>
                )}
              </label>

              {/* 预览第一张 */}
              {urls.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {urls.slice(0, 6).map((u) => (
                    <img
                      key={u}
                      src={u}
                      alt="预览"
                      className="h-16 w-16 object-cover rounded-lg ring-1 ring-white/40 dark:ring-white/10 flex-shrink-0"
                      onError={(e) => { (e.currentTarget.style.opacity = '0.2'); }}
                    />
                  ))}
                  {urls.length > 6 && (
                    <div className="h-16 w-16 rounded-lg bg-white/30 dark:bg-white/10 grid place-items-center text-xs text-gray-500 flex-shrink-0">
                      +{urls.length - 6}
                    </div>
                  )}
                </div>
              )}

              {/* 说明 / 标签 / 日期 */}
              <div className="grid grid-cols-2 gap-3">
                <label className="block col-span-2">
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">说明（可选）</span>
                  <input
                    className="input-glass !py-2 text-sm w-full"
                    placeholder="如：武功山金顶日出"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">标签</span>
                  <input
                    className="input-glass !py-2 text-sm w-full"
                    placeholder="日出 云海"
                    value={tagsText}
                    onChange={(e) => setTagsText(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">日期</span>
                  <input
                    type="date"
                    className="input-glass !py-2 text-sm w-full"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </label>
              </div>

              {err && <p className="text-xs text-red-500">{err}</p>}

              <div className="flex gap-2 pt-1">
                <button className="btn-glass flex-1 !py-2.5" onClick={onClose}>取消</button>
                <button
                  className="flex-1 !py-2.5 rounded-glass bg-gradient-to-r from-brand-400 to-brand-500 text-white font-medium shadow-glass-sm hover:opacity-90 transition"
                  onClick={handleAdd}
                  disabled={urls.length === 0}
                >
                  添加 {urls.length > 0 ? `${urls.length} 张` : ''}
                </button>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed pt-1">
                照片以 URL 形式保存在浏览器本地，请使用稳定的图床链接（如 GitHub raw、阿里云 OSS、七牛云、sm.ms 等）。
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
