export type LockerSizeId = 'M' | 'L' | 'XL';

export type LockerPrices = Record<LockerSizeId, number>;

export function normalizeLockerPrices(raw: Record<string, unknown>): LockerPrices {
  const parse = (value: unknown): number | null => {
    const parsed = typeof value === 'number' ? value : Number(String(value ?? '').replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : null;
  };

  const m = parse(raw['M']);
  const l = parse(raw['L']);
  const xl = parse(raw['XL']);

  if (m === null || l === null || xl === null) {
    throw new Error('[Prices] Missing or invalid locker prices in Firestore');
  }

  return { M: m, L: l, XL: xl };
}
