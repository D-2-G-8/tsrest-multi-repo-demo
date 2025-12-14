export type Session = { token: string; login: string; issuedAt: number };

export const TOKENS = new Map<string, Session>();
export const VALID_LOGIN = 'test';
export const VALID_PASSWORD = 'test';

export function issueToken(login: string) {
  const token = crypto.randomUUID();
  TOKENS.set(token, { token, login, issuedAt: Date.now() });
  return token;
}

export function isTokenValid(token: string) {
  return TOKENS.has(token);
}
