import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

/**
 * Public BFF API that the Next.js frontend calls.
 */
export const bffFrontendContract = c.router({
  login: {
    method: 'POST',
    path: '/v1/auth/login',
    body: z.object({
      login: z.string().min(1),
      password: z.string().min(1)
    }),
    responses: {
      200: z.object({ token: z.string().min(1) }),
      401: z.object({ message: z.string() })
    },
    summary: 'Authenticate and receive a token'
  },

  getUser: {
    method: 'GET',
    path: '/v1/users/:id',
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
    summary: 'Get a user by id (proxied from Manager service)'
  },

  createUser: {
    method: 'POST',
    path: '/v1/users',
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
    summary: 'Create a user (proxied to Manager service)'
  },

  getItem: {
    method: 'GET',
    path: '/v1/items/:id',
    pathParams: z.object({ id: z.string().uuid() }),
    headers: z.object({
      authorization: z.string().min(1).describe('Bearer token')
    }),
    responses: {
      200: z.object({
        id: z.string().uuid(),
        title: z.string().min(1),
        priceCents: z.number().int().nonnegative()
      }),
      401: z.object({ message: z.string() }),
      404: z.object({ message: z.string() })
    },
    summary: 'Get an item by id (proxied from Repo service)'
  }
});
