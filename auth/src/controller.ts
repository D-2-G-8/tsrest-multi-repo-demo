import { Controller, UseGuards } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { authContract } from '@acme/contracts';
import { issueToken, isTokenValid, VALID_LOGIN, VALID_PASSWORD } from './state';
import { AuthGuard, resolveToken } from './auth.guard';

@Controller()
@UseGuards(AuthGuard)
export class ApiController {
  @TsRestHandler(authContract)
  handler() {
    return tsRestHandler(authContract, {
      login: async ({ body }) => {
        if (body.login !== VALID_LOGIN || body.password !== VALID_PASSWORD) {
          return { status: 401, body: { message: 'Invalid credentials' } };
        }

        const token = issueToken(body.login);
        return { status: 200, body: { token } };
      },

      validate: async ({ body }) => {
        const valid = isTokenValid(body.token);
        return { status: 200, body: { valid } };
      },
    });
  }
}
