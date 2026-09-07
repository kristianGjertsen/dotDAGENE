import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import type { IconHandle } from '@animateicons/react';
import backtemp from '../../../assets/backgroundInv.svg';
import {
  CalendarDays,
  Instagram,
  Linkedin,
  Mail,
  MapPinIcon,
} from '@animateicons/react/lucide';
import AnimatedLogo from './AnimatedLogo';
import './FooterPattern.css';

type FooterAnimationMode =
  | 'draw'
  | 'motion'
  | 'color'
  | 'fusion'
  | 'chaos'
  | 'warp';

type AnimationSettings = {
  warpRadius: number;
  warpMovement: number;
  warpSoftness: number;
  warpOpacity: number;

  baseOpacity: number;
  drawRadius: number;
  drawOpacity: number;
  drawBrightness: number;
  motionX: number;
  motionY: number;
  motionAOpacity: number;
  motionBOpacity: number;
  motionAScale: number;
  motionBScale: number;
  colorRadius: number;
  colorOpacity: number;
  glowOpacity: number;
  contentShift: number;
  chaosRotate: number;
};

type SettingKey = keyof AnimationSettings;

type ControlDefinition = {
  key: SettingKey;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
  modes: readonly FooterAnimationMode[];
};

const footerAnimationModes: ReadonlyArray<{
  id: FooterAnimationMode;
  label: string;
}> = [
  { id: 'draw', label: 'Tegn' },
  { id: 'motion', label: 'Bevegelse' },
  { id: 'color', label: 'Farge' },
  { id: 'fusion', label: 'Alt' },
  { id: 'chaos', label: 'Kaos' },
  { id: 'warp', label: 'Warp' },
];

const baseSettings: AnimationSettings = {
  warpRadius: 200,
  warpMovement: 14,
  warpSoftness: 90,
  warpOpacity: 1,

  baseOpacity: 0.2,
  drawRadius: 125,
  drawOpacity: 0.86,
  drawBrightness: 1.22,
  motionX: 20,
  motionY: 14,
  motionAOpacity: 0.28,
  motionBOpacity: 0.38,
  motionAScale: 1.04,
  motionBScale: 1.08,
  colorRadius: 340,
  colorOpacity: 0.46,
  glowOpacity: 0.68,
  contentShift: 0,
  chaosRotate: 0,
};

const defaultsByMode: Record<FooterAnimationMode, AnimationSettings> = {
  warp: { ...baseSettings },
  draw: {
    ...baseSettings,
    baseOpacity: 0.055,
    drawRadius: 145,
    drawOpacity: 0.96,
    drawBrightness: 1.35,
  },
  motion: {
    ...baseSettings,
    baseOpacity: 0.14,
    motionX: 24,
    motionY: 18,
    motionAOpacity: 0.3,
    motionBOpacity: 0.46,
    motionAScale: 1.05,
    motionBScale: 1.1,
  },
  color: {
    ...baseSettings,
    baseOpacity: 0.15,
    colorRadius: 370,
    colorOpacity: 0.58,
    glowOpacity: 0.76,
  },
  fusion: {
    ...baseSettings,
    warpMovement: 12,
    baseOpacity: 0.11,
    drawRadius: 115,
    drawOpacity: 0.68,
    drawBrightness: 1.25,
    motionX: 18,
    motionY: 12,
    motionAOpacity: 0.16,
    motionBOpacity: 0.27,
    motionAScale: 1.035,
    motionBScale: 1.07,
    colorRadius: 330,
    colorOpacity: 0.36,
    glowOpacity: 0.48,
    contentShift: 2,
  },
  chaos: {
    ...baseSettings,
    warpMovement: 20,
    baseOpacity: 0.08,
    drawRadius: 185,
    drawOpacity: 1,
    drawBrightness: 1.65,
    motionX: 62,
    motionY: 44,
    motionAOpacity: 0.46,
    motionBOpacity: 0.72,
    motionAScale: 1.11,
    motionBScale: 1.2,
    colorRadius: 500,
    colorOpacity: 0.82,
    glowOpacity: 1,
    contentShift: 9,
    chaosRotate: 2.4,
  },
};

const combinedModes: FooterAnimationMode[] = ['fusion', 'chaos'];

