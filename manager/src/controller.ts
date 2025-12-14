import { Controller, UseGuards } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { bffManagerContract } from '@acme/contracts';
import { USERS } from './state';
import { AuthGuard, resolveToken } from './auth.guard';

@Controller()
@UseGuards(AuthGuard)
export class ApiController {
  @TsRestHandler(bffManagerContract)
  handler() {
    return tsRestHandler(bffManagerContract, {
      getUser: async ({ params, headers }) => {
        const token = resolveToken(headers);
        if (!token) return { status: 401, body: { message: 'Unauthorized' } };
        const id = params.id;
        const user = USERS.get(id);
        if (!user) return { status: 404, body: { message: 'User not found' } };
        return { status: 200, body: user };
      },

      createUser: async ({ body, headers }) => {
        const token = resolveToken(headers);
        if (!token) return { status: 401, body: { message: 'Unauthorized' } };
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
