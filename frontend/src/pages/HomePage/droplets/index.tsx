'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { mountDroplets } from './engine.js';

export interface DropletHeroProps {
    title?: string;
    backgroundColor?: string;
    blobColor?: string;
    textColor?: string;
    hoverTextColor?: string;
    fontFamily?: string;
    colorSpeed?: number;
    introDuration?: number;
    /** Total section height in viewport units (100 = no pinned scroll interval). */
    scrollHeight?: number;
    scrollTarget?: string;
    className?: string;
    style?: CSSProperties;
}

export function DropletHero({
    title = 'dotDAGENE', backgroundColor = '#fffbf1', blobColor = '#78b74c',
    textColor = '#1b7c20', hoverTextColor = '#000000',
    fontFamily = '"Bricolage Grotesque", sans-serif', colorSpeed = 0.4,
    introDuration = 0.7, scrollHeight = 180, scrollTarget,
    className, style,
}: DropletHeroProps) {
    const host = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!host.current) return;
        return mountDroplets(host.current, {
            title, backgroundColor, blobColor, textColor, hoverTextColor, fontFamily,
            colorSpeed: Math.max(0, colorSpeed), introDuration: Math.max(0.01, introDuration),
            scrollHeight: Math.max(100, scrollHeight), scrollTarget,
        });
    }, [title, backgroundColor, blobColor, textColor, hoverTextColor, fontFamily,
        colorSpeed, introDuration, scrollHeight, scrollTarget]);

    return <div ref={host} className={className} style={{ display: 'block', minWidth: 0, ...style }} />;
}

export default DropletHero;
