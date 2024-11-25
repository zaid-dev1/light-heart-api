import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeadQuarter } from './head-quarters.entity';
import { HeadQuarterController } from './head-quarters.controller';
import { HeadQuarterService } from './head-quarters.service';
import { AuthMiddleware } from 'src/auth/auth/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([HeadQuarter])],
  controllers: [HeadQuarterController],
  providers: [HeadQuarterService],
})
export class HeadQuarterModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: 'headquarters/*',
      method: RequestMethod.ALL,
    });
  }
}
