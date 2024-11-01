// src/customer/customer.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { ShopifyService } from './shopify.service';
import { Address } from './address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Address])],
  providers: [CustomerService, ShopifyService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}
