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
    headers: z.object({
      authorization: z.string().min(1).describe('Bearer token')
    }),
    responses: {
      200: z.object({
        id: z.string().uuid(),
        email: z.string().email(),
        name: z.string().min(1),
      }),
      401: z.object({ message: z.string() }),
      404: z.object({ message: z.string() })
    },
    summary: 'Manager: get user'
  },

  createUser: {
    method: 'POST',
    path: '/internal/v1/users',
    headers: z.object({
      authorization: z.string().min(1).describe('Bearer token')
    }),
    body: z.object({
      email: z.string().email(),
      name: z.string().min(1)
    }),
    responses: {
      201: z.object({ id: z.string().uuid() }),
      401: z.object({ message: z.string() }),
      409: z.object({ message: z.string() })
    },
    summary: 'Manager: create user'
  }
});
