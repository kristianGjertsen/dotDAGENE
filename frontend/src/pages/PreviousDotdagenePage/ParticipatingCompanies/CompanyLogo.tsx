import type { CSSProperties } from "react";

type CompanyLogoProps = {
    src: string;
    alt: string;
    scale?: number;
    scaleMobile?: number;
    scaleDesktop?: number;
    frameClassName?: string;
    imageClassName?: string;
    clip?: boolean;
};

const getScale = (scale: number | undefined, fallback = 1) =>
    typeof scale === "number" && Number.isFinite(scale) ? scale : fallback;

const getLogoStyle = (
    scale?: number,
    scaleMobile?: number,
    scaleDesktop?: number,
) =>
    ({
        "--logo-scale-mobile": getScale(scaleMobile, scale ?? 1),
        "--logo-scale-desktop": getScale(scaleDesktop, scale ?? 1),
    }) as CSSProperties;

export const CompanyLogo = ({
    src,
    alt,
    scale,
    scaleMobile,
    scaleDesktop,
    frameClassName = "",
    imageClassName = "",
    clip = false,
}: CompanyLogoProps) => (
    <div
        className={`flex min-h-0 w-full items-center justify-center ${clip ? "overflow-hidden" : "overflow-visible"} ${frameClassName}`}
    >
        <img
            src={src}
            alt={alt}
            className={`max-h-full max-w-full object-contain scale-[var(--logo-scale-mobile)] xl:scale-[var(--logo-scale-desktop)] ${imageClassName}`}
            style={getLogoStyle(scale, scaleMobile, scaleDesktop)}
            loading="lazy"
        />
    </div>
);
