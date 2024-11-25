import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../customer/customer.entity';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { getCoordinatesFromAddress } from 'src/utils/geoUtils';
import { BusinessDetails } from '../business-details/business-details.entity';

@Injectable()
export class WebhookService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(BusinessDetails)
    private readonly businessDetailsRepository: Repository<BusinessDetails>,
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

  async handleCustomerDeletion(
    payload: any,
  ): Promise<{ message: string; id: string }> {
    const customerId = payload.id;
    const customer = await this.customerRepository.findOne({
      where: { customerId: `${customerId}` },
    });

    if (customer) {
      const businessDetails = await this.businessDetailsRepository.findOne({
        where: { customerId: `${customerId}` },
      });

      if (businessDetails) {
        await this.businessDetailsRepository.delete(businessDetails.id);
      }

      await this.customerRepository.remove(customer);

      return {
        message:
          'Customer and associated business details have been deleted successfully.',
        id: customer.customerId,
      };
    } else {
      return {
        message: `Customer with ID ${customerId} not found.`,
        id: customerId,
      };
    }
  }

  async handleCustomerCreation(payload: any): Promise<void> {
    const rawPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const customer = payload;
    const roles = ['educator', 'partner', 'lashArtist', 'student'];
    const newCustomer = this.customerRepository.create({
      customerId: `${customer.id}`,
      email: customer.email,
      createdAt: customer.createdAt || null,
      firstName: customer.first_name,
      lastName: customer.last_name || null,
      phone: customer.phone || null,
      password: hashedPassword,
      role: roles[Math.floor(Math.random() * roles.length)],
    });
    await this.customerRepository.save(newCustomer);
  }

  async handleCustomerUpdate(
    payload: any,
  ): Promise<{ message: string; id: string }> {
    const customer = payload;

    const existingCustomer = await this.customerRepository.findOne({
      where: { customerId: `${customer.id}` },
    });

    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${customer.id} not found.`);
    }

    Object.assign(existingCustomer, {
      email: customer.email,
      createdAt: customer.created_at
        ? new Date(customer.created_at)
        : existingCustomer.createdAt,
      firstName: customer.first_name,
      lastName: customer.last_name || null,
      phone: customer.phone || existingCustomer.phone,
    });

    try {
      await this.customerRepository.save(existingCustomer);
      return {
        message: 'Customer updated successfully.',
        id: existingCustomer.customerId,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update customer: ${error.message}`,
      );
    }
  }
}
