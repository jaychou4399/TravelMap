import { IconStar } from './Icons';
import { useState } from 'react';

interface Props {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
}

export default function StarRating({ value, onChange, size = 20 }: Props) {
  const [hover, setHover] = useState(0);
  const interactive = !!onChange;
  const shown = hover || value;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onChange?.(i === value ? 0 : i)}
          className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
          aria-label={`${i} 星`}
        >
          <IconStar
            width={size}
            height={size}
            className={i <= shown ? 'star-active' : 'text-gray-400/40 dark:text-gray-500/40'}
            fill={i <= shown ? 'currentColor' : 'none'}
          />
        </button>
      ))}
    </div>
  );
}
