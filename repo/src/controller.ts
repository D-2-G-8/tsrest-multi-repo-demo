import { Controller, UseGuards } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { bffRepoContract } from '@acme/contracts';
import { ITEMS } from './state';
import { AuthGuard, resolveToken } from './auth.guard';

@Controller()
@UseGuards(AuthGuard)
export class ApiController {
  @TsRestHandler(bffRepoContract)
  handler() {
    return tsRestHandler(bffRepoContract, {
      getItem: async ({ params, headers }) => {
        const token = resolveToken(headers);
        if (!token) return { status: 401, body: { message: 'Unauthorized' } };
        const item = ITEMS.get(params.id);
        if (!item) return { status: 404, body: { message: 'Item not found' } };
        return { status: 200, body: item };
      },
    });
  }
}
