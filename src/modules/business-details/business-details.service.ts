import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessDetails } from './business-details.entity';
import { Customer } from '../customer/customer.entity';
import { CreateBusinessDetailsDto } from './create-business-details.dto';

@Injectable()
export class BusinessDetailsService {
  constructor(
    @InjectRepository(BusinessDetails)
    private readonly businessDetailsRepository: Repository<BusinessDetails>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async createUpdateBusinessDetails(
    customerId: string,
    data: CreateBusinessDetailsDto,
  ): Promise<{ message: string; businessDetails?: BusinessDetails }> {
    const customer = await this.customerRepository.findOne({
      where: { customerId },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found.`);
    }

    const existingDetails = await this.businessDetailsRepository.findOne({
      where: { customerId },
    });

    if (existingDetails) {
      const updatedDetails = await this.businessDetailsRepository.save({
        ...existingDetails,
        ...data,
      });

      return {
        message: 'Business details updated successfully.',
        businessDetails: updatedDetails,
      };
    } else {
      const newDetails = this.businessDetailsRepository.create({
        ...data,
        customerId,
      });
      const result = await this.businessDetailsRepository.save(newDetails);

      return {
        message: 'Business details created successfully.',
        businessDetails: result,
      };
    }
  }
}
