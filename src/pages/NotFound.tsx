import { Link } from 'react-router-dom';
import { IconCompass } from '@/components/Icons';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center py-24">
      <div className="glass-strong rounded-glass-lg p-10">
        <div className="grid place-items-center w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white mb-5 animate-float">
          <IconCompass width={32} height={32} />
        </div>
        <h1 className="text-5xl font-extrabold mb-2">404</h1>
        <p className="text-gray-500 mb-6">这条路还没走过，回到主路吧～</p>
        <Link to="/" className="btn-primary">返回首页</Link>
      </div>
    </div>
  );
}