const controls: ControlDefinition[] = [
  {
    key: 'warpRadius',
    label: 'Warp radius',
    min: 0,
    max: 600,
    step: 5,
    unit: 'px',
    modes: ['warp', ...combinedModes],
  },
  {
    key: 'warpMovement',
    label: 'Warp draglengde',
    min: 0,
    max: 40,
    step: 1,
    unit: 'px',
    modes: ['warp', ...combinedModes],
  },
  {
    key: 'warpSoftness',
    label: 'Warp myk kant',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    modes: ['warp', ...combinedModes],
  },
  {
    key: 'warpOpacity',
    label: 'Warp styrke',
    min: 0,
    max: 2,
    step: 0.01,
    unit: '',
    modes: ['warp', ...combinedModes],
  },

  {
    key: 'baseOpacity',
    label: 'Bakgrunn opacity',
    min: 0,
    max: 0.45,
    step: 0.01,
    modes: footerAnimationModes.map((mode) => mode.id),
  },
  {
    key: 'drawRadius',
    label: 'Tegne radius',
    min: 0,
    max: 340,
    step: 5,
    unit: 'px',
    modes: ['draw', ...combinedModes],
  },
  {
    key: 'drawOpacity',
    label: 'Tegne styrke',
    min: 0,
    max: 1,
    step: 0.02,
    modes: ['draw', ...combinedModes],
  },
  {
    key: 'drawBrightness',
    label: 'Tegne lysstyrke',
    min: 0,
    max: 2,
    step: 0.02,
    modes: ['draw', ...combinedModes],
  },
  {
    key: 'motionX',
    label: 'Bevegelse X',
    min: 0,
    max: 90,
    step: 1,
    unit: 'px',
    modes: ['motion', ...combinedModes],
  },
  {
    key: 'motionY',
    label: 'Bevegelse Y',
    min: 0,
    max: 70,
    step: 1,
    unit: 'px',
    modes: ['motion', ...combinedModes],
  },
  {
    key: 'motionAOpacity',
    label: 'Motion lag 1',
    min: 0,
    max: 1,
    step: 0.02,
    modes: ['motion', ...combinedModes],
  },
  {
    key: 'motionBOpacity',
    label: 'Motion lag 2',
    min: 0,
    max: 1,
    step: 0.02,
    modes: ['motion', ...combinedModes],
  },
  {
    key: 'motionAScale',
    label: 'Motion scale 1',
    min: 0,
    max: 1.3,
    step: 0.01,
    modes: ['motion', ...combinedModes],
  },
  {
    key: 'motionBScale',
    label: 'Motion scale 2',
    min: 0,
    max: 1.4,
    step: 0.01,
    modes: ['motion', ...combinedModes],
  },
  {
    key: 'colorRadius',
    label: 'Farge radius',
    min: 0,
    max: 700,
    step: 10,
    unit: 'px',
    modes: ['color', ...combinedModes],
  },
  {
    key: 'colorOpacity',
    label: 'Mønsterfarge',
    min: 0,
    max: 1,
    step: 0.02,
    modes: ['color', ...combinedModes],
  },
  {
    key: 'glowOpacity',
    label: 'Farge glow',
    min: 0,
    max: 1.3,
    step: 0.02,
    modes: ['color', ...combinedModes],
  },
  {
    key: 'contentShift',
    label: 'Innhold parallax',
    min: 0,
    max: 22,
    step: 1,
    unit: 'px',
    modes: combinedModes,
  },
  {
    key: 'chaosRotate',
    label: 'Kaos rotasjon',
    min: 0,
    max: 8,
    step: 0.1,
    unit: '°',
    modes: ['chaos'],
  },
];

const PRESETS_STORAGE_KEY = 'dotdagene.footer.presets.v1';

type FooterPreset = {
  id: string;
  name: string;
  activeMode: FooterAnimationMode;
  settingsByMode: Record<FooterAnimationMode, AnimationSettings>;
};

