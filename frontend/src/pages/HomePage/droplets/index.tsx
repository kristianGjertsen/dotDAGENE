'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { mountDroplets } from './engine.js';

export interface DropletHeroProps {
    title?: string;
    backgroundColor?: string;
    blobColor?: string;
    textColor?: string;
    hoverTextColor?: string;
    outlineColor?: string;
    outlineHoverColor?: string;
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
    title = 'dotDAGENE', backgroundColor, blobColor,
    textColor, hoverTextColor, outlineColor, outlineHoverColor,
    fontFamily = '"Bricolage Grotesque", sans-serif', colorSpeed = 0.4,
    introDuration = 0.7, scrollHeight = 180, scrollTarget,
    className, style,
}: DropletHeroProps) {
    const host = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!host.current) return;
        const css = getComputedStyle(host.current);
        const color = (value: string | undefined, variable: string, fallback: string) =>
            value ?? (css.getPropertyValue(variable).trim() || fallback);
        return mountDroplets(host.current, {
            title, fontFamily,
            backgroundColor: color(backgroundColor, '--hero-background-color', '#fffbf1'),
            blobColor: color(blobColor, '--hero-blob-color', '#78b74c'),
            textColor: color(textColor, '--hero-text-color', '#1b7c20'),
            hoverTextColor: color(hoverTextColor, '--hero-hover-text-color', '#000000'),
            outlineColor: color(outlineColor, '--hero-outline-color', '#000000'),
            outlineHoverColor: color(outlineHoverColor, '--hero-outline-hover-color', '#ffffff'),
            colorSpeed: Math.max(0, colorSpeed), introDuration: Math.max(0.01, introDuration),
            scrollHeight: Math.max(100, scrollHeight), scrollTarget,
        });
    }, [title, backgroundColor, blobColor, textColor, hoverTextColor, outlineColor, outlineHoverColor, fontFamily,
        colorSpeed, introDuration, scrollHeight, scrollTarget]);

    return <div ref={host} className={className} style={{ display: 'block', minWidth: 0, ...style }} />;
}

export default DropletHero;
