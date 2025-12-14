import { Module } from '@nestjs/common';
import { ApiController } from './controller';

@Module({
  controllers: [ApiController],
})
export class AppModule {}
