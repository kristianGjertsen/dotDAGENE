import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  type CSSProperties,
} from 'react';
import './AnimatedLogo.css';

export type AnimatedLogoHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
};

export type AnimatedLogoProps = {
  size?: number | string;
  className?: string;
  duration?: number;
  isAnimated?: boolean;
  animateOnLoad?: boolean;
  backgroundColor?: string;
  foregroundColor?: string;
};

const LETTER_PATH =
  'M373.378,684.36l-0,-14.876l11.131,0c2.497,0 4.79,-0.472 6.882,-1.416c2.091,-0.962 3.753,-2.783 4.992,-5.465c1.257,-2.673 1.889,-6.485 1.889,-11.435l0,-138.81c0,-4.942 -0.674,-8.652 -2.024,-11.131c-1.332,-2.497 -3.052,-4.166 -5.161,-5.027c-2.091,-0.851 -4.478,-1.281 -7.151,-1.281l-10.558,-0l-0,-14.91l88.413,-0c19.834,-0 36.768,3.727 50.801,11.165c14.032,7.447 24.81,18.469 32.349,33.058c7.531,14.598 11.301,32.771 11.301,54.512c-0,20.804 -3.534,39.18 -10.592,55.119c-7.067,15.922 -17.609,28.327 -31.642,37.207c-14.015,8.863 -31.506,13.29 -52.487,13.29l-88.143,0Zm82.105,-17.473c12.211,-0 22.373,-3.517 30.494,-10.558c8.112,-7.059 14.269,-17.17 18.451,-30.326c4.2,-13.172 6.308,-28.926 6.308,-47.259c0,-18.3 -2.108,-33.463 -6.308,-45.472c-4.182,-12.025 -10.339,-21.049 -18.451,-27.053c-8.121,-6.021 -18.182,-9.04 -30.191,-9.04l-14.876,-0l0,169.708l14.573,-0Z';

const AnimatedLogo = forwardRef<AnimatedLogoHandle, AnimatedLogoProps>(
  (
    {
      size = 90,
      className = '',
      duration = 1.5,
      isAnimated = true,
      animateOnLoad = false,
      backgroundColor = '#677b4c00',
      foregroundColor = '#ffffff',
    },
    ref,
  ) => {
    const [animationKey, setAnimationKey] = useState(0);
    const [isAnimating, setIsAnimating] = useState(animateOnLoad);

    const startAnimation = useCallback(() => {
      if (!isAnimated) return;
      setAnimationKey((prev) => prev + 1);
      setIsAnimating(true);
    }, [isAnimated]);

    const stopAnimation = useCallback(() => {
      setIsAnimating(false);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        startAnimation,
        stopAnimation,
      }),
      [startAnimation, stopAnimation],
    );

    useEffect(() => {
      if (!isAnimating) return;

      const timeout = window.setTimeout(() => {
        setIsAnimating(false);
      }, duration * 1000);

      return () => window.clearTimeout(timeout);
    }, [isAnimating, duration, animationKey]);

    const resolvedSize = typeof size === 'number' ? `${size}px` : size;

    const animationStyle = {
      '--footer-logo-duration': `${duration}s`,
      height: resolvedSize,
      width: resolvedSize,
    } as CSSProperties;

    return (
      <svg
        viewBox="187 365 463 435"
        xmlns="http://www.w3.org/2000/svg"
        className={`footer-logo ${className}`.trim()}
        style={animationStyle}
        role="img"
        aria-label="dotDAGENE logo"
        onMouseEnter={startAnimation}
        onMouseLeave={stopAnimation}
      >
        <rect
          x="187.198"
          y="364.974"
          width="462.557"
          height="435.352"
          fill={backgroundColor}
        />

        <g
          key={animationKey}
          className={isAnimating ? 'footer-logo-animate' : ''}
        >
          <path
            className="footer-logo-letter-outline"
            d={LETTER_PATH}
            pathLength={100}
            fill="none"
            stroke={foregroundColor}
          />

          <path
            className="footer-logo-letter-fill"
            d={LETTER_PATH}
            fill={foregroundColor}
          />

          <ellipse
            className="footer-logo-dot"
            cx="296.838"
            cy="634.1175"
            rx="48.7855"
            ry="51.4675"
            fill={foregroundColor}
          />
        </g>
      </svg>
    );
  },
);

AnimatedLogo.displayName = 'AnimatedLogo';

export default AnimatedLogo;
