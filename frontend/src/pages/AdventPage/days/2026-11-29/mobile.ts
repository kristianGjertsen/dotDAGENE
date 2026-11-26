// Accept Norwegian numbers with optional +47 / 0047 and common separators.
export function normalizeMobile(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 30) return null;
  const number = value
    .trim()
    .replace(/[\s()-]/g, '')
    .replace(/^(\+47|0047)/, '');
  return /^\d{8}$/.test(number) ? `+47${number}` : null;
}
