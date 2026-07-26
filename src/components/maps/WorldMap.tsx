import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { CityStatus } from '@/types';
import { ALL_CITIES, cityMap, findCityByName } from '@/data/cities';
import { useStore, getCityStatus } from '@/store/useStore';
import { IconPlay, IconLocation } from '@/components/Icons';

type Mode = 'markers' | 'heatmap' | 'route';

const STATUS_COLOR: Record<CityStatus, string> = {
  none: '#9aa7bd',
  want: '#60a5fa',
  visited: '#34d399',
  favorite: '#fbbf24',
};

delete (L.Icon.Default.prototype as any)._getIconUrl;

interface Props {
  mode: Mode;
  height?: number;
  chinaOnly?: boolean;
}

export default function WorldMap({ mode, height = 560, chinaOnly = false }: Props) {
  const state = useStore();
  const navigate = useNavigate();
  const dark = state.theme === 'dark';
  const [playing, setPlaying] = useState(false);
  const [visibleSegs, setVisibleSegs] = useState(0);

  const cities = useMemo(
    () => ALL_CITIES.filter((c) => (chinaOnly ? c.isChina : true)),
    [chinaOnly]
  );

  const activeCities = useMemo(
    () => cities.filter((c) => getCityStatus(c.id, state) !== 'none'),
    [cities, state]
  );

  // 愿望清单中匹配到城市目录的地点（排除已在 activeCities 中的）
  const wishCities = useMemo(() => {
    const activeIds = new Set(activeCities.map((c) => c.id));
    const matched: typeof activeCities = [];
    const seen = new Set<string>();
    for (const w of state.wishes) {
      if (w.type !== 'city') continue;
      const city = findCityByName(w.name);
      if (!city || activeIds.has(city.id) || seen.has(city.id)) continue;
      if (chinaOnly && !city.isChina) continue;
      seen.add(city.id);
      matched.push(city);
    }
    return matched;
  }, [state.wishes, activeCities, chinaOnly]);

  const route = useMemo(() => {
    const trips = [...state.trips].sort((a, b) => a.startDate.localeCompare(b.startDate));
    const seen = new Set<string>();
    const pts: { coord: [number, number]; name: string; cityId: string; date: string }[] = [];
    for (const t of trips) {
      const c = cityMap[t.cityId];
      if (!c || seen.has(t.cityId)) continue;
      seen.add(t.cityId);
      pts.push({ coord: [c.lat, c.lng], name: c.name, cityId: t.cityId, date: t.startDate });
    }
    return pts;
  }, [state.trips]);

  const routeLatLngs = useMemo(() => route.map((r) => r.coord), [route]);

  useEffect(() => {
    if (!playing || routeLatLngs.length < 2) return;
    setVisibleSegs(1);
    let n = 1;
    const id = setInterval(() => {
      n += 1;
      if (n > routeLatLngs.length) {
        clearInterval(id);
        setPlaying(false);
        setVisibleSegs(routeLatLngs.length);
      } else {
        setVisibleSegs(n);
      }
    }, 700);
    return () => clearInterval(id);
  }, [playing, routeLatLngs.length]);

  useEffect(() => {
    if (!playing) setVisibleSegs(routeLatLngs.length);
  }, [playing, routeLatLngs.length]);

  const tileUrl = dark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  const attribution = '&copy; OpenStreetMap &copy; CARTO';

  const center: [number, number] = chinaOnly ? [35, 105] : [30, 20];
  // 所有可见点（用于 FitBounds）
  const allPoints = useMemo(() => {
    const pts = activeCities.map((c) => [c.lat, c.lng] as [number, number]);
    pts.push(...wishCities.map((c) => [c.lat, c.lng] as [number, number]));
    return pts;
  }, [activeCities, wishCities]);

  return (
    <div className="relative" style={{ height }}>
      <MapContainer
        center={center}
        zoom={chinaOnly ? 4 : 2}
        minZoom={2}
        worldCopyJump
        scrollWheelZoom
        style={{ height: '100%', width: '100%', borderRadius: 24 }}
      >
        <TileLayer url={tileUrl} attribution={attribution} />
        <MapResizer />

        {/* ─── 已标记城市 ─── */}
        {mode === 'markers' &&
          activeCities.map((c) => {
            const status = getCityStatus(c.id, state);
            const isFav = status === 'favorite';
            return (
              <CircleMarker
                key={c.id}
                center={[c.lat, c.lng]}
                radius={isFav ? 10 : 7}
                pathOptions={{
                  color: STATUS_COLOR[status],
                  fillColor: STATUS_COLOR[status],
                  fillOpacity: 0.9,
                  weight: isFav ? 3 : 2,
                  opacity: 1,
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} className="!bg-gray-900/90 !text-white !border-0 !rounded-lg !px-2.5 !py-1 !text-xs !shadow-lg">
                  <span className="font-semibold">{c.name}</span> · {c.country}
                </Tooltip>
                <Popup className="!rounded-xl">
                  <div className="text-sm leading-relaxed">
                    <b className="text-base">{c.name}</b>
                    <span className="text-gray-500 ml-1">{c.country}</span>
                    <br />
                    <button className="text-blue-500 font-medium mt-1 hover:underline" onClick={() => navigate(`/city/${c.id}`)}>
                      查看详情 →
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

        {/* ─── 愿望清单地点（虚线脉冲） ─── */}
        {mode === 'markers' &&
          wishCities.map((c) => (
            <CircleMarker
              key={`wish-${c.id}`}
              center={[c.lat, c.lng]}
              radius={8}
              pathOptions={{
                color: STATUS_COLOR.want,
                fillColor: 'transparent',
                fillOpacity: 0,
                weight: 2,
                dashArray: '6 4',
                opacity: 0.8,
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} className="!bg-blue-600/90 !text-white !border-0 !rounded-lg !px-2.5 !py-1 !text-xs !shadow-lg">
                🌟 {c.name} · {c.country} · 想去
              </Tooltip>
              <Popup className="!rounded-xl">
                <div className="text-sm leading-relaxed">
                  <b className="text-base">{c.name}</b>
                  <span className="text-gray-500 ml-1">{c.country}</span>
                  <br />
                  <span className="text-blue-500 text-xs">📍 愿望清单 · 想去</span>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* ─── 热力模式 ─── */}
        {mode === 'heatmap' &&
          activeCities.map((c) => {
            const visits = state.trips.filter((t) => t.cityId === c.id).length;
            const intensity = Math.min(visits, 6);
            const color = heatColor(intensity);
            return (
              <CircleMarker
                key={c.id}
                center={[c.lat, c.lng]}
                radius={8 + intensity * 6}
                pathOptions={{ color: 'transparent', fillColor: color, fillOpacity: 0.55, weight: 0 }}
              >
                <Tooltip direction="top" offset={[0, -10]} className="!bg-gray-900/90 !text-white !border-0 !rounded-lg !px-2.5 !py-1 !text-xs">
                  {c.name} · {visits} 次到访
                </Tooltip>
              </CircleMarker>
            );
          })}

        {/* ─── 路线模式 ─── */}
        {mode === 'route' && (
          <>
            {routeLatLngs.slice(0, Math.max(visibleSegs, 1) - 1).map((_, i) => (
              <Polyline
                key={i}
                positions={[routeLatLngs[i], routeLatLngs[i + 1]]}
                pathOptions={{ color: '#818cf8', weight: 3, opacity: 0.8, dashArray: '10 6' }}
              />
            ))}
            {route.slice(0, visibleSegs).map((r, i) => (
              <CircleMarker
                key={r.cityId}
                center={r.coord}
                radius={i === visibleSegs - 1 && playing ? 11 : 7}
                pathOptions={{
                  color: '#6366f1',
                  fillColor: i === visibleSegs - 1 && playing ? '#fbbf24' : '#818cf8',
                  fillOpacity: 0.95,
                  weight: 2,
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} className="!bg-gray-900/90 !text-white !border-0 !rounded-lg !px-2.5 !py-1 !text-xs">
                  {i + 1}. {r.name} · {r.date}
                </Tooltip>
              </CircleMarker>
            ))}
          </>
        )}

        <FitBounds points={allPoints} routeLatLngs={routeLatLngs} mode={mode} />
      </MapContainer>

      {mode === 'route' && route.length > 1 && (
        <button
          onClick={() => setPlaying((p) => !p)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow"
        >
          <IconPlay width={16} height={16} /> {playing ? '播放中…' : '播放旅行动画'}
        </button>
      )}

      {mode === 'heatmap' && (
        <div className="glass absolute bottom-4 left-4 z-[1000] px-3 py-2 rounded-2xl flex items-center gap-2 text-xs">
          <IconLocation width={14} height={14} />
          <span>少</span>
          <div className="w-24 h-2 rounded-full" style={{ background: 'linear-gradient(to right, #c7e9ff, #60a5fa, #6366f1, #a855f7)' }} />
          <span>多</span>
        </div>
      )}
    </div>
  );
}

function heatColor(intensity: number): string {
  const colors = ['#c7e9ff', '#93c5fd', '#60a5fa', '#6366f1', '#a855f7', '#7c3aed'];
  return colors[Math.min(intensity, colors.length - 1)];
}

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 250);
    return () => clearTimeout(timer);
  }, [map]);
  useEffect(() => {
    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [map]);
  return null;
}

function FitBounds({ points, routeLatLngs, mode }: {
  points: [number, number][];
  routeLatLngs: [number, number][];
  mode: Mode;
}) {
  const map = useMap();
  const fittedRef = useRef(false);

  useEffect(() => {
    const pts = mode === 'route' ? routeLatLngs : points;
    if (pts.length === 0) return;
    if (fittedRef.current) return;
    fittedRef.current = true;
    if (pts.length === 1) {
      map.setView(pts[0], 6);
    } else {
      map.fitBounds(L.latLngBounds(pts), { padding: [50, 50], maxZoom: 6 });
    }
  }, [map, points, routeLatLngs, mode]);

  return null;
}
