import { DayPopupContent } from '../shared/DayPopupContent';
import type { DayPopupProps } from '../types';

// Customize this day's popup here. Text and publication status come from the API.
export const Popup = (props: DayPopupProps) => <DayPopupContent {...props} />;
