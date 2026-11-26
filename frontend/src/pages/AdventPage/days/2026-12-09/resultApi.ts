export async function submitDotillionResult(result: {
  id: string;
  name: string;
  mobile: string;
  score: number;
}): Promise<void> {
  const response = await fetch('/api/dotillion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
    signal: AbortSignal.timeout(15_000),
  });
  const body: unknown = await response.json().catch(() => null);
  if (
    !response.ok ||
    !body ||
    typeof body !== 'object' ||
    !('saved' in body) ||
    body.saved !== true
  ) {
    throw new Error(
      'Resultatet ble ikke lagret. Kunne ikke kontakte serveren.',
    );
  }
}
