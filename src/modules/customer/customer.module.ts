import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { ShopifyService } from './shopify.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from 'src/auth/auth/auth.middleware';
import { BusinessDetails } from '../business-details/business-details.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, BusinessDetails]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [CustomerService, ShopifyService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: 'customers/protected*',
      method: RequestMethod.ALL,
    });
  }
}
