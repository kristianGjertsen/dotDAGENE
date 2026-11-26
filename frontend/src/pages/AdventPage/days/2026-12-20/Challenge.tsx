import { ChallengeExample } from '../shared/ChallengeExample';
import type { ChallengeProps } from '../types';

// Replace the example with this day's challenge before enabling it in production.
export const Challenge = (props: ChallengeProps) => (
  <ChallengeExample {...props} />
);
