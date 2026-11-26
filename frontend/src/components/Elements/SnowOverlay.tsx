import type { CSSProperties } from 'react';
import { Snowflake } from 'lucide-react';
import './SnowOverlay.css';

interface SnowOverlayProps {
  count?: number;
  color?: string;
}

// Stable variation keeps the snow from jumping when the parent rerenders.
const variation = (index: number, seed: number) =>
  (((index + 1) * seed) % 101) / 101;

export const SnowOverlay = ({
  count = 45,
  color = 'var(--color-secondary)',
}: SnowOverlayProps) => (
  <div className="snow-overlay" aria-hidden="true" style={{ color }}>
    {Array.from(
      { length: Math.min(150, Math.max(0, Math.floor(count) || 0)) },
      (_, index) => {
        const duration = 12 + variation(index, 37) * 16;

        return (
          <span
            key={index}
            className="snow-overlay__flake"
            style={
              {
                left: `${variation(index, 61) * 100}%`,
                opacity: 0.3 + variation(index, 43) * 0.5,
                animationDuration: `${duration}s`,
                animationDelay: `${-variation(index, 29) * duration}s`,
                '--snow-drift': `${(variation(index, 17) - 0.5) * 120}px`,
              } as CSSProperties
            }
          >
            <Snowflake
              size={12 + variation(index, 53) * 20}
              strokeWidth={1.5}
            />
          </span>
        );
      },
    )}
  </div>
);
