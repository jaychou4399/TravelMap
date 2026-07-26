import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppData,
  Trip,
  Wish,
  Profile,
  Theme,
  CityStatus,
  Achievement,
  Photo,
} from '@/types';
import { ALL_CITIES, CHINA_PROVINCE_NAMES, cityMap } from '@/data/cities';
import { SAMPLE_TRIPS, SAMPLE_VIDEOS } from '@/data/sampleData';
import { computeTripDistances } from '@/utils/distance';

// ---- Achievements catalog ----
export const ACHIEVEMENTS: Achievement[] = [
  // 旅行起步
  { id: 'first-trip', icon: '🎒', title: '初次启程', desc: '记录你的第一次旅行', unlocked: false },
  { id: 'leave-home', icon: '🌱', title: '踏出家乡', desc: '前往家乡以外的城市旅行', unlocked: false },
  // 城市探索
  { id: 'cities-3', icon: '🏙️', title: '三城足迹', desc: '足迹踏遍 3 座城市', unlocked: false },
  { id: 'cities-10', icon: '🗺️', title: '十城足迹', desc: '足迹踏遍 10 座城市', unlocked: false },
  { id: 'cities-50', icon: '🌍', title: '五十城足迹', desc: '足迹踏遍 50 座城市', unlocked: false },
  { id: 'cities-100', icon: '🌐', title: '百城足迹', desc: '足迹踏遍 100 座城市', unlocked: false },
  // 省份 / 国家
  { id: 'provinces-2', icon: '🧭', title: '双省探索', desc: '去过 2 个以上省份', unlocked: false },
  { id: 'provinces-5', icon: '🇨🇳', title: '五省行者', desc: '去过 5 个以上省份', unlocked: false },
  { id: 'china-tour', icon: '🏯', title: '环游中国', desc: '去过 20 个以上省份', unlocked: false },
  { id: 'world-tour', icon: '🛕', title: '环游世界', desc: '去过 10 个以上国家', unlocked: false },
  // 摄影
  { id: 'photos-10', icon: '📷', title: '摄影新手', desc: '上传 10 张以上照片', unlocked: false },
  { id: 'photos-100', icon: '📸', title: '摄影达人', desc: '上传 100 张以上照片', unlocked: false },
  { id: 'photos-1000', icon: '🎞️', title: '摄影大师', desc: '上传 1000 张以上照片', unlocked: false },
  // 交通 / 天数
  { id: 'train-3', icon: '🚂', title: '火车旅行家', desc: '乘坐 3 次以上火车出行', unlocked: false },
  { id: 'plane-5', icon: '✈️', title: '飞行常客', desc: '乘坐 5 次以上飞机出行', unlocked: false },
  { id: 'days-15', icon: '📅', title: '累计半月', desc: '总旅行天数达到 15 天', unlocked: false },
  { id: 'streak-30', icon: '🏕️', title: '长途旅行', desc: '一次旅行超过 30 天', unlocked: false },
  // 评价 / 时节
  { id: 'five-star', icon: '⭐', title: '五星好评', desc: '为某次旅行打出五星', unlocked: false },
  { id: 'all-five-star', icon: '🌟', title: '全程满分', desc: '所有旅行都评为五星', unlocked: false },
  { id: 'qingming', icon: '🌸', title: '踏青时节', desc: '清明节假期出行', unlocked: false },
  { id: 'summer', icon: '☀️', title: '盛夏出游', desc: '盛夏七月或八月出行', unlocked: false },
  { id: 'one-day', icon: '🎯', title: '一日游达人', desc: '完成一次一日游旅行', unlocked: false },
];

// 家乡 / 常驻地（用于判断「踏出家乡」成就）
const HOME_CITY_IDS = ['cn-jx-fuzhou', 'cn-jx-yichun'];

