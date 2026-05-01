export type color = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'white';

export const colorMap = new Map<color, string>([
  ['primary', ' bg-primary'],
  ['secondary', ' bg-secondary'],
  ['tertiary', ' bg-tertiary'],
  ['quaternary', ' bg-quaternary'],
  ['white', ' bg-white'],
]);
