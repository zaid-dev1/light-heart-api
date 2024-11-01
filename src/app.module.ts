import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  typeOrmConfig,
  initializeDatabaseConnection,
} from './config/typeorm.config';
import { CustomerModule } from './modules/customer/customer.module';
import { WebhookModule } from './modules/webhooks/webhook.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), CustomerModule, WebhookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    await initializeDatabaseConnection();
  }
}
