import { Popup } from './Popup';
import { Challenge } from './Challenge';
import type { AdventDay } from '../types';

export const day = {
  Popup,
  Challenge,
  challengeEnabled: import.meta.env.DEV,
} satisfies AdventDay;
