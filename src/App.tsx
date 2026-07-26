import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';

const MapPage = lazy(() => import('@/pages/MapPage'));
const CityDetail = lazy(() => import('@/pages/CityDetail'));
const Diary = lazy(() => import('@/pages/Diary'));
const VideoPage = lazy(() => import('@/pages/VideoPage'));
const Timeline = lazy(() => import('@/pages/Timeline'));
const Stats = lazy(() => import('@/pages/Stats'));
const Review = lazy(() => import('@/pages/Review'));
const Bucket = lazy(() => import('@/pages/Bucket'));
const Search = lazy(() => import('@/pages/Search'));
const Profile = lazy(() => import('@/pages/Profile'));
const Achievements = lazy(() => import('@/pages/Achievements'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function Loader() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="glass rounded-full px-5 py-3 flex items-center gap-3">
        <span className="w-4 h-4 rounded-full border-2 border-brand-400 border-t-transparent animate-spin" />
        <span className="text-sm text-gray-500">加载中…</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="map" element={<Suspense fallback={<Loader />}><MapPage /></Suspense>} />
        <Route path="city/:id" element={<Suspense fallback={<Loader />}><CityDetail /></Suspense>} />
        <Route path="diary/:tripId" element={<Suspense fallback={<Loader />}><Diary /></Suspense>} />
        <Route path="video" element={<Suspense fallback={<Loader />}><VideoPage /></Suspense>} />
        <Route path="timeline" element={<Suspense fallback={<Loader />}><Timeline /></Suspense>} />
        <Route path="stats" element={<Suspense fallback={<Loader />}><Stats /></Suspense>} />
        <Route path="review" element={<Suspense fallback={<Loader />}><Review /></Suspense>} />
        <Route path="bucket" element={<Suspense fallback={<Loader />}><Bucket /></Suspense>} />
        <Route path="search" element={<Suspense fallback={<Loader />}><Search /></Suspense>} />
        <Route path="profile" element={<Suspense fallback={<Loader />}><Profile /></Suspense>} />
        <Route path="achievements" element={<Suspense fallback={<Loader />}><Achievements /></Suspense>} />
        <Route path="*" element={<Suspense fallback={<Loader />}><NotFound /></Suspense>} />
      </Route>
    </Routes>
  );
}
