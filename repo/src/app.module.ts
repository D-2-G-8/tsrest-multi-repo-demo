import { Module } from '@nestjs/common';
import { ApiController } from './controller';
import { AuthGuard } from './auth.guard';

@Module({
  controllers: [ApiController],
  providers: [AuthGuard],
})
export class AppModule {}
