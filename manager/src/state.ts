export type User = { id: string; email: string; name: string };
export const USERS = new Map<string, User>();

// seed
const seedId = crypto.randomUUID();
USERS.set(seedId, { id: seedId, email: 'seed@example.com', name: 'Seed User' });
