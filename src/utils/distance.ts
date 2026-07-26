import { cityMap } from '@/data/cities';
import type { Trip } from '@/types';

const R = 6371; // 地球半径 km

/** Haversine 公式计算两点间球面距离（km） */
export function haversine(lng1: number, lat1: number, lng2: number, lat2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * 按时间顺序计算每次旅行「距上一站城市」的里程（km）。
 * 第一段旅行无上一站，里程记为 0。
 * 返回一个 tripId → 距离 的映射。
 */
export function computeTripDistances(trips: Trip[]): Record<string, number> {
  const sorted = [...trips].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const map: Record<string, number> = {};
  let prevLng: number | null = null;
  let prevLat: number | null = null;
  for (const t of sorted) {
    const city = cityMap[t.cityId];
    if (!city) {
      map[t.id] = 0;
      continue;
    }
    if (prevLng !== null && prevLat !== null) {
      map[t.id] = Math.round(haversine(prevLng, prevLat, city.lng, city.lat));
    } else {
      map[t.id] = 0;
    }
    prevLng = city.lng;
    prevLat = city.lat;
  }
  return map;
}

/** 单次旅行距上一站的里程（km） */
export function tripDistance(trip: Trip, allTrips: Trip[]): number {
  return computeTripDistances(allTrips)[trip.id] ?? 0;
}
