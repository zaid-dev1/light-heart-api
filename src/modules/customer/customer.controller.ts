import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './customer.entity';
import { UpdateRoleDto } from './update-role.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('protected/:id')
  async getCustomerById(
    @Param('id') id: string,
  ): Promise<{ message: string; customer?: Customer }> {
    return this.customerService.getCustomerById(id);
  }

  @Get('protected/admin/all')
  async getAllCustomers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    message: string;
    customers: Customer[];
    pagination: { total: number; page: number; limit: number };
  }> {
    return this.customerService.getAllCustomers(page, limit);
  }

  @Patch('protected/:id/role')
  async updateCustomerRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<{ message: string; customer?: Customer }> {
    return this.customerService.updateCustomerRole(id, updateRoleDto);
  }

  @Post('initialize') // Run this route once to save customers
  async initializeCustomers(): Promise<string> {
    await this.customerService.saveCustomersOnce();
    return 'Customers have been initialized and saved successfully.';
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }): Promise<any> {
    const { email, password } = body;
    try {
      const result = await this.customerService.login(email, password);
      return result;
    } catch (error) {
      return { message: error.message };
    }
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() { email }: { email: string },
  ): Promise<{ message: string }> {
    return this.customerService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<{ message: string }> {
    return this.customerService.resetPassword(token, newPassword);
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
    customers: { customer: Customer; businessProfile: {} }[];
    pagination: {
      total: number;
      page: number;
      limit: number;
    };
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
