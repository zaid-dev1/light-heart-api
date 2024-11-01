import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../customer/customer.entity';
import { Address } from '../customer/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Address])],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