const DEFAULT_PROFILE: Profile = {
  avatar: 'https://picsum.photos/seed/travelmap-avatar/200/200',
  nickname: '旅行者',
  bio: '用脚步丈量世界，用镜头记录美好。',
  joinedAt: '2024-01-01',
};

const DEFAULT_DATA: AppData = {
  profile: DEFAULT_PROFILE,
  trips: SAMPLE_TRIPS,
  wishes: [
    { id: 'w3', name: '厦门', type: 'city', country: '中国', priority: 2, plannedDate: '2026-10', budget: 2000, note: '鼓浪屿，曾厝垵，环岛路' },
  ],
  achievements: ACHIEVEMENTS,
  // 抚州（家）、宜春（学校）作为常驻地直接标记为已去
  cityStatusOverrides: {
    'cn-jx-fuzhou': 'visited',
    'cn-jx-yichun': 'visited',
  },
};

interface StoreState extends AppData {
  theme: Theme;
  videos: typeof SAMPLE_VIDEOS;
  // actions
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setProfile: (p: Partial<Profile>) => void;
  addTrip: (t: Trip) => void;
  updateTrip: (id: string, patch: Partial<Trip>) => void;
  removeTrip: (id: string) => void;
  setCityStatus: (cityId: string, status: CityStatus) => void;
  addWish: (w: Wish) => void;
  updateWish: (id: string, patch: Partial<Wish>) => void;
  removeWish: (id: string) => void;
  addVideo: (v: (typeof SAMPLE_VIDEOS)[number]) => void;
  addPhoto: (tripId: string, photo: Photo) => void;
  removePhoto: (photoId: string) => void;
  updatePhoto: (photoId: string, patch: Partial<Photo>) => void;
  resetData: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_DATA,
      // 首次加载即根据示例数据计算成就解锁状态（而非全 false）
      achievements: recomputeAchievements(SAMPLE_TRIPS, DEFAULT_DATA.wishes),
      theme: 'light',
      videos: SAMPLE_VIDEOS,

      setTheme: (t) => set({ theme: t }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),

      addTrip: (t) =>
        set((s) => {
          const trips = [t, ...s.trips];
          return { trips, achievements: recomputeAchievements(trips, s.wishes) };
        }),
      updateTrip: (id, patch) =>
        set((s) => {
          const trips = s.trips.map((t) => (t.id === id ? { ...t, ...patch } : t));
          return { trips, achievements: recomputeAchievements(trips, s.wishes) };
        }),
      removeTrip: (id) =>
        set((s) => {
          const trips = s.trips.filter((t) => t.id !== id);
          return { trips, achievements: recomputeAchievements(trips, s.wishes) };
        }),

      setCityStatus: (cityId, status) =>
        set((s) => ({
          cityStatusOverrides: { ...s.cityStatusOverrides, [cityId]: status },
        })),

      addWish: (w) => set((s) => ({ wishes: [...s.wishes, w] })),
      updateWish: (id, patch) =>
        set((s) => ({ wishes: s.wishes.map((w) => (w.id === id ? { ...w, ...patch } : w)) })),
      removeWish: (id) => set((s) => ({ wishes: s.wishes.filter((w) => w.id !== id) })),

      addVideo: (v) => set((s) => ({ videos: [v, ...s.videos] })),

      // 把照片（外部图床 URL）追加到指定 trip
      addPhoto: (tripId, photo) =>
        set((s) => {
          const trips = s.trips.map((t) => (t.id === tripId ? { ...t, photos: [...t.photos, photo] } : t));
          return { trips, achievements: recomputeAchievements(trips, s.wishes) };
        }),
      removePhoto: (photoId) =>
        set((s) => {
          const trips = s.trips.map((t) => ({ ...t, photos: t.photos.filter((p) => p.id !== photoId) }));
          return { trips, achievements: recomputeAchievements(trips, s.wishes) };
        }),
      updatePhoto: (photoId, patch) =>
        set((s) => {
          const trips = s.trips.map((t) => ({
            ...t,
            photos: t.photos.map((p) => (p.id === photoId ? { ...p, ...patch } : p)),
          }));
          return { trips, achievements: recomputeAchievements(trips, s.wishes) };
        }),

