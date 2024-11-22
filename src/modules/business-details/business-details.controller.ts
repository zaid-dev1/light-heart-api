import { Controller, Post, Body, Param, Get, Patch } from '@nestjs/common';
import { BusinessDetailsService } from './business-details.service';
import { BusinessDetails } from './business-details.entity';
import { CreateBusinessDetailsDto } from './create-business-details.dto';

@Controller('business-details')
export class BusinessDetailsController {
  constructor(
    private readonly businessDetailsService: BusinessDetailsService,
  ) {}

  @Post('protected/:customerId')
  async create(
    @Param('customerId') customerId: string,
    @Body() data: CreateBusinessDetailsDto,
  ): Promise<{ message: string; businessDetails?: BusinessDetails }> {
    return this.businessDetailsService.createUpdateBusinessDetails(
      customerId,
      data,
    );
  }
}
