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
    responses: {
      200: z.object({
        id: z.string().uuid(),
        title: z.string().min(1),
        priceCents: z.number().int().nonnegative()
      }),
      404: z.object({ message: z.string() })
    },
    summary: 'Repo: get item'
  }
});