      resetData: () => set({ ...DEFAULT_DATA, videos: SAMPLE_VIDEOS }),
    }),
    {
      name: 'travelmap-store',
      version: 14,
      migrate: () => null, // 版本升级时丢弃旧数据，使用默认示例数据
    }
  )
);

// ============================================================
// Derived helpers (selectors)
// ============================================================

/** All photos across trips */
export function allPhotos(trips: Trip[]): Photo[] {
  return trips.flatMap((t) => t.photos);
}

/** Status of a city: favorite > visited > want > none */
export function getCityStatus(cityId: string, state: StoreState): CityStatus {
  const override = state.cityStatusOverrides[cityId];
  if (override === 'favorite' || override === 'want') return override;
  const trips = state.trips.filter((t) => t.cityId === cityId);
  if (trips.some((t) => t.rating >= 5)) return 'favorite';
  if (trips.length > 0) return 'visited';
  return override ?? 'none';
}

/** Visits count per city */
export function cityVisitCount(cityId: string, trips: Trip[]): number {
  return trips.filter((t) => t.cityId === cityId).length;
}

// ============================================================
// Statistics
// ============================================================
export interface TravelStats {
  cityCount: number;
  countryCount: number;
  provinceCount: number;
  tripCount: number;
  totalDays: number;
  totalDistance: number; // km
  photoCount: number;
  videoCount: number;
  planeCount: number;
  trainCount: number;
  longestTripDays: number;
  farthestDistance: number;
  avgRating: number;
  chinaCompletion: number; // 0~1
  worldCompletion: number; // 0~1
}

export function computeStats(state: StoreState): TravelStats {
  const { trips, videos, cityStatusOverrides } = state;
  // Trips + overrides（手动标记为已去/收藏的城市也要计入统计）
  const visitedCityIds = new Set(trips.map((t) => t.cityId));
  for (const [id, s] of Object.entries(cityStatusOverrides)) {
    if (s === 'visited' || s === 'favorite') visitedCityIds.add(id);
  }
  const visitedCities = [...visitedCityIds].map((id) => cityMap[id]).filter(Boolean);
  const countries = new Set(visitedCities.map((c) => c.country));
  const provinces = new Set(visitedCities.filter((c) => c.isChina).map((c) => c.province));
  const photos = allPhotos(trips);

  const planeCount = trips.filter((t) => t.transport === 'plane').length;
  const trainCount = trips.filter((t) => t.transport === 'train').length;
  const totalDays = trips.reduce((a, t) => a + t.days, 0);
  // 按时间顺序自动计算各段里程，而非依赖写死的 distance 字段
  const distMap = computeTripDistances(trips);
  const distValues = trips.map((t) => distMap[t.id] ?? 0);
  const totalDistance = distValues.reduce((a, d) => a + d, 0);
  const longestTripDays = trips.reduce((a, t) => Math.max(a, t.days), 0);
  const farthestDistance = distValues.reduce((a, d) => Math.max(a, d), 0);
  const rated = trips.filter((t) => t.rating > 0);
  const avgRating = rated.length ? rated.reduce((a, t) => a + t.rating, 0) / rated.length : 0;

  const chinaCompletion = provinces.size / CHINA_PROVINCE_NAMES.length;
  const totalCountries = new Set(ALL_CITIES.map((c) => c.country)).size;
  const worldCompletion = countries.size / totalCountries;

  return {
    cityCount: visitedCityIds.size,
    countryCount: countries.size,
    provinceCount: provinces.size,
    tripCount: trips.length,
    totalDays,
    totalDistance,
    photoCount: photos.length,
    videoCount: videos.length,
    planeCount,
    trainCount,
    longestTripDays,
    farthestDistance,
    avgRating,
    chinaCompletion,
    worldCompletion,
  };
}

