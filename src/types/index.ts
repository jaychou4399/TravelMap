// ============================================================
// TravelMap · Type Definitions
// ============================================================

/** City visit status on the map */
export type CityStatus = 'none' | 'want' | 'visited' | 'favorite';

/** Transport methods */
export type Transport = 'plane' | 'train' | 'car' | 'bus' | 'ship' | 'bike' | 'walk' | 'other';

/** A city entry in the catalog (China + World) */
export interface City {
  id: string;
  name: string;          // 中文名
  nameEn: string;        // English name
  country: string;       // 国家
  countryCode: string;   // ISO-2 country code
  province: string;      // 省份 (China) / state / region
  isChina: boolean;
  lng: number;
  lat: number;
}

/** A travel record / trip to a city */
export interface Trip {
  id: string;
  cityId: string;
  startDate: string;     // ISO date
  endDate: string;       // ISO date
  days: number;
  cost: number;          // 花费 (CNY)
  transport: Transport;
  hotel: string;
  companions: string[];  // 同行人员
  weather: string;       // 天气
  rating: number;        // 0~5
  tags: string[];
  feeling: string;       // 一句话感受
  cover: string;         // cover image url
  photos: Photo[];
  videos: Video[];
  diary: string;         // markdown content
  distance: number;      // mileage from previous city (km)
}

export interface Photo {
  id: string;
  url: string;
  cityId: string;
  tripId: string;
  date: string;
  caption: string;
  tags: string[];
  width: number;
  height: number;
}

export interface Video {
  id: string;
  url: string;
  cityId: string;
  tripId: string;
  title: string;
  date: string;
  thumbnail: string;
  duration: number; // seconds
}

/** Bucket list wish item */
export interface Wish {
  id: string;
  name: string;
  type: 'city' | 'country';
  country?: string;
  priority: 1 | 2 | 3;       // 1 高 3 低
  plannedDate: string;       // 预计时间
  budget: number;
  note: string;
}

/** Achievement */
export interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  unlocked: boolean;
  unlockedAt?: string;
}

/** User profile */
export interface Profile {
  avatar: string;
  nickname: string;
  bio: string;
  joinedAt: string;
}

/** Map view per-city status is derived from trips + wishes */
export interface CityState {
  cityId: string;
  status: CityStatus;
  visits: number;
}

/** Theme */
export type Theme = 'light' | 'dark';

/** Supabase sync interface (reserved) */
export interface SyncAdapter {
  pull(): Promise<Partial<AppData>>;
  push(data: AppData): Promise<void>;
}

/** Top-level persisted app data */
export interface AppData {
  profile: Profile;
  trips: Trip[];
  wishes: Wish[];
  achievements: Achievement[];
  cityStatusOverrides: Record<string, CityStatus>; // manual map status overrides
}
