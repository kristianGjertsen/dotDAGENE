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

export const standMap = Object.fromEntries(
  standIds.map((id, index) => [
    id,
    {
      label: String(index + 1),
      company: 'Kommer snart',
    },
  ]),
) as Record<StandId, StandData>;
