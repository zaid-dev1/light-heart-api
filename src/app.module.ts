import {
  Module,
  OnModuleInit,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  typeOrmConfig,
  initializeDatabaseConnection,
} from './config/typeorm.config';
import { CustomerModule } from './modules/customer/customer.module';
import { WebhookModule } from './modules/webhooks/webhook.module';
import { AuthMiddleware } from './auth/auth/auth.middleware';
import { BusinessDetailsModule } from './modules/business-details/business-details.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    CustomerModule,
    WebhookModule,
    BusinessDetailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    await initializeDatabaseConnection();
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'customers/:id', method: RequestMethod.GET },
        { path: 'business-details/:id', method: RequestMethod.POST },
      );
  }
}
