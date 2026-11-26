import { saveCompletion, type DotillionCompletion } from './dodle';
import { validateParticipant } from '../src/pages/AdventPage/days/2026-12-09/dotillionGame';

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): unknown;
}

export function createDotillionHandler(
  save: (result: DotillionCompletion) => Promise<void> = saveCompletion,
) {
  return async (req: { method?: string; body?: unknown }, res: ApiResponse) => {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Bruk POST.' });
    }
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Ugyldig JSON.' });
      }
    }
    const input = (body && typeof body === 'object' ? body : {}) as Record<
      string,
      unknown
    >;
    const participant =
      typeof input.name === 'string' && typeof input.mobile === 'string'
        ? validateParticipant(input.name, input.mobile)
        : null;
    if (
      !participant ||
      typeof input.id !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        input.id,
      ) ||
      typeof input.score !== 'number' ||
      !Number.isFinite(input.score) ||
      input.score < 0
    ) {
      return res
        .status(400)
        .json({ error: 'Ugyldig navn, mobilnummer eller poengsum.' });
    }
    try {
      await save({
        id: input.id,
        ...participant,
        score: input.score,
        challenge: 'dotillion-2026-12-09',
        completed: true,
        completedAt: new Date().toISOString(),
      });
      return res.status(200).json({ saved: true });
    } catch {
      return res
        .status(503)
        .json({
          error: 'Resultatet ble ikke lagret. Kunne ikke kontakte serveren.',
        });
    }
  };
}

export default createDotillionHandler();