// Merge missing controls with defaults, but keep Warp off in presets without it.
const normalizePreset = (value: unknown): FooterPreset | null => {
  if (!value || typeof value !== 'object') return null;
  const preset = value as Partial<FooterPreset>;
  if (
    typeof preset.id !== 'string' ||
    typeof preset.name !== 'string' ||
    !footerAnimationModes.some(({ id }) => id === preset.activeMode)
  )
    return null;
  const settingsByMode = Object.fromEntries(
    footerAnimationModes.map(({ id }) => {
      const settings = { ...defaultsByMode[id], warpOpacity: 0 };
      const saved = preset.settingsByMode?.[id];
      controls.forEach(({ key, min, max }) => {
        const value = saved?.[key];
        if (typeof value === 'number' && Number.isFinite(value)) {
          settings[key] = Math.min(max, Math.max(min, value));
        }
      });
      return [id, settings];
    }),
  ) as Record<FooterAnimationMode, AnimationSettings>;
  return {
    id: preset.id,
    name: preset.name,
    activeMode: preset.activeMode!,
    settingsByMode,
  };
};

const readPresets = (): FooterPreset[] => {
  try {
    const saved: unknown = JSON.parse(
      localStorage.getItem(PRESETS_STORAGE_KEY) ?? '[]',
    );
    return Array.isArray(saved)
      ? saved
          .map(normalizePreset)
          .filter((preset): preset is FooterPreset => preset !== null)
      : [];
  } catch {
    return [];
  }
};

// Function to randomly return a rotation class for the background image
const getRandomBackImageRotation = () => {
  return Math.random() < 0.5 ? 'rotate-180' : '';
};

type PatternLayerProps = {
  className: string;
  rotationClass: string;
};

const PatternLayer = ({ className, rotationClass }: PatternLayerProps) => (
  <div className={className} aria-hidden="true">
    <div
      className={`footer-pattern__image ${rotationClass}`}
      style={{ backgroundImage: `url(${backtemp})` }}
    />
  </div>
);

const formatSettingValue = (control: ControlDefinition, value: number) => {
  const decimals = control.step < 0.01 ? 3 : control.step < 1 ? 2 : 0;
  return `${value.toFixed(decimals)}${control.unit ?? ''}`;
};

