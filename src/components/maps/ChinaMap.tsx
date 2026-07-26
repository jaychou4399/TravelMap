import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import type { CityStatus } from '@/types';
import { CHINA_PROVINCES, CHINA_PROVINCE_NAMES, cityMap, findCityByName } from '@/data/cities';
import { useStore, getCityStatus } from '@/store/useStore';
import { ensureChinaMap, echarts } from './echartsSetup';

const STATUS_COLOR: Record<CityStatus, string> = {
  none: '#c8d0dc',
  want: '#60a5fa',
  visited: '#34d399',
  favorite: '#fbbf24',
};
const STATUS_NEXT: Record<CityStatus, CityStatus> = {
  none: 'want',
  want: 'visited',
  visited: 'favorite',
  favorite: 'none',
};

interface Props {
  showCities?: boolean;
  height?: number | string;
  onProvinceClick?: (province: string) => void;
}

export default function ChinaMap({ showCities = true, height = 560, onProvinceClick }: Props) {
  const state = useStore();
  const navigate = useNavigate();
  const chartRef = useRef<ReactECharts>(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    ensureChinaMap().then((ok) => {
      if (ok) setReady(true);
      else setLoadError(true);
    });
  }, []);

  // 愿望清单中匹配到中国城市的 id 集合
  const wishCityIds = useMemo(() => {
    const ids = new Set<string>();
    for (const w of state.wishes) {
      if (w.type !== 'city') continue;
      const city = findCityByName(w.name);
      if (city && city.isChina) ids.add(city.id);
    }
    return ids;
  }, [state.wishes]);

  // Province status derived from its cities + wishes
  const provinceStatus = useMemo(() => {
    const map: Record<string, CityStatus> = {};
    for (const p of CHINA_PROVINCES) {
      let status: CityStatus = 'none';
      for (const c of p.cities) {
        const s = getCityStatus(c.id, state);
        if (s === 'favorite') { status = 'favorite'; break; }
        if (s === 'visited') status = status === 'favorite' ? status : 'visited';
        else if (s === 'want' && status === 'none') status = 'want';
        // 愿望清单
        if (wishCityIds.has(c.id) && status === 'none') status = 'want';
      }
      map[p.name] = status;
    }
    return map;
  }, [state, wishCityIds]);

  // City points（已标记 + 愿望清单）
  const cityPoints = useMemo(() => {
    const pts: Array<{ coord: [number, number]; name: string; status: CityStatus; cityId: string; value: number; isWish?: boolean }> = [];
    const seen = new Set<string>();
    for (const c of Object.values(cityMap)) {
      if (!c.isChina) continue;
      const status = getCityStatus(c.id, state);
      if (status !== 'none') {
        const visits = state.trips.filter((t) => t.cityId === c.id).length;
        pts.push({ coord: [c.lng, c.lat], name: c.name, status, cityId: c.id, value: visits || 1 });
        seen.add(c.id);
      }
    }
    // 愿望清单
    for (const id of wishCityIds) {
      if (seen.has(id)) continue;
      const c = cityMap[id];
      if (!c) continue;
      pts.push({ coord: [c.lng, c.lat], name: c.name, status: 'want', cityId: c.id, value: 1, isWish: true });
    }
    return pts;
  }, [state, wishCityIds]);

  const option = useMemo(() => {
    const data = CHINA_PROVINCE_NAMES.map((name) => ({
      name,
      value: statusRank(provinceStatus[name]),
      itemStyle: {
        areaColor: STATUS_COLOR[provinceStatus[name]],
        borderColor: 'rgba(255,255,255,0.6)',
        borderWidth: 0.8,
      },
    }));

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(15,23,42,0.9)',
        borderWidth: 0,
        borderRadius: 10,
        padding: [8, 12],
        textStyle: { color: '#fff', fontSize: 13 },
        formatter: (p: any) => {
          const status = (provinceStatus[p.name] ?? 'none') as CityStatus;
          const label = { none: '未去', want: '想去', visited: '已去', favorite: '特别喜欢' }[status];
          return `<b>${p.name}</b><br/>状态：${label}`;
        },
      },
      geo: {
        map: 'china',
        roam: true,
        scaleLimit: { min: 1, max: 8 },
        zoom: 1.15,
        itemStyle: {
          areaColor: '#c8d0dc',
          borderColor: 'rgba(255,255,255,0.5)',
          borderWidth: 0.8,
        },
        emphasis: {
          itemStyle: { areaColor: '#93c5fd', shadowBlur: 12, shadowColor: 'rgba(96,165,250,0.4)' },
          label: { show: true, color: '#0b1220', fontWeight: 'bold', fontSize: 12 },
        },
        select: { disabled: true },
        label: { show: false },
      },
      series: [
        {
          name: '省份',
          type: 'map',
          map: 'china',
          geoIndex: 0,
          data,
        },
        ...(showCities
          ? [
              // 已标记城市
              {
                name: '城市',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: cityPoints.filter((p) => !p.isWish).map((p) => ({
                  name: p.name,
                  value: [...p.coord, p.value],
                  cityId: p.cityId,
                  status: p.status,
                  itemStyle: {
                    color: STATUS_COLOR[p.status],
                    shadowBlur: p.status === 'favorite' ? 16 : 10,
                    shadowColor: STATUS_COLOR[p.status],
                  },
                })),
                symbolSize: (val: number[]) => 7 + Math.min(val[2] * 2, 14),
                rippleEffect: { brushType: 'stroke', scale: 3 },
                showEffectOn: 'render',
                label: {
                  show: true,
                  formatter: '{b}',
                  position: 'right',
                  fontSize: 11,
                  color: '#0b1220',
                  textShadowBlur: 4,
                  textShadowColor: 'rgba(255,255,255,0.9)',
                },
                emphasis: { scale: 1.5 },
                zlevel: 2,
              } as any,
              // 愿望清单城市（虚线圆环）
              {
                name: '想去',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: cityPoints.filter((p) => p.isWish).map((p) => ({
                  name: `🌟 ${p.name}`,
                  value: [...p.coord, 1],
                  cityId: p.cityId,
                  itemStyle: {
                    color: 'transparent',
                    borderColor: STATUS_COLOR.want,
                    borderWidth: 2,
                    borderType: 'dashed',
                    shadowBlur: 6,
                    shadowColor: 'rgba(96,165,250,0.4)',
                  },
                })),
                symbolSize: 16,
                label: {
                  show: true,
                  formatter: '{b}',
                  position: 'right',
                  fontSize: 10,
                  color: '#3b82f6',
                  textShadowBlur: 3,
                  textShadowColor: 'rgba(255,255,255,0.8)',
                },
                zlevel: 2,
              } as any,
            ]
          : []),
      ],
    };
  }, [provinceStatus, cityPoints, showCities]);

  const onEvents = useMemo(
    () => ({
      click: (params: any) => {
        if (params.seriesType === 'effectScatter' && params.data?.cityId) {
          navigate(`/city/${params.data.cityId}`);
          return;
        }
        if (params.name && CHINA_PROVINCE_NAMES.includes(params.name)) {
          const cur = provinceStatus[params.name] ?? 'none';
          const next = STATUS_NEXT[cur];
          const province = CHINA_PROVINCES.find((p) => p.name === params.name);
          province?.cities.forEach((c) => state.setCityStatus(c.id, next));
          onProvinceClick?.(params.name);
        }
      },
    }),
    [provinceStatus, state, navigate, onProvinceClick]
  );

  if (loadError) {
    return (
      <div className="grid place-items-center" style={{ height }}>
        <div className="glass rounded-2xl px-6 py-4 text-center space-y-2">
          <span className="text-2xl">🗺️</span>
          <p className="text-sm text-gray-500 dark:text-gray-400">中国地图数据加载失败，请检查网络后刷新重试</p>
          <button onClick={() => { setLoadError(false); setReady(false); ensureChinaMap().then((ok) => ok ? setReady(true) : setLoadError(true)); }} className="btn-primary text-xs !px-4 !py-1.5">重试</button>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="grid place-items-center" style={{ height }}>
        <div className="glass rounded-full px-5 py-3 flex items-center gap-3">
          <span className="w-4 h-4 rounded-full border-2 border-brand-400 border-t-transparent animate-spin" />
          <span className="text-sm text-gray-500">地图加载中…</span>
        </div>
      </div>
    );
  }

  return (
    <ReactECharts
      ref={chartRef}
      echarts={echarts}
      option={option}
      onEvents={onEvents}
      notMerge
      lazyUpdate
      style={{ height, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
}

function statusRank(s: CityStatus): number {
  return { none: 0, want: 1, visited: 2, favorite: 3 }[s];
}
