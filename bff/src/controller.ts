import { Controller, UseGuards } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { initClient } from '@ts-rest/core';
import { authContract, bffFrontendContract, bffManagerContract, bffRepoContract } from '@acme/contracts';
import { AuthGuard, resolveToken } from './auth.guard';

const managerClient = initClient(bffManagerContract, {
  baseUrl: process.env.MANAGER_URL || 'http://localhost:3001',
  baseHeaders: {},
});

const repoClient = initClient(bffRepoContract, {
  baseUrl: process.env.REPO_URL || 'http://localhost:3002',
  baseHeaders: {},
});

const authClient = initClient(authContract, {
  baseUrl: process.env.AUTH_URL || 'http://localhost:3004',
  baseHeaders: {},
});

@Controller()
export class ApiController {
  @UseGuards(AuthGuard)
  @TsRestHandler(bffFrontendContract)
  handler() {
    return tsRestHandler(bffFrontendContract, {
      login: async ({ body }) => {
        return authClient.login({ body });
      },
      getUser: async ({ params, headers }) => {
        const token = resolveToken(headers);
        const authorization = headers?.authorization ?? `Bearer ${token}`;
        return managerClient.getUser({ params, headers: { authorization } });
      },
      createUser: async ({ body, headers }) => {
        const token = resolveToken(headers);
        const authorization = headers?.authorization ?? `Bearer ${token}`;
        return managerClient.createUser({ body, headers: { authorization } });
      },
      getItem: async ({ params, headers }) => {
        const token = resolveToken(headers);
        const authorization = headers?.authorization ?? `Bearer ${token}`;
        return repoClient.getItem({ params, headers: { authorization } });
      },
    });
  }
}
