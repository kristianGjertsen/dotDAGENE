import { Popup } from './Popup';
import { Challenge } from './Challenge';
import type { AdventDay } from '../types';

export const day = {
  Popup,
  Challenge,
  challengeEnabled: true,
} satisfies AdventDay;
