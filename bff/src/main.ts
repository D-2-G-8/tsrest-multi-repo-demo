import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { generateOpenApi } from '@ts-rest/open-api';
import { AppModule } from './app.module';
import { bffFrontendContract } from '@acme/contracts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = Number(process.env.PORT || 3000);

  // Swagger UI generated FROM THE SHARED CONTRACT
  const documentFactory = () =>
    generateOpenApi(
      bffFrontendContract,
      {
        info: { title: 'bff', version: '0.1.0' },
        servers: [{ url: `http://localhost:${port}` }],
        components: {
          securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer' }
          }
        },
        security: [{ bearerAuth: [] }]
      },
      { setOperationId: true }
    );

  const documentWithOverrides = () => {
    const doc = documentFactory();
    const loginOp = doc.paths?.['/v1/auth/login']?.post;
    if (loginOp) {
      loginOp.security = [];
    }
    return doc;
  };

  SwaggerModule.setup('docs', app, documentWithOverrides);

  // Optional: expose raw OpenAPI JSON
  app.getHttpAdapter().get('/openapi.json', (_req: any, res: any) => {
    res.json(documentWithOverrides());
  });

  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`bff listening on http://localhost:${port}`);
  console.log(`Swagger: http://localhost:${port}/docs`);
}

bootstrap();
