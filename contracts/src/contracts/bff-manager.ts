import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

/**
 * Internal API that BFF calls on Manager service.
 */
export const bffManagerContract = c.router({
  getUser: {
    method: 'GET',
    path: '/internal/v1/users/:id',
    pathParams: z.object({ id: z.string().uuid() }),
    responses: {
      200: z.object({
        id: z.string().uuid(),
        email: z.string().email(),
        name: z.string().min(1),
      }),
      404: z.object({ message: z.string() })
    },
    summary: 'Manager: get user'
  },

  createUser: {
    method: 'POST',
    path: '/internal/v1/users',
    body: z.object({
      email: z.string().email(),
      name: z.string().min(1)
    }),
    responses: {
      201: z.object({ id: z.string().uuid() }),
      409: z.object({ message: z.string() })
    },
    summary: 'Manager: create user'
  }
});
