export type color = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'white' | 'advent';

export const colorMap = new Map<color, string>([
  ['advent', ' bg-advent'],
  ['primary', ' bg-primary'],
  ['secondary', ' bg-secondary'],
  ['tertiary', ' bg-tertiary'],
  ['quaternary', ' bg-quaternary'],
  ['white', ' bg-white'],
]);
