export type Item = { id: string; title: string; priceCents: number };
export const ITEMS = new Map<string, Item>();

// seed
const seedId = crypto.randomUUID();
ITEMS.set(seedId, { id: seedId, title: 'Seed Item', priceCents: 1299 });