/** Recompute achievement unlocked flags */
function recomputeAchievements(trips: Trip[], _wishes: Wish[]): Achievement[] {
  const stats = computeStats({ trips, wishes: _wishes, achievements: ACHIEVEMENTS, cityStatusOverrides: {}, profile: DEFAULT_PROFILE, videos: SAMPLE_VIDEOS, theme: 'light', setTheme: () => {}, toggleTheme: () => {}, setProfile: () => {}, addTrip: () => {}, updateTrip: () => {}, removeTrip: () => {}, setCityStatus: () => {}, addWish: () => {}, updateWish: () => {}, removeWish: () => {}, addVideo: () => {}, addPhoto: () => {}, removePhoto: () => {}, resetData: () => {} });
  const now = new Date().toISOString();

  // 基于旅行明细的额外判断
  const leftHome = trips.some((t) => !HOME_CITY_IDS.includes(t.cityId));
  const hasFiveStar = trips.some((t) => t.rating >= 5);
  const allFiveStar = trips.length > 0 && trips.every((t) => t.rating >= 5);
  const hasOneDay = trips.some((t) => t.days === 1);
  // 清明：4 月初（4/4~4/6 附近，简化为月份=4 且日期<=6）
  const hasQingming = trips.some((t) => {
    const m = Number(t.startDate.slice(5, 7));
    const d = Number(t.startDate.slice(8, 10));
    return m === 4 && d <= 6;
  });
  // 盛夏：7 月或 8 月
  const hasSummer = trips.some((t) => {
    const m = Number(t.startDate.slice(5, 7));
    return m === 7 || m === 8;
  });

  return ACHIEVEMENTS.map((a) => {
    let cond = false;
    switch (a.id) {
      case 'first-trip': cond = stats.tripCount >= 1; break;
      case 'leave-home': cond = leftHome; break;
      case 'cities-3': cond = stats.cityCount >= 3; break;
      case 'cities-10': cond = stats.cityCount >= 10; break;
      case 'cities-50': cond = stats.cityCount >= 50; break;
      case 'cities-100': cond = stats.cityCount >= 100; break;
      case 'provinces-2': cond = stats.provinceCount >= 2; break;
      case 'provinces-5': cond = stats.provinceCount >= 5; break;
      case 'china-tour': cond = stats.provinceCount >= 20; break;
      case 'world-tour': cond = stats.countryCount >= 10; break;
      case 'photos-10': cond = stats.photoCount >= 10; break;
      case 'photos-100': cond = stats.photoCount >= 100; break;
      case 'photos-1000': cond = stats.photoCount >= 1000; break;
      case 'train-3': cond = stats.trainCount >= 3; break;
      case 'plane-5': cond = stats.planeCount >= 5; break;
      case 'days-15': cond = stats.totalDays >= 15; break;
      case 'streak-30': cond = stats.longestTripDays >= 30; break;
      case 'five-star': cond = hasFiveStar; break;
      case 'all-five-star': cond = allFiveStar; break;
      case 'qingming': cond = hasQingming; break;
      case 'summer': cond = hasSummer; break;
      case 'one-day': cond = hasOneDay; break;
    }
    return { ...a, unlocked: cond, unlockedAt: cond ? a.unlockedAt ?? now : undefined };
  });
}

/** Trips sorted by start date desc */
export function tripsByDateDesc(trips: Trip[]): Trip[] {
  return [...trips].sort((a, b) => b.startDate.localeCompare(a.startDate));
}

/** Trips grouped by year (desc) */
export function tripsByYear(trips: Trip[]): Record<string, Trip[]> {
  const groups: Record<string, Trip[]> = {};
  for (const t of tripsByDateDesc(trips)) {
    const y = t.startDate.slice(0, 4);
    (groups[y] ??= []).push(t);
  }
  return groups;
}
