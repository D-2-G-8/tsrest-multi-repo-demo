import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { initClient } from '@ts-rest/core';
import { bffFrontendContract, bffManagerContract, bffRepoContract } from '@acme/contracts';

const managerClient = initClient(bffManagerContract, {
  baseUrl: process.env.MANAGER_URL || 'http://localhost:3001',
  baseHeaders: {},
});

const repoClient = initClient(bffRepoContract, {
  baseUrl: process.env.REPO_URL || 'http://localhost:3002',
  baseHeaders: {},
});

@Controller()
export class ApiController {
  @TsRestHandler(bffFrontendContract)
  handler() {
    return tsRestHandler(bffFrontendContract, {
      getUser: async ({ params }) => {
        return managerClient.getUser({ params });
      },
      createUser: async ({ body }) => {
        return managerClient.createUser({ body });
      },
      getItem: async ({ params }) => {
        return repoClient.getItem({ params });
      },
    });
  }
}
