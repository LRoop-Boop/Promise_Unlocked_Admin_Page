// utils/timestamps.ts
export function toMillis(value: unknown): number | null {
  if (value === null || value === undefined) return null;

  if (typeof value === 'number') {
    if (Number.isNaN(value)) return null;
    // Firestore "seconds" values are ~10 digits, ms values are ~13 digits
    return value > 1e12 ? value : value * 1000;
  }

  if (typeof value === 'object') {
    const v = value as any;
    if (typeof v.toMillis === 'function') return v.toMillis();
    if (typeof v._seconds === 'number') return v._seconds * 1000;
    if (typeof v.seconds === 'number') return v.seconds * 1000;
  }

  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
}