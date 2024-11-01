import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './customer.entity';
import { Address } from './address.entity';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get(':id')
  async getCustomerById(
    @Param('id') id: string,
  ): Promise<{ message: string; customer: Customer }> {
    const customer = await this.customerService.getCustomerById(id);

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found.`);
    }

    return {
      message: 'Customer retrieved successfully.',
      customer,
    };
  }

  @Post('initialize') // Run this route once to save customers
  async initializeCustomers(): Promise<string> {
    await this.customerService.saveCustomersOnce();
    return 'Customers have been initialized and saved successfully.';
  }

  @Post('nearby')
  async getNearbyCustomers(
    @Body('lat') lat: string,
    @Body('lng') lng: string,
    @Body('radius') radius: string,
    @Body('page') page: string,
    @Body('limit') limit: string,
    @Body('roles') roles: string[],
  ): Promise<{
    message: string;
    customers: { customer: Customer; addresses: Address[] }[];
  }> {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusValue = parseFloat(radius);
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusValue)) {
      throw new NotFoundException('Invalid input parameters.');
    }

    return this.customerService.findNearbyCustomers(
      latitude,
      longitude,
      radiusValue,
      pageNumber,
      limitNumber,
      roles || [],
    );
  }
}
