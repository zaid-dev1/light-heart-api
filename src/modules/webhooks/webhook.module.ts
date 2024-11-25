import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../customer/customer.entity';
import { BusinessDetails } from '../business-details/business-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, BusinessDetails])],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
