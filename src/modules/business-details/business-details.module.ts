import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessDetailsService } from './business-details.service';
import { BusinessDetailsController } from './business-details.controller';
import { BusinessDetails } from './business-details.entity';
import { CustomerModule } from '../customer/customer.module';
import { Customer } from '../customer/customer.entity';
import { AuthMiddleware } from 'src/auth/auth/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([BusinessDetails, Customer]),
    CustomerModule,
  ],
  providers: [BusinessDetailsService],
  controllers: [BusinessDetailsController],
})
export class BusinessDetailsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: 'business-details/protected*',
      method: RequestMethod.ALL,
    });
  }
}
