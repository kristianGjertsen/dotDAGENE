import type { ComponentType } from 'react';
import type { AdventEntry } from '../types';

export interface DayPopupProps {
  entry: AdventEntry;
  onStart?: () => void;
  onClose: () => void;
}

export interface ChallengeProps {
  onComplete: () => void;
  onBack: () => void;
}

export interface AdventDay {
  Popup: ComponentType<DayPopupProps>;
  Challenge?: ComponentType<ChallengeProps>;
  challengeEnabled: boolean;
}
