import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { bffRepoContract } from '@acme/contracts';
import { ITEMS } from './state';

@Controller()
export class ApiController {
  @TsRestHandler(bffRepoContract)
  handler() {
    return tsRestHandler(bffRepoContract, {
      getItem: async ({ params }) => {
        const item = ITEMS.get(params.id);
        if (!item) return { status: 404, body: { message: 'Item not found' } };
        return { status: 200, body: item };
      },
    });
  }
}
