import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

/**
 * Internal Auth service contract used by BFF.
 */
export const authContract = c.router({
  login: {
    method: 'POST',
    path: '/internal/v1/auth/login',
    body: z.object({
      login: z.string().min(1),
      password: z.string().min(1)
    }),
    responses: {
      200: z.object({ token: z.string().min(1) }),
      401: z.object({ message: z.string() })
    },
    summary: 'Auth: issue token'
  },

  validate: {
    method: 'POST',
    path: '/internal/v1/auth/validate',
    body: z.object({ token: z.string().min(1) }),
    responses: {
      200: z.object({ valid: z.boolean() })
    },
    summary: 'Auth: validate token'
  }
});
