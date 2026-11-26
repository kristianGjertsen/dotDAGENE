import type { AnswerResult } from './answerApi';

// These IDs are sent to Vercel to select the correct word list.
export const questions = [
  { id: 1, text: 'Nevn noe man spiser i julen:' },
  { id: 2, text: 'Nevn noe man drikker i julen' },
  { id: 3, text: 'Nevn en oppdiktet julekarakter' },
  { id: 4, text: 'Nevn en juleaktivitet' },
];

export const INITIAL_DEPTH = 78;
export const CORRECT_DROP = 55;
export const INCORRECT_DROP = 20;
export const QUESTION_DURATION_MS = 10_000;

export function validateParticipant(name: string, mobile: string) {
  const cleanName = name.trim().replace(/\s+/g, ' ');
  const cleanMobile = mobile.replace(/[\s()-]/g, '').replace(/^(\+47|0047)/, '');
  if (!cleanName || cleanName.length > 80 || /[<>]/.test(cleanName) ||
    Array.from(cleanName).some((character) => character.charCodeAt(0) < 32)) return null;
  if (!/^[49]\d{7}$/.test(cleanMobile)) return null;
  return { name: cleanName, mobile: `+47${cleanMobile}` };
}

export function normalizeAnswer(answer: string): string {
  return answer.toLocaleLowerCase('nb-NO').replaceAll('ø', 'o').replaceAll('æ', 'ae')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ').trim().replace(/\s+/g, ' ');
}

export interface GameState {
  phase: 'idle' | 'lowering' | 'question' | 'returning' | 'finished';
  depth: number;
  previousDepth: number | null;
  results: AnswerResult[];
  score: number;
  participant: { name: string; mobile: string } | null;
  questionDeadline: number | null;
  secondsLeft: number;
  wrongAttempts: number;
  pendingSubmission: { requestId: number; submittedAt: number } | null;
}

export const initialGame: GameState = {
  phase: 'idle', depth: INITIAL_DEPTH, previousDepth: null, results: [], score: 0, participant: null,
  questionDeadline: null, secondsLeft: 10, wrongAttempts: 0,
  pendingSubmission: null,
};

type GameAction =
  | { type: 'start'; name: string; mobile: string }
  | { type: 'landed'; now: number }
  | { type: 'returned' }
  | { type: 'answer_submitted'; requestId: number; submittedAt: number; questionIndex: number }
  | { type: 'answer_result'; requestId: number; result: AnswerResult; now: number; questionIndex: number }
  | { type: 'request_failed'; requestId: number; now: number; questionIndex: number }
  | { type: 'tick'; now: number; questionIndex: number };

function finishQuestion(state: GameState, result: AnswerResult): GameState {
  return {
    ...state,
    phase: 'lowering',
    previousDepth: state.depth,
    depth: state.depth + (result.valid ? CORRECT_DROP : INCORRECT_DROP),
    results: [...state.results, result],
    score: state.score + result.score,
    questionDeadline: null,
    secondsLeft: 0,
    pendingSubmission: null,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'start' && state.phase === 'idle') {
    const participant = validateParticipant(action.name, action.mobile);
    if (!participant) return state;
    return { ...state, phase: 'lowering', participant };
  }
  if (action.type === 'landed' && state.phase === 'lowering') {
    const finished = state.results.length === questions.length;
    return {
      ...state,
      phase: finished ? 'returning' : 'question',
      questionDeadline: finished ? null : action.now + QUESTION_DURATION_MS,
      secondsLeft: finished ? 0 : QUESTION_DURATION_MS / 1000,
      wrongAttempts: 0,
      pendingSubmission: null,
    };
  }
  if (action.type === 'returned' && state.phase === 'returning') {
    return { ...state, phase: 'finished' };
  }
  if ((action.type === 'answer_submitted' || action.type === 'answer_result' || action.type === 'request_failed' || action.type === 'tick') && state.phase === 'question') {
    if (action.questionIndex !== state.results.length || state.questionDeadline === null) return state;

    if (action.type === 'answer_submitted') {
      if (state.pendingSubmission) return state;
      if (action.submittedAt >= state.questionDeadline) return finishQuestion(state, { valid: false, score: 0 });
      return { ...state, pendingSubmission: { requestId: action.requestId, submittedAt: action.submittedAt } };
    }

    if (action.type === 'answer_result' || action.type === 'request_failed') {
      // Only the active submission can resolve the question. Receipt time does not
      // invalidate a correct answer that was submitted before the deadline.
      if (!state.pendingSubmission || action.requestId !== state.pendingSubmission.requestId) return state;
      if (action.type === 'answer_result' && action.result.valid) return finishQuestion(state, action.result);
      if (action.now >= state.questionDeadline) return finishQuestion(state, { valid: false, score: 0 });
      return {
        ...state,
        pendingSubmission: null,
        wrongAttempts: state.wrongAttempts + (action.type === 'answer_result' ? 1 : 0),
      };
    }

    if (action.now >= state.questionDeadline) {
      if (!state.pendingSubmission) return finishQuestion(state, { valid: false, score: 0 });
      return state.secondsLeft === 0 ? state : { ...state, secondsLeft: 0 };
    }
    const secondsLeft = Math.ceil((state.questionDeadline - action.now) / 1000);
    return secondsLeft === state.secondsLeft ? state : { ...state, secondsLeft };
  }
  return state;
}
