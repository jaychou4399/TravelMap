import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { ALL_CITIES, cityMap } from '@/data/cities';
import type { City, Trip } from '@/types';
import {
  IconSearch, IconClose, IconLocation, IconCalendar,
  IconStar, IconCompass, IconBookmark,
} from '@/components/Icons';

interface CityHit {
  city: City;
  matched: string;
}

interface TripHit {
  trip: Trip;
  matched: string;
  matchedKind: 'tag' | 'year' | 'diary' | 'feeling';
}

const SUGGESTED_TAGS = ['西湖', '春日', '茶', '周末', '海岛', '夕阳', '古建筑', '雪山', '极光', '樱花'];
const SUGGESTED_CITIES = ['北京', '上海', '杭州', '京都', '巴黎', '冰岛', '东京'];

export default function Search() {
  const state = useStore();
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return { cities: [] as CityHit[], trips: [] as TripHit[] };

    const cities: CityHit[] = ALL_CITIES.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.province.toLowerCase().includes(q)
      );
    }).slice(0, 30).map((c) => {
      let matched = c.name;
      if (c.nameEn.toLowerCase().includes(q)) matched = c.nameEn;
      else if (c.country.toLowerCase().includes(q)) matched = c.country;
      else if (c.province.toLowerCase().includes(q)) matched = c.province;
      return { city: c, matched };
    });

    const trips: TripHit[] = [];
    for (const t of state.trips) {
      const tagHit = t.tags.find((tag) => tag.toLowerCase().includes(q));
      if (tagHit) {
        trips.push({ trip: t, matched: tagHit, matchedKind: 'tag' });
        continue;
      }
      const year = t.startDate.slice(0, 4);
      if (year.includes(q)) {
        trips.push({ trip: t, matched: year, matchedKind: 'year' });
        continue;
      }
      if (t.feeling && t.feeling.toLowerCase().includes(q)) {
        trips.push({ trip: t, matched: t.feeling, matchedKind: 'feeling' });
        continue;
      }
      if (t.diary && t.diary.toLowerCase().includes(q)) {
        const idx = t.diary.toLowerCase().indexOf(q);
        const start = Math.max(0, idx - 12);
        const end = Math.min(t.diary.length, idx + q.length + 12);
        const snippet = (start > 0 ? '…' : '') + t.diary.slice(start, end) + (end < t.diary.length ? '…' : '');
        trips.push({ trip: t, matched: snippet, matchedKind: 'diary' });
        continue;
      }
    }

    return { cities, trips: trips.slice(0, 30) };
  }, [q, state.trips]);

  const totalCount = results.cities.length + results.trips.length;

  const MATCHED_KIND_LABEL: Record<TripHit['matchedKind'], string> = {
    tag: '标签',
    year: '年份',
    diary: '日记',
    feeling: '感受',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* ===== Header ===== */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 text-brand-500 mb-2">
          <IconSearch width={22} height={22} />
          <span className="text-sm font-semibold tracking-wide">SEARCH</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">搜索</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          搜索城市、国家、景点、标签、年份、日记
        </p>
      </motion.div>

      {/* ===== Search Box ===== */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="glass-strong glass-sheen rounded-glass p-2 mb-5 flex items-center gap-2"
      >
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shrink-0">
          <IconSearch width={18} height={18} />
        </span>
        <input
          autoFocus
          type="text"
          className="flex-1 bg-transparent outline-none px-2 py-2.5 text-base placeholder:text-gray-400"
          placeholder="输入城市、国家、标签、年份或日记关键词…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="btn-glass !p-2 shrink-0"
            aria-label="清空"
          >
            <IconClose width={16} height={16} />
          </button>
        )}
      </motion.div>

      {/* ===== Suggestions (empty query) ===== */}
      <AnimatePresence mode="wait">
        {!q ? (
          <motion.div
            key="suggestions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-5"
          >
            <SuggestionGroup
              icon={<IconCompass width={16} height={16} />}
              title="热门城市"
              items={SUGGESTED_CITIES}
              onPick={setQuery}
            />
            <SuggestionGroup
              icon={<IconBookmark width={16} height={16} />}
              title="热门标签"
              items={SUGGESTED_TAGS}
              onPick={setQuery}
            />
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-5"
          >
            {/* Result summary */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                共找到 <span className="font-bold text-brand-600 dark:text-brand-300">{totalCount}</span> 条与
                「<span className="font-semibold">{query}</span>」相关的结果
              </p>
            </div>

            {totalCount === 0 && <NoResults query={query} />}

            {/* City results */}
            {results.cities.length > 0 && (
              <ResultSection title="城市" count={results.cities.length}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {results.cities.map((hit, i) => (
                    <motion.div
                      key={hit.city.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.04, 0.3) }}
                    >
                      <Link
                        to={`/city/${hit.city.id}`}
                        className="block group glass glass-sheen rounded-glass p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-glass"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <div className="font-bold text-base truncate group-hover:text-brand-600 dark:group-hover:text-brand-300">
                              {hit.city.name}
                            </div>
                            <div className="text-xs text-gray-400">{hit.city.nameEn}</div>
                          </div>
                          <IconLocation width={16} height={16} className="text-brand-400 shrink-0 mt-0.5" />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <IconLocation width={12} height={12} />
                          <span className="truncate">{hit.city.country} · {hit.city.province}</span>
                        </div>
                        <div className="mt-2">
                          <span className="chip !text-[10px] !px-2 !py-0.5">匹配：{hit.matched}</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </ResultSection>
            )}

            {/* Trip results */}
            {results.trips.length > 0 && (
              <ResultSection title="旅行记录" count={results.trips.length}>
                <div className="grid sm:grid-cols-2 gap-3">
                  {results.trips.map((hit, i) => {
                    const city = cityMap[hit.trip.cityId];
                    return (
                      <motion.div
                        key={hit.trip.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.04, 0.3) }}
                      >
                        <Link
                          to={`/city/${hit.trip.cityId}`}
                          className="block group glass glass-sheen rounded-glass p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-glass"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0">
                              <div className="font-bold text-base truncate group-hover:text-brand-600 dark:group-hover:text-brand-300">
                                {city?.name ?? hit.trip.cityId}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                <IconCalendar width={12} height={12} /> {hit.trip.startDate}
                              </div>
                            </div>
                            <span className="flex items-center gap-0.5 text-xs shrink-0">
                              <IconStar width={12} height={12} fill="currentColor" className="star-active" />
                              {hit.trip.rating}
                            </span>
                          </div>
                          {hit.trip.feeling && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                              {hit.trip.feeling}
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="chip !text-[10px] !px-2 !py-0.5">
                              {MATCHED_KIND_LABEL[hit.matchedKind]}：{hit.matched}
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </ResultSection>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultSection({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="glass rounded-glass p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="chip">{count} 条</span>
      </div>
      {children}
    </section>
  );
}

function SuggestionGroup({
  icon,
  title,
  items,
  onPick,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  onPick: (v: string) => void;
}) {
  return (
    <div className="glass glass-sheen rounded-glass p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-brand-500">{icon}</span>
        <h3 className="font-bold">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onPick(item)}
            className="chip hover:scale-105 transition-transform cursor-pointer"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="glass rounded-glass p-10 text-center">
      <div className="grid place-items-center w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-brand-400/30 to-fuchsia-400/30 text-brand-500 mb-3">
        <IconSearch width={24} height={24} />
      </div>
      <h3 className="font-bold mb-1">没有找到匹配的结果</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        试试其他关键词，比如「{query}」的近似词或单个字。
      </p>
    </div>
  );
}
