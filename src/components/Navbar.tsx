import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  IconHome, IconMap, IconTimeline, IconChart,
  IconCompass, IconSearch, IconUser, IconSun, IconMoon, IconMenu, IconClose, IconBookmark,
} from './Icons';

const links = [
  { to: '/', label: '首页', icon: IconHome, end: true },
  { to: '/map', label: '地图', icon: IconMap },
  { to: '/timeline', label: '时间轴', icon: IconTimeline },
  { to: '/stats', label: '统计', icon: IconChart },
  { to: '/review', label: '年度回顾', icon: IconCompass },
  { to: '/bucket', label: '愿望清单', icon: IconBookmark },
  { to: '/search', label: '搜索', icon: IconSearch },
  { to: '/profile', label: '我的', icon: IconUser },
];

export default function Navbar() {
  const { theme, toggleTheme } = useStore();
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-5 pt-3">
        <nav className="glass glass-sheen mx-auto max-w-7xl flex items-center gap-1 px-3 sm:px-4 py-2.5 rounded-full">
          <NavLink to="/" className="flex items-center gap-2 pr-3 mr-1 shrink-0" onClick={() => setOpen(false)}>
            <span className="grid place-items-center w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-glow">
              <IconCompass width={18} height={18} />
            </span>
            <span className="font-bold text-lg tracking-tight hidden sm:block">TravelMap</span>
          </NavLink>

          <div className="hidden lg:flex items-center gap-0.5 flex-1">
            {links.map((l) => (
              <NavItem key={l.to} {...l} />
            ))}
          </div>

          <div className="flex items-center gap-1 ml-auto lg:ml-0">
            <button
              onClick={toggleTheme}
              className="btn-glass !p-2.5"
              aria-label="切换主题"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'light' ? (
                  <motion.span key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <IconMoon width={18} height={18} />
                  </motion.span>
                ) : (
                  <motion.span key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <IconSun width={18} height={18} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              className="btn-glass !p-2.5 lg:hidden"
              aria-label="菜单"
            >
              {open ? <IconClose width={18} height={18} /> : <IconMenu width={18} height={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed top-20 inset-x-3 z-50 lg:hidden"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <div className="glass-strong rounded-glass p-3 grid grid-cols-3 gap-2">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all ${
                        isActive ? 'bg-brand-500/20 text-brand-600 dark:text-brand-300' : 'hover:bg-white/20 dark:hover:bg-white/5'
                      }`
                    }
                  >
                    <l.icon width={22} height={22} />
                    <span className="text-xs font-medium">{l.label}</span>
                  </NavLink>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Scroll-to-top on route change handled by key */}
      <RouteScroller key={loc.pathname} />
    </>
  );
}

function NavItem({ to, label, icon: Icon, end }: { to: string; label: string; icon: typeof IconHome; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
          isActive ? 'text-brand-600 dark:text-brand-300' : 'hover:bg-white/20 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="nav-active"
              className="absolute inset-0 rounded-full bg-brand-500/15 border border-brand-500/20"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
          <Icon width={16} height={16} className="relative z-10" />
          <span className="relative z-10">{label}</span>
        </>
      )}
    </NavLink>
  );
}

function RouteScroller() {
  if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  return null;
}
