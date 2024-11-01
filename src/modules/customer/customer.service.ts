import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { ShopifyService } from './shopify.service';
import { Address } from './address.entity';
import { getCoordinatesFromAddress } from 'src/utils/geoUtils';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    private readonly shopifyService: ShopifyService,
  ) {}

  async handleAddresses(customer: any, savedCustomer: Customer): Promise<void> {
    for (const address of customer.addresses || []) {
      const fullAddress = `${address.address1}, ${address.address2 || ''}, ${address.city}, ${address.country}`;
      try {
        const { lat, lng } = await getCoordinatesFromAddress(fullAddress);

        const newAddress = this.addressRepository.create({
          customerId: `${savedCustomer.customerId}`,
          addressId: address.id,
          address1: address.address1,
          address2: address.address2 || null,
          city: address.city,
          province: address.province || null,
          country: address.country,
          zip: address.zip,
          phone: address.phone || null,
          name: address.name || null,
          default: address.default || false,
          latitude: lat,
          longitude: lng,
          customer: savedCustomer,
        });

        await this.addressRepository.save(newAddress);
      } catch (error) {
        console.error(
          `Error fetching or saving address for customer ${customer.id}:`,
          error,
        );
      }
    }
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      throw new Error('Invalid ID format');
    }

    const customer = await this.customerRepository.findOne({
      where: { id: numericId },
    });
    return customer || null;
  }

  async saveCustomersOnce(): Promise<void> {
    const roles = ['educator', 'partner', 'lashArtist', 'student', 'lightHQ'];
    const customers = await this.shopifyService.getCustomersFromShopify();

    for (const customer of customers) {
      try {
        const existingCustomer = await this.customerRepository.findOne({
          where: { customerId: `${customer.id}` },
        });

        if (!existingCustomer) {
          const createdAt = customer.createdAt
            ? new Date(customer.createdAt)
            : null;
          const validCreatedAt =
            createdAt && !isNaN(createdAt.getTime()) ? createdAt : null;

          const newCustomer = this.customerRepository.create({
            customerId: `${customer.id}`,
            email: customer.email || null,
            createdAt: validCreatedAt,
            updatedAt: new Date(),
            firstName: customer.firstName || null,
            lastName: customer.lastName || null,
            ordersCount: `${customer.ordersCount || 0}`,
            state: customer.state || null,
            totalSpent: customer.totalSpent || 0,
            lastOrderId: customer.lastOrderId || null,
            note: customer.note || null,
            verifiedEmail: customer.verifiedEmail || false,
            phone: customer.phone || null,
            role: roles[Math.floor(Math.random() * roles.length)],
          });

          const savedCustomer = await this.customerRepository.save(newCustomer);
          if (customer.addresses?.length > 0) {
            await this.handleAddresses(customer, savedCustomer);
          }
        } else {
          console.error(
            `Customer with ID ${customer.id} already exists, skipping.`,
          );
        }
      } catch (error) {
        console.error(`Error processing customer ${customer.id}:`, error);
        // Continue to the next customer without breaking the process
        continue;
      }
    }
  }

  async findNearbyCustomers(
    lat: number,
    lng: number,
    radius: number,
    page: number,
    limit: number,
    roles: string[],
  ): Promise<{
    message: string;
    customers: { customer: Customer; addresses: Address[] }[];
    pagination: {
      total: number;
      page: number;
      limit: number;
    };
  }> {
    // Calculate lat/lng boundaries (bounding box)
    const latChange = radius / 111.32;
    const lonChange = radius / (111.32 * Math.cos((lat * Math.PI) / 180));

    const minLat = lat - latChange;
    const maxLat = lat + latChange;
    const minLng = lng - lonChange;
    const maxLng = lng + lonChange;

    // Create query to find customers with their addresses in the specified bounding box
    let query = this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.addresses', 'address')
      .where('address.latitude BETWEEN :minLat AND :maxLat', { minLat, maxLat })
      .andWhere('address.longitude BETWEEN :minLng AND :maxLng', {
        minLng,
        maxLng,
      });

    // Apply role-based filtering if roles are provided
    if (roles.length > 0) {
      query = query.andWhere('customer.role IN (:...roles)', { roles });
    }

    // Apply pagination
    const [customers, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    if (customers.length === 0) {
      throw new NotFoundException(
        'No customers found within the specified radius.',
      );
    }

    return {
      message: 'Nearby customers retrieved successfully.',
      customers: customers.map((customer) => ({
        customer,
        addresses: customer.addresses,
      })),
      pagination: {
        total,
        page,
        limit,
      },
    };
  }
}
