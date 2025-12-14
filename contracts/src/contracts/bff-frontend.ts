import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

/**
 * Public BFF API that the Next.js frontend calls.
 */
export const bffFrontendContract = c.router({
  getUser: {
    method: 'GET',
    path: '/v1/users/:id',
    pathParams: z.object({ id: z.string().uuid() }),
    responses: {
      200: z.object({
        id: z.string().uuid(),
        email: z.string().email(),
        name: z.string().min(1),
      }),
      404: z.object({ message: z.string() })
    },
    summary: 'Get a user by id (proxied from Manager service)'
  },

  createUser: {
    method: 'POST',
    path: '/v1/users',
    body: z.object({
      email: z.string().email(),
      name: z.string().min(1)
    }),
    responses: {
      201: z.object({ id: z.string().uuid() }),
      409: z.object({ message: z.string() })
    },
    summary: 'Create a user (proxied to Manager service)'
  },

  getItem: {
    method: 'GET',
    path: '/v1/items/:id',
    pathParams: z.object({ id: z.string().uuid() }),
    responses: {
      200: z.object({
        id: z.string().uuid(),
        title: z.string().min(1),
        priceCents: z.number().int().nonnegative()
      }),
      404: z.object({ message: z.string() })
    },
    summary: 'Get an item by id (proxied from Repo service)'
  }
});