export const Footer = () => {
  const warpFilterId = useId();
  const warpMapRef = useRef<SVGFEImageElement>(null);
  const warpDisplacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const warpFollowerRef = useRef({ x: 0.5, y: 0.5 });
  const warpLastPointerRef = useRef({ x: 0.5, y: 0.5 });
  const warpDragRef = useRef({ x: 0, y: 0 });
  const backImageRotation = useMemo(() => getRandomBackImageRotation(), []);
  const mailIconRef = useRef<IconHandle>(null);
  const calendarIconRef = useRef<IconHandle>(null);
  const mapPinIconRef = useRef<IconHandle>(null);
  const footerRef = useRef<HTMLElement>(null);
  const pointerFrameRef = useRef<number | null>(null);
  const trailFrameRef = useRef<number | null>(null);
  const pointerTargetRef = useRef({ x: 0.5, y: 0.5 });
  const trailRef = useRef<
    {
      x: number;
      y: number;
      time: number;
      offsetX: number;
      offsetY: number;
      widthScale: number;
      fadeDuration: number;
      fadePower: number;
    }[]
  >([]);
  const pointerInsideRef = useRef(false);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);
  const [copyStatus, setCopyStatus] = useState('');
  const [presets, setPresets] = useState<FooterPreset[]>(readPresets);
  const [presetName, setPresetName] = useState('');
  const [presetStatus, setPresetStatus] = useState('');
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [settingsByMode, setSettingsByMode] = useState<
    Record<FooterAnimationMode, AnimationSettings>
  >(() => ({
    warp: { ...defaultsByMode.warp },
    draw: { ...defaultsByMode.draw },
    motion: { ...defaultsByMode.motion },
    color: { ...defaultsByMode.color },
    fusion: { ...defaultsByMode.fusion },
    chaos: { ...defaultsByMode.chaos },
  }));

  const activeAnimation = footerAnimationModes[animationIndex];
  const activeSettings = settingsByMode[activeAnimation.id];
  const warpSettingsRef = useRef(activeSettings);
  useEffect(() => {
    warpSettingsRef.current = activeSettings;
  }, [activeSettings]);
  const activeControls = controls.filter((control) =>
    control.modes.includes(activeAnimation.id),
  );

  const updatePointerVariables = (x: number, y: number) => {
    const footer = footerRef.current;
    if (!footer) return;

    const xShift = (x - 0.5) * 2 * activeSettings.motionX;
    const yShift = (y - 0.5) * 2 * activeSettings.motionY;
    const contentX = (x - 0.5) * 2 * activeSettings.contentShift;
    const contentY = (y - 0.5) * 2 * activeSettings.contentShift * 0.65;
    const contentRotate = (x - 0.5) * activeSettings.chaosRotate * 0.24;

    footer.style.setProperty('--footer-pointer-x', `${x * 100}%`);
    footer.style.setProperty('--footer-pointer-y', `${y * 100}%`);
    footer.style.setProperty('--footer-shift-x', `${xShift}px`);
    footer.style.setProperty('--footer-shift-y', `${yShift}px`);
    footer.style.setProperty('--footer-shift-x-inverse', `${-xShift * 0.72}px`);
    footer.style.setProperty('--footer-shift-y-inverse', `${-yShift * 0.72}px`);
    footer.style.setProperty('--footer-content-x', `${contentX}px`);
    footer.style.setProperty('--footer-content-y', `${contentY}px`);
    footer.style.setProperty('--footer-content-rotate', `${contentRotate}deg`);
  };

  const updateTrailVariables = () => {
    const footer = footerRef.current;
    if (!footer || !pointerInsideRef.current) {
      trailFrameRef.current = null;
      return;
    }

    const target = pointerTargetRef.current;
    const trail = trailRef.current;
    // Displace the original pattern smoothly in the direction of travel.
    // Neutral channels outside the radius leave the rest of the pattern untouched.
    const settings = warpSettingsRef.current;
    const follower = warpFollowerRef.current;
    const width = footer.clientWidth;
    const height = footer.clientHeight;
    // Hold the last drag when stationary; only new movement changes it.
    const previous = warpLastPointerRef.current;
    if (target.x !== previous.x || target.y !== previous.y) {
      const dx = (target.x - follower.x) * width;
      const dy = (target.y - follower.y) * height;
      const divisor = Math.max(60, Math.hypot(dx, dy));
      warpDragRef.current = { x: dx / divisor, y: dy / divisor };
      follower.x += (target.x - follower.x) * 0.14;
      follower.y += (target.y - follower.y) * 0.14;
      warpLastPointerRef.current = { ...target };
    }
    const red = 50 - warpDragRef.current.x * 50;
    const green = 50 - warpDragRef.current.y * 50;
    const radius = Math.max(1, settings.warpRadius);
    const inner = Math.min(60, 100 - settings.warpSoftness);
    const map = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><radialGradient id="drag" gradientUnits="userSpaceOnUse" cx="${target.x * width}" cy="${target.y * height}" r="${radius}"><stop offset="${inner}%" stop-color="rgb(${red}%,${green}%,50%)"/><stop offset="100%" stop-color="rgb(50%,50%,50%)"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#drag)"/></svg>`;
    warpMapRef.current?.setAttribute(
      'href',
      `data:image/svg+xml,${encodeURIComponent(map)}`,
    );
    warpDisplacementRef.current?.setAttribute(
      'scale',
      `${2 * Math.min(settings.warpMovement, settings.warpRadius * 0.12) * settings.warpOpacity}`,
    );
    // Store the actual path; old sections fade in place instead of chasing the pointer.
    const now = performance.now();
    const lifetime = 700;
    const last = trail[trail.length - 1];
    if (
      !last ||
      Math.hypot((target.x - last.x) * width, (target.y - last.y) * height) > 1
    ) {
      // Sample randomness once per point and blend it with the previous point
      // to get gentle wandering without flickering between animation frames.
      trail.push({
        ...target,
        time: now,
        fadeDuration: lifetime * (0.65 + Math.random() * 0.9),
        fadePower: 0.9 + Math.random() * 1.4,
        offsetX: (last?.offsetX ?? 0) * 0.8 + (Math.random() - 0.5) * 0.4,
        offsetY: (last?.offsetY ?? 0) * 0.8 + (Math.random() - 0.5) * 0.4,
        widthScale:
          (last?.widthScale ?? 1) * 0.8 + (0.7 + Math.random() * 0.6) * 0.2,
      });
    }
    while (
      trail.length &&
      (now - trail[0].time > lifetime * 1.55 || trail.length > 180)
    )
      trail.shift();
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const makeMask = (radius: number) => {
      const strokeWidth = Math.max(8, radius * 0.65);
      const points = trail.map((point) => ({
        ...point,
        x: point.x * width + point.offsetX * Math.min(radius * 0.35, 45),
        y: point.y * height + point.offsetY * Math.min(radius * 0.35, 45),
      }));
      const segments = reducedMotion
        ? ''
        : points
            .slice(1)
            .map((point, index) => {
              const previous = points[index];
              const before = points[Math.max(0, index - 1)];
              const after = points[Math.min(points.length - 1, index + 2)];
              // Each section dissolves at its own pace, with randomness fixed
              // at creation so the fade stays smooth over time.
              const remaining = Math.max(
                0,
                1 - (now - point.time) / point.fadeDuration,
              );
              const strength = Math.pow(remaining, point.fadePower);
              // Catmull–Rom control points keep the path smooth through turns.
              const c1x = previous.x + (point.x - before.x) / 6;
              const c1y = previous.y + (point.y - before.y) / 6;
              const c2x = point.x - (after.x - previous.x) / 6;
              const c2y = point.y - (after.y - previous.y) / 6;
              return `<path d="M ${previous.x} ${previous.y} C ${c1x} ${c1y} ${c2x} ${c2y} ${point.x} ${point.y}" stroke="white" stroke-opacity="${strength}" stroke-width="${strokeWidth * (0.6 + remaining * 0.4) * point.widthScale}"/>`;
            })
            .join('');
      // Use the footer's coordinates, not the path's narrow bounding box:
      // vertical/horizontal trails otherwise clip the blur into straight edges.
      const filterPadding = Math.ceil(strokeWidth);
      const mask = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><filter id="soft" filterUnits="userSpaceOnUse" x="${-filterPadding}" y="${-filterPadding}" width="${width + filterPadding * 2}" height="${height + filterPadding * 2}"><feGaussianBlur stdDeviation="${Math.max(2, strokeWidth * 0.12)}"/></filter><radialGradient id="head"><stop stop-color="white"/><stop offset="0.4" stop-color="white" stop-opacity="0.85"/><stop offset="1" stop-color="white" stop-opacity="0"/></radialGradient></defs><g fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#soft)">${segments}</g><circle cx="${target.x * width}" cy="${target.y * height}" r="${radius}" fill="url(#head)"/></svg>`;
      return `url("data:image/svg+xml,${encodeURIComponent(mask)}")`;
    };
    footer.style.setProperty(
      '--footer-trail-mask',
      makeMask(settings.drawRadius),
    );
    footer.style.setProperty(
      '--footer-color-trail-mask',
      makeMask(settings.colorRadius),
    );

    trailFrameRef.current = requestAnimationFrame(updateTrailVariables);
  };

  useEffect(() => {
    return () => {
      if (pointerFrameRef.current !== null) {
        cancelAnimationFrame(pointerFrameRef.current);
      }
      if (trailFrameRef.current !== null) {
        cancelAnimationFrame(trailFrameRef.current);
      }
    };
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const footer = footerRef.current;
    if (!footer) return;

    const rect = footer.getBoundingClientRect();
    const x = Math.min(
      Math.max((event.clientX - rect.left) / rect.width, 0),
      1,
    );
    const y = Math.min(
      Math.max((event.clientY - rect.top) / rect.height, 0),
      1,
    );

    if (!pointerInsideRef.current) {
      trailRef.current = [];
      warpFollowerRef.current = { x, y };
      warpLastPointerRef.current = { x, y };
      warpDragRef.current = { x: 0, y: 0 };
    }
    pointerTargetRef.current = { x, y };
    pointerInsideRef.current = true;
    footer.style.setProperty('--footer-pointer-active', '1');

    if (trailFrameRef.current === null) {
      trailFrameRef.current = requestAnimationFrame(updateTrailVariables);
    }

    if (pointerFrameRef.current !== null) {
      cancelAnimationFrame(pointerFrameRef.current);
    }

    pointerFrameRef.current = requestAnimationFrame(() => {
      updatePointerVariables(x, y);
      pointerFrameRef.current = null;
    });
  };

  const handlePointerLeave = () => {
    pointerInsideRef.current = false;
    warpDragRef.current = { x: 0, y: 0 };
    footerRef.current?.style.setProperty('--footer-pointer-active', '0');
    warpDisplacementRef.current?.setAttribute('scale', '0');

    if (pointerFrameRef.current !== null) {
      cancelAnimationFrame(pointerFrameRef.current);
      pointerFrameRef.current = null;
    }
    if (trailFrameRef.current !== null) {
      cancelAnimationFrame(trailFrameRef.current);
      trailFrameRef.current = null;
    }

    pointerTargetRef.current = { x: 0.5, y: 0.5 };
    trailRef.current = [];
    footerRef.current?.style.removeProperty('--footer-trail-mask');
    footerRef.current?.style.removeProperty('--footer-color-trail-mask');
    updatePointerVariables(0.5, 0.5);
  };

  const updateSetting = (key: SettingKey, value: number) => {
    setActivePresetId(null);
    setCopyStatus('');
    setSettingsByMode((current) => ({
      ...current,
      [activeAnimation.id]: {
        ...current[activeAnimation.id],
        [key]: value,
      },
    }));
  };

  const resetActiveSettings = () => {
    setActivePresetId(null);
    setCopyStatus('');
    setSettingsByMode((current) => ({
      ...current,
      [activeAnimation.id]: { ...defaultsByMode[activeAnimation.id] },
    }));
  };

  const persistPresets = (next: FooterPreset[]) => {
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(next));
      setPresets(next);
      return true;
    } catch {
      setPresetStatus(
        'Kunne ikke lagre. Nettleserens lagring er full eller utilgjengelig.',
      );
      return false;
    }
  };

  const savePreset = () => {
    const preset: FooterPreset = {
      id: crypto.randomUUID(),
      name:
        presetName.trim() || `${activeAnimation.label} ${presets.length + 1}`,
      activeMode: activeAnimation.id,
      settingsByMode: structuredClone(settingsByMode),
    };
    if (persistPresets([...presets, preset])) {
      setActivePresetId(preset.id);
      setPresetName('');
      setPresetStatus(`Lagret «${preset.name}».`);
    }
  };

  const selectPreset = (preset: FooterPreset) => {
    handlePointerLeave();
    setSettingsByMode(structuredClone(preset.settingsByMode));
    setAnimationIndex(
      footerAnimationModes.findIndex(({ id }) => id === preset.activeMode),
    );
    setActivePresetId(preset.id);
    setCopyStatus('');
    setPresetStatus(`Valgt «${preset.name}».`);
  };

  const deletePreset = (preset: FooterPreset) => {
    if (persistPresets(presets.filter(({ id }) => id !== preset.id))) {
      if (activePresetId === preset.id) setActivePresetId(null);
      setPresetStatus(`Slettet «${preset.name}».`);
    }
  };

  const copyAllSettings = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(
          {
            activeMode: activeAnimation.id,
            settingsByMode,
          },
          null,
          2,
        ),
      );
      setCopyStatus('Alle verdier er kopiert.');
    } catch {
      setCopyStatus(
        'Kunne ikke kopiere. Sjekk nettleserens utklippstavletilgang og prøv igjen.',
      );
    }
  };

  const footerStyle = {
    '--footer-base-opacity': activeSettings.baseOpacity,
    '--footer-draw-radius': `${activeSettings.drawRadius}px`,
    '--footer-draw-opacity': activeSettings.drawOpacity,
    '--footer-draw-brightness': activeSettings.drawBrightness,
    '--footer-motion-a-opacity': activeSettings.motionAOpacity,
    '--footer-motion-b-opacity': activeSettings.motionBOpacity,
    '--footer-motion-a-scale': activeSettings.motionAScale,
    '--footer-motion-b-scale': activeSettings.motionBScale,
    '--footer-color-radius': `${activeSettings.colorRadius}px`,
    '--footer-color-opacity': activeSettings.colorOpacity,
    '--footer-glow-opacity': activeSettings.glowOpacity,
  } as CSSProperties;

  return (
    <div className="footer-pattern-shell">
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
        style={{ position: 'absolute' }}
      >
        <defs>
          <filter
            id={warpFilterId}
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              ref={warpMapRef}
              result="drag-map"
              preserveAspectRatio="none"
            />
            <feDisplacementMap
              ref={warpDisplacementRef}
              scale={0}
              in="SourceGraphic"
              in2="drag-map"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <nav className="footer-presets" aria-label="Lagrede footer-presets">
        <strong>Presets</strong>
        <div className="footer-presets__list">
          {presets.length === 0 && <span>Ingen lagrede presets ennå.</span>}
          {presets.map((preset) => (
            <div className="footer-presets__item" key={preset.id}>
              <button
                type="button"
                aria-pressed={activePresetId === preset.id}
                onClick={() => selectPreset(preset)}
              >
                {preset.name}
              </button>
              <button
                type="button"
                className="footer-presets__delete"
                aria-label={`Slett preset ${preset.name}`}
                title={`Slett ${preset.name}`}
                onClick={() => deletePreset(preset)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <span className="footer-presets__status" role="status">
          {presetStatus}
        </span>
      </nav>
      <div className="footer-animation-control">
        <div className="footer-animation-control__topline">
          <span className="footer-animation-control__eyebrow">Mønster</span>
          <span className="footer-animation-control__active">
            {activeAnimation.label}
          </span>
        </div>
        <input
          className="footer-animation-control__slider"
          type="range"
          min={0}
          max={footerAnimationModes.length - 1}
          step={1}
          value={animationIndex}
          onChange={(event) => {
            setAnimationIndex(Number(event.currentTarget.value));
            setActivePresetId(null);
          }}
          aria-label="Velg footer-animasjon"
          aria-valuetext={activeAnimation.label}
          style={
            {
              '--footer-slider-progress': `${(animationIndex / (footerAnimationModes.length - 1)) * 100}%`,
            } as CSSProperties
          }
        />
        <div className="footer-animation-control__labels" aria-hidden="true">
          {footerAnimationModes.map((mode) => (
            <span key={mode.id}>{mode.label}</span>
          ))}
        </div>
      </div>

      {panelOpen ? (
        <aside
          className="footer-tuning-panel"
          aria-label="Animasjonsinnstillinger"
        >
          <div className="footer-tuning-panel__header">
            <div>
              <span className="footer-tuning-panel__eyebrow">
                Live controls
              </span>
              <strong>{activeAnimation.label}</strong>
            </div>
            <button type="button" onClick={() => setPanelOpen(false)}>
              Skjul
            </button>
          </div>
          <form
            className="footer-presets__save"
            onSubmit={(event) => {
              event.preventDefault();
              savePreset();
            }}
          >
            <input
              aria-label="Navn på preset"
              placeholder="Navn på preset (valgfritt)"
              maxLength={80}
              value={presetName}
              onChange={(event) => setPresetName(event.currentTarget.value)}
            />
            <button type="submit">Lagre preset</button>
          </form>
          <div className="footer-tuning-panel__actions">
            <span>{activeControls.length} variabler</span>
            <button type="button" onClick={copyAllSettings}>
              Kopier alle verdier
            </button>
            <button type="button" onClick={resetActiveSettings}>
              Nullstill
            </button>
          </div>
          <div className="footer-tuning-panel__controls">
            <span role="status">{copyStatus}</span>
            {activeControls.map((control) => {
              const value = activeSettings[control.key];
              return (
                <label
                  className="footer-tuning-panel__control"
                  key={control.key}
                >
                  <span>
                    <span>{control.label}</span>
                    <output>{formatSettingValue(control, value)}</output>
                  </span>
                  <input
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={value}
                    onChange={(event) =>
                      updateSetting(
                        control.key,
                        Number(event.currentTarget.value),
                      )
                    }
                  />
                </label>
              );
            })}
          </div>
        </aside>
      ) : (
        <button
          type="button"
          className="footer-tuning-panel-toggle"
          onClick={() => setPanelOpen(true)}
        >
          Juster animasjon
        </button>
      )}

      <footer
        ref={footerRef}
        style={footerStyle}
        className={`footer-pattern footer-pattern--${activeAnimation.id} bg-footer relative overflow-hidden border-t-2 border-black`}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div
          className="footer-pattern__background"
          aria-hidden="true"
          style={
            ['warp', 'fusion', 'chaos'].includes(activeAnimation.id)
              ? { filter: `url(#${warpFilterId})` }
              : undefined
          }
        >
          <PatternLayer
            className="footer-pattern__layer footer-pattern__base"
            rotationClass={backImageRotation}
          />
          <PatternLayer
            className="footer-pattern__layer footer-pattern__effect footer-pattern__effect--draw"
            rotationClass={backImageRotation}
          />
          <PatternLayer
            className="footer-pattern__layer footer-pattern__effect footer-pattern__effect--motion-a"
            rotationClass={backImageRotation}
          />
          <PatternLayer
            className="footer-pattern__layer footer-pattern__effect footer-pattern__effect--motion-b"
            rotationClass={backImageRotation}
          />
          <PatternLayer
            className="footer-pattern__layer footer-pattern__effect footer-pattern__effect--color"
            rotationClass={backImageRotation}
          />
          <div className="footer-pattern__color-wash" aria-hidden="true" />
        </div>

        <section className="footer-pattern__content relative z-10 mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-8 pt-14 pb-4 sm:px-12 sm:pt-12 lg:px-16 lg:pt-10">
          <div className="flex flex-col gap-8 border-b-1 border-gray-100/80 pb-5 md:flex-row md:items-start md:justify-between">
            <section className="max-w-md">
              <AnimatedLogo className="md:mb-4" />
              <p className="mt-4 max-w-sm text-gray-100 md:text-xl">
                NTNUs nyeste karrieredag innen digitalisering og teknologi.
              </p>
            </section>

            <section className="flex flex-col gap-3 text-gray-100">
              <h2 className="text-lg md:text-2xl">Følg oss</h2>
              <div className="flex w-full justify-between">
                <a
                  href="https://www.instagram.com/dotdagene/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Instagram size={35} />
                </a>
                <a
                  href="https://www.linkedin.com/company/dotdagene/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Linkedin size={35} />
                </a>
              </div>
            </section>
          </div>

          <section className="mx-auto grid w-full max-w-5xl gap-8 text-gray-100 md:grid-cols-3 md:gap-10">
            <div
              className="flex items-start gap-4 md:justify-self-center"
              onMouseEnter={() => mailIconRef.current?.startAnimation()}
              onMouseLeave={() => mailIconRef.current?.stopAnimation()}
            >
              <Mail
                ref={mailIconRef}
                className="text-tertiary h-8 w-8 shrink-0"
              />
              <div className="max-w-[220px]">
                <p className="text-md font-semibold tracking-[0.2em]">E-post</p>
                <a
                  href="mailto:kontakt@dotdagene.no"
                  className="hover:text-tertiary transition-colors duration-150"
                >
                  kontakt@dotdagene.no
                </a>
              </div>
            </div>
            <div
              className="flex items-start gap-4 md:justify-self-center"
              onMouseEnter={() => calendarIconRef.current?.startAnimation()}
              onMouseLeave={() => calendarIconRef.current?.stopAnimation()}
            >
              <CalendarDays
                ref={calendarIconRef}
                className="text-tertiary h-8 w-8 shrink-0"
              />
              <div className="max-w-[220px]">
                <p className="text-md font-semibold tracking-[0.2em]">Dato</p>
                <p>9 og 10. februar 2027</p>
              </div>
            </div>
            <div
              className="flex items-start gap-4 md:justify-self-center"
              onMouseEnter={() => mapPinIconRef.current?.startAnimation()}
              onMouseLeave={() => mapPinIconRef.current?.stopAnimation()}
            >
              <MapPinIcon
                ref={mapPinIconRef}
                className="text-tertiary h-8 w-8 shrink-0"
              />
              <div className="max-w-[260px]">
                <p className="text-md font-semibold tracking-[0.2em]">
                  Lokasjon
                </p>
                <a
                  href="https://use.mazemap.com/#v=1&config=ntnu&campusid=1&zlevel=-1&center=10.405303,63.415515&zoom=17.9&search=realfagbygget&sharepoitype=poi&sharepoi=1000459313"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-tertiary transition-colors duration-150"
                >
                  Realfagbygget U1 NTNU Gløshaugen, Trondheim
                </a>
              </div>
            </div>
          </section>

          <p className="w-full pt-2 text-center text-gray-100">
            © 2026 dotDAGENE
          </p>
        </section>
      </footer>
    </div>
  );
};
