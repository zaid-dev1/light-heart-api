import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../customer/customer.entity';
import * as crypto from 'crypto';
import { getCoordinatesFromAddress } from 'src/utils/geoUtils';

@Injectable()
export class WebhookService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  verifyWebhook(hmac: string, rawBody: string): boolean {
    if (!hmac || !rawBody) {
      return false;
    }

    try {
      const generatedHmac = crypto
        .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('base64');

      return crypto.timingSafeEqual(
        Buffer.from(generatedHmac),
        Buffer.from(hmac),
      );
    } catch (error) {
      return false;
    }
  }
  // private async handleCustomerAddresses(
  //   addresses: any[],
  //   savedCustomer: any,
  // ): Promise<void> {
  //   for (const address of addresses) {
  //     try {
  //       const { lat, lng } = await getCoordinatesFromAddress(address);
  //       let existingAddress = await this.addressRepository.findOne({
  //         where: {
  //           addressId: address.id,
  //           customerId: `${savedCustomer.customerId}`,
  //         },
  //       });

  //       if (existingAddress) {
  //         Object.assign(existingAddress, {
  //           address1: address.address1,
  //           address2: address.address2 || null,
  //           city: address.city,
  //           province: address.province || null,
  //           country: address.country,
  //           zip: address.zip,
  //           phone: address.phone || null,
  //           name: address.name || null,
  //           default: address.default || false,
  //           latitude: lat,
  //           longitude: lng,
  //         });
  //         await this.addressRepository.save(existingAddress);
  //       } else {
  //         const newAddress = this.addressRepository.create({
  //           addressId: address.id,
  //           customerId: `${savedCustomer.customerId}`,
  //           address1: address.address1,
  //           address2: address.address2 || null,
  //           city: address.city,
  //           province: address.province || null,
  //           country: address.country,
  //           zip: address.zip,
  //           phone: address.phone || null,
  //           name: address.name || null,
  //           default: address.default || false,
  //           latitude: lat,
  //           longitude: lng,
  //           customer: savedCustomer,
  //         });
  //         await this.addressRepository.save(newAddress);
  //       }
  //     } catch (error) {
  //       console.error(
  //         `Error processing address for customer ${savedCustomer.customerId}:`,
  //         error,
  //       );
  //     }
  //   }
  // }

  // async handleCustomerDeletion(
  //   payload: any,
  // ): Promise<{ message: string; id: string }> {
  //   const customerId = payload.id;

  //   const customer = await this.customerRepository.findOne({
  //     where: { customerId: `${customerId}` },
  //     relations: ['addresses'],
  //   });

  //   if (customer) {
  //     await this.addressRepository.remove(customer.addresses);
  //     await this.customerRepository.remove(customer);

  //     return {
  //       message:
  //         'Customer and associated addresses have been deleted successfully.',
  //       id: customer.customerId,
  //     };
  //   } else {
  //     return {
  //       message: `Customer with ID ${customerId} not found.`,
  //       id: customerId,
  //     };
  //   }
  // }

  // async handleCustomerCreation(payload: any): Promise<void> {
  //   const customer = payload;
  //   const roles = ['educator', 'partner', 'lashArtist', 'student', 'lightHQ'];
  //   const newCustomer = this.customerRepository.create({
  //     customerId: `${customer.id}`,
  //     email: customer.email,
  //     createdAt: new Date(customer.created_at),
  //     updatedAt: new Date(customer.updated_at),
  //     firstName: customer.first_name,
  //     lastName: customer.last_name || null,
  //     ordersCount: `${customer.orders_count}`,
  //     state: customer.state,
  //     totalSpent: customer.total_spent,
  //     lastOrderId: customer.last_order_id || null,
  //     note: customer.note,
  //     verifiedEmail: customer.verified_email,
  //     phone: customer.phone,
  //     role: roles[Math.floor(Math.random() * roles.length)],
  //   });
  //   await this.customerRepository.save(newCustomer);
  // }

  // async handleCustomerUpdate(payload: any): Promise<void> {
  //   const customer = payload;
  //   const existingCustomer = await this.customerRepository.findOne({
  //     where: { customerId: `${customer.id}` },
  //     relations: ['addresses'],
  //   });

  //   if (!existingCustomer) {
  //     throw new Error(`Customer with ID ${customer.id} not found.`);
  //   }

  //   Object.assign(existingCustomer, {
  //     email: customer.email,
  //     updatedAt: new Date(customer.updated_at),
  //     firstName: customer.first_name,
  //     lastName: customer.last_name || null,
  //     ordersCount: `${customer.orders_count}`,
  //     state: customer.state,
  //     totalSpent: customer.total_spent,
  //     lastOrderId: customer.last_order_id || null,
  //     note: customer.note,
  //     verifiedEmail: customer.verified_email,
  //     phone: customer.phone,
  //   });

  //   const updatedCustomer =
  //     await this.customerRepository.save(existingCustomer);
  //   if (customer.addresses?.length > 0) {
  //     await this.handleCustomerAddresses(customer.addresses, updatedCustomer);
  //   } else if (customer?.addresses?.length === 0 && customer.default_address) {
  //     await this.handleCustomerAddresses(
  //       [customer.default_address],
  //       updatedCustomer,
  //     );
  //   }
  // }
}
