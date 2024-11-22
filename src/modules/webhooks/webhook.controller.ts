import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
  Req,
  RawBodyRequest,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { Request } from 'express';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  // @Post('customers/delete')
  // async handleCustomerDeletion(
  //   @Req() request: RawBodyRequest<Request>,
  //   @Body() payload: any,
  //   @Headers('x-shopify-hmac-sha256') hmac: string,
  //   @Headers('x-shopify-topic') topic: string,
  // ): Promise<{ message: string; id: string }> {
  //   // Get the raw body as a string
  //   const rawBody = request.rawBody?.toString('utf8') || '';

  //   const isValid = this.webhookService.verifyWebhook(hmac, rawBody);
  //   console.log('Webhook Verification:', {
  //     isValid,
  //     payload,
  //     hmac,
  //     rawBody: rawBody.slice(0, 100) + '...', // Log first 100 chars for debugging
  //   });

  //   if (!isValid) {
  //     throw new BadRequestException('Invalid HMAC verification.');
  //   }

  //   const result = await this.webhookService.handleCustomerDeletion(payload);
  //   return result;
  // }

  // @Post('customers/create')
  // async handleCustomerCreation(
  //   @Req() request: RawBodyRequest<Request>,
  //   @Body() payload: any,
  //   @Headers('x-shopify-hmac-sha256') hmac: string,
  //   @Headers('x-shopify-topic') topic: string,
  // ): Promise<void> {
  //   const rawBody = request.rawBody?.toString('utf8') || '';
  //   const isValid = this.webhookService.verifyWebhook(hmac, rawBody);
  //   if (!isValid) {
  //     throw new BadRequestException('Invalid HMAC verification.');
  //   }
  //   await this.webhookService.handleCustomerCreation(payload);
  // }

  // @Post('customers/update')
  // async handleCustomerUpdate(
  //   @Req() request: RawBodyRequest<Request>,
  //   @Body() payload: any,
  //   @Headers('x-shopify-hmac-sha256') hmac: string,
  //   @Headers('x-shopify-topic') topic: string,
  // ): Promise<void> {
  //   const rawBody = request.rawBody?.toString('utf8') || '';
  //   const isValid = this.webhookService.verifyWebhook(hmac, rawBody);

  //   if (!isValid) {
  //     throw new BadRequestException('Invalid HMAC verification.');
  //   }
  //   await this.webhookService.handleCustomerUpdate(payload);
  // }
}
