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

const CHINA_GEOJSON_URL = 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json';

/** Load and register China GeoJSON. Returns true on success, false on failure. */
export async function ensureChinaMap(): Promise<boolean> {
  if (chinaRegistered) return true;
  if (chinaFailed) return false;
  if (chinaRegistering) return chinaRegistering;
  chinaRegistering = (async () => {
    try {
      const res = await fetch(CHINA_GEOJSON_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const geo = await res.json();
      echarts.registerMap('china', geo);
      chinaRegistered = true;
      return true;
    } catch (e) {
      console.warn('Failed to load China GeoJSON:', e);
      chinaFailed = true;
      return false;
    }
  })();
  return chinaRegistering;
}

export { echarts };