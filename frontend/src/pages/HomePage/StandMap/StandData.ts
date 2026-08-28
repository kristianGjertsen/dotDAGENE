export type StandId =
  | 'stand-1'
  | 'stand-2'
  | 'stand-3'
  | 'stand-4'
  | 'stand-5'
  | 'stand-6'
  | 'stand-7'
  | 'stand-8'
  | 'stand-9'
  | 'stand-10'
  | 'stand-11'
  | 'stand-12';

export type StandData = {
  label: string;
  company: string;
};

export type StandDay = 'february-9' | 'february-10';

export type StandDayData = {
  label: string;
  stands: Record<StandId, StandData>;
};

const standIds: StandId[] = [
  'stand-1',
  'stand-2',
  'stand-3',
  'stand-4',
  'stand-5',
  'stand-6',
  'stand-7',
  'stand-8',
  'stand-9',
  'stand-10',
  'stand-11',
  'stand-12',
];

const createComingSoonStandMap = () =>
  Object.fromEntries(
    standIds.map((id, index) => [
      id,
      {
        label: String(index + 1),
        company: 'Kommer snart',
      },
    ]),
  ) as Record<StandId, StandData>;

export const standDays: Record<StandDay, StandDayData> = {
  'february-9': {
    label: '9. februar',
    stands: createComingSoonStandMap(),
  },
  'february-10': {
    label: '10. februar',
    stands: createComingSoonStandMap(),
  },
};
