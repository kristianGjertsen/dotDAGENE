export type LetterState = 'correct' | 'present' | 'absent';
export const MAX_ATTEMPTS = 6;
export const normalizeWord = (word: string) => word.normalize('NFC').toLocaleLowerCase('nb-NO').trim();

export function scoreGuess(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = Array(5).fill('absent');
  const remaining = [...answer];
  [...guess].forEach((letter, index) => {
    if (letter === answer[index]) {
      result[index] = 'correct';
      remaining[index] = '';
    }
  });
  [...guess].forEach((letter, index) => {
    if (result[index] === 'correct') return;
    const match = remaining.indexOf(letter);
    if (match !== -1) {
      result[index] = 'present';
      remaining[match] = '';
    }
  });
  return result;
}
