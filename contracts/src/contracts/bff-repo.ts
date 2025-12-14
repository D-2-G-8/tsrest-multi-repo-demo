import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

/**
 * Internal API that BFF calls on Repo service.
 */
export const bffRepoContract = c.router({
  getItem: {
    method: 'GET',
    path: '/internal/v1/items/:id',
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
    summary: 'Repo: get item'
  }
});
