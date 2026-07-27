import * as echarts from 'echarts/core';
import { MapChart, ScatterChart, EffectScatterChart, LinesChart } from 'echarts/charts';
import {
  GeoComponent, TooltipComponent, VisualMapComponent, TitleComponent, GridComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  MapChart, ScatterChart, EffectScatterChart, LinesChart,
  GeoComponent, TooltipComponent, VisualMapComponent, TitleComponent, GridComponent,
  CanvasRenderer,
]);

let chinaRegistered = false;
let chinaFailed = false;
let chinaRegistering: Promise<boolean> | null = null;

// 中国地图 GeoJSON 数据源（按优先级依次尝试）。
// DataV（阿里云）为主源，省份命名带后缀（"北京市"、"江西省"），与项目数据一致；
// jsDelivr 上的 echarts 官方测试数据为备用源，轮廓可渲染，省份命名可能略简化。
// 多源 + 超时，避免单一 CDN 偶发故障导致地图彻底加载不出来。
const CHINA_GEOJSON_SOURCES = [
  'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
  'https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/china.json',
  'https://unpkg.com/echarts@4.9.0/map/json/china.json',
];

async function fetchWithTimeout(url: string, ms = 12000): Promise<Response> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(id);
  }
}

/** Load and register China GeoJSON. Returns true on success, false on failure. */
export async function ensureChinaMap(): Promise<boolean> {
  if (chinaRegistered) return true;
  if (chinaFailed) return false;
  if (chinaRegistering) return chinaRegistering;
  chinaRegistering = (async () => {
    for (const url of CHINA_GEOJSON_SOURCES) {
      try {
        const res = await fetchWithTimeout(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const geo = await res.json();
        echarts.registerMap('china', geo);
        chinaRegistered = true;
        return true;
      } catch (e) {
        console.warn(`[ChinaMap] GeoJSON 源加载失败 ${url}:`, e);
        // 继续尝试下一个数据源
      }
    }
    chinaFailed = true;
    return false;
  })();
  return chinaRegistering;
}

export { echarts };