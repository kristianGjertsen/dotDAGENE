export type color = 'purple' | 'green' | 'yellow' | 'white' | 'red' | 'blue';

export const colorMap = new Map<color, string>([
  ['green', ' bg-dotgreen'],
  ['purple', ' bg-dotpurple'],
  ['yellow', ' bg-dotyellow'],
  ['white', ' bg-white'],
  ['red', ' bg-red-500'],
  ['blue', ' bg-blue-500'],
]);
