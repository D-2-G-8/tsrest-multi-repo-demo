import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { bffManagerContract } from '@acme/contracts';
import { USERS } from './state';

@Controller()
export class ApiController {
  @TsRestHandler(bffManagerContract)
  handler() {
    return tsRestHandler(bffManagerContract, {
      getUser: async ({ params }) => {
        const id = params.id;
        const user = USERS.get(id);
        if (!user) return { status: 404, body: { message: 'User not found' } };
        return { status: 200, body: user };
      },

      createUser: async ({ body }) => {
        for (const u of USERS.values()) {
          if (u.email === body.email) return { status: 409, body: { message: 'Email already exists' } };
        }
        const id = crypto.randomUUID();
        const user = { id, email: body.email, name: body.name };
        USERS.set(id, user);
        return { status: 201, body: { id } };
      },
    });
  }
}
