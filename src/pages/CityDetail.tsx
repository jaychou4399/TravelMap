import { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { cityMap } from '@/data/cities';
import { useStore, getCityStatus, cityVisitCount } from '@/store/useStore';
import { computeTripDistances } from '@/utils/distance';
import type { Transport, CityStatus } from '@/types';
import StarRating from '@/components/StarRating';
import Lightbox from '@/components/Lightbox';
import PhotoUploadModal from '@/components/PhotoUploadModal';
import {
  IconArrowLeft, IconCalendar, IconWallet, IconPlane, IconTrain, IconLocation,
  IconStar, IconEdit, IconHeart, IconBookmark, IconPhoto, IconUpload, IconTrash,
} from '@/components/Icons';

const TRANSPORT_LABEL: Record<Transport, string> = {
  plane: '飞机', train: '火车', car: '自驾', bus: '大巴', ship: '邮轮', bike: '骑行', walk: '步行', other: '其他',
};
const TRANSPORT_ICON: Record<Transport, typeof IconPlane> = {
  plane: IconPlane, train: IconTrain, car: IconPlane, bus: IconPlane, ship: IconPlane, bike: IconPlane, walk: IconPlane, other: IconPlane,
};

const STATUS_CYCLE: CityStatus[] = ['none', 'want', 'visited', 'favorite'];
const STATUS_LABEL: Record<CityStatus, string> = { none: '未去', want: '想去', visited: '已去', favorite: '特别喜欢' };
const STATUS_COLOR: Record<CityStatus, string> = { none: '#9aa7bd', want: '#3b82f6', visited: '#22c55e', favorite: '#f5b50a' };

export default function CityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const state = useStore();
  const city = id ? cityMap[id] : undefined;
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [uploadTripId, setUploadTripId] = useState<string | null>(null);
  const removePhoto = useStore((s) => s.removePhoto);

  const trips = useMemo(
    () => state.trips.filter((t) => t.cityId === id).sort((a, b) => b.startDate.localeCompare(a.startDate)),
    [state.trips, id]
  );
  const allPhotos = trips.flatMap((t) => t.photos);

  // 全部行程按时间顺序计算各段里程（用于显示距上一站城市距离）
  const distMap = useMemo(() => computeTripDistances(state.trips), [state.trips]);
  const status = id ? getCityStatus(id, state) : 'none';
  const visits = id ? cityVisitCount(id, state.trips) : 0;
  const dark = state.theme === 'dark';

  if (!city) {
    return (
      <div className="max-w-md mx-auto text-center py-24">
        <p className="text-gray-500 mb-4">未找到该城市</p>
        <Link to="/map" className="btn-primary">返回地图</Link>
      </div>
    );
  }

  const cycleStatus = () => {
    const idx = STATUS_CYCLE.indexOf(status);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    state.setCityStatus(city.id, next);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <button onClick={() => navigate(-1)} className="btn-glass !py-2 mb-4 text-sm">
        <IconArrowLeft width={16} height={16} /> 返回
      </button>

      {/* Hero cover */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-glass-lg overflow-hidden h-64 sm:h-80 mb-6 glass"
      >
        <img src={trips[0]?.cover ?? city.name} alt={city.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm opacity-90 mb-1">
                <IconLocation width={14} height={14} /> {city.country} · {city.province}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold">{city.name}</h1>
              <p className="text-sm opacity-80">{city.nameEn}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={cycleStatus} className="btn-glass !text-white text-sm">
                {status === 'favorite' ? <IconHeart width={16} height={16} fill="currentColor" /> : <IconBookmark width={16} height={16} />}
                {STATUS_LABEL[status]}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="chip !bg-white/20 !text-white !border-white/30">{visits} 次到访</span>
            {trips[0] && <span className="chip !bg-white/20 !text-white !border-white/30">最近 {trips[0].startDate}</span>}
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: info + map */}
        <div className="lg:col-span-1 space-y-5">
          <div className="glass rounded-glass p-5">
            <h3 className="font-bold mb-3">城市简介</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {city.name}（{city.nameEn}）位于{city.country}{city.isChina ? city.province : ''}，
              {city.isChina ? '是中国一座充满魅力的城市' : '是一座令人向往的旅行目的地'}。
              坐标 {city.lat.toFixed(2)}°N, {city.lng.toFixed(2)}°E。
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
              <Info label="国家" value={city.country} />
              <Info label="省份/地区" value={city.province} />
              <Info label="纬度" value={city.lat.toFixed(3)} />
              <Info label="经度" value={city.lng.toFixed(3)} />
            </div>
          </div>

          <div className="glass rounded-glass p-3 overflow-hidden">
            <h3 className="font-bold mb-2 px-2">地图位置</h3>
            <div style={{ height: 220 }} className="rounded-2xl overflow-hidden">
              <MapContainer
                center={[city.lat, city.lng]}
                zoom={city.isChina ? 8 : 6}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url={dark ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'}
                />
                <CircleMarker
                  center={[city.lat, city.lng]}
                  radius={10}
                  pathOptions={{ color: STATUS_COLOR[status], fillColor: STATUS_COLOR[status], fillOpacity: 0.8, weight: 3 }}
                >
                  <Tooltip>{city.name}</Tooltip>
                </CircleMarker>
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Right: trips */}
        <div className="lg:col-span-2 space-y-5">
          {trips.length === 0 && (
            <div className="glass rounded-glass p-10 text-center">
              <p className="text-gray-500 mb-4">还没有在这里的旅行记录</p>
              <p className="text-sm text-gray-400">点击上方状态按钮标记为「想去」或「已去」</p>
            </div>
          )}

          {trips.map((t, i) => {
            const TIcon = TRANSPORT_ICON[t.transport];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass glass-sheen rounded-glass p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <IconCalendar width={14} height={14} /> {t.startDate} → {t.endDate}
                    </div>
                    <p className="text-lg font-bold mt-1">{t.feeling}</p>
                  </div>
                  <StarRating value={t.rating} size={18} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
                  <Metric icon={IconCalendar} label="停留" value={`${t.days} 天`} />
                  <Metric icon={IconWallet} label="花费" value={`¥${t.cost}`} />
                  <Metric icon={TIcon} label="交通" value={TRANSPORT_LABEL[t.transport]} />
                  <Metric icon={IconPlane} label="里程" value={`${distMap[t.id] ?? 0} km`} />
                </div>

                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  <Field label="酒店" value={t.hotel} />
                  <Field label="天气" value={t.weather} />
                  <Field label="同行" value={t.companions.join('、')} />
                  <Field label="标签" value={t.tags.map((tag) => `#${tag}`).join(' ')} />
                </div>

                {t.photos.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium flex items-center gap-1.5"><IconPhoto width={15} height={15} /> 旅行照片</span>
                      <span className="text-xs text-gray-400">{t.photos.length} 张</span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {t.photos.map((p, idx) => (
                        <div
                          key={p.id}
                          className="relative aspect-square rounded-xl overflow-hidden group"
                        >
                          <button
                            onClick={() => setLightboxIdx(allPhotos.findIndex((x) => x.id === p.id))}
                            className="w-full h-full block"
                          >
                            <img
                              src={p.url}
                              alt={p.caption}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 opacity-0"
                              onLoad={(e) => { e.currentTarget.style.opacity = '1'; }}
                              onError={(e) => {
                                const el = e.currentTarget;
                                el.style.opacity = '0';
                                if (el.parentElement) {
                                  el.parentElement.style.background =
                                    'linear-gradient(135deg, rgba(120,140,180,0.20), rgba(120,140,180,0.06))';
                                }
                              }}
                            />
                          </button>
                          <button
                            onClick={() => { if (confirm('删除这张照片？')) removePhoto(p.id); }}
                            className="absolute top-1 right-1 p-1 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition"
                            title="删除"
                          >
                            <IconTrash width={13} height={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4 flex-wrap">
                  <button
                    className="btn-glass !py-2 text-sm"
                    onClick={() => setUploadTripId(t.id)}
                  >
                    <IconUpload width={15} height={15} /> 添加照片
                  </button>
                  <Link to={`/diary/${t.id}`} className="btn-glass !py-2 text-sm">
                    <IconEdit width={15} height={15} /> 旅行日记
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          photos={allPhotos}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onIndexChange={setLightboxIdx}
        />
      )}

      <PhotoUploadModal
        open={uploadTripId !== null}
        onClose={() => setUploadTripId(null)}
        defaultTripId={uploadTripId ?? undefined}
        lockTrip
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/30 dark:bg-white/5 px-3 py-2">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium text-sm">{value}</div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof IconPlane; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/30 dark:bg-white/5 p-3 text-center">
      <Icon width={18} height={18} className="mx-auto text-brand-500 mb-1" />
      <div className="font-bold text-sm">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <span className="text-gray-400 shrink-0">{label}:</span>
      <span className="text-gray-700 dark:text-gray-200">{value}</span>
    </div>
  );
}
