import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { HeadQuarterService } from './head-quarters.service';

@Controller('headquarters')
export class HeadQuarterController {
  constructor(private readonly headQuarterService: HeadQuarterService) {}

  @Post()
  async create(@Body() data: any) {
    return this.headQuarterService.create(data);
  }

  @Get()
  async findAll() {
    return this.headQuarterService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.headQuarterService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: any) {
    return this.headQuarterService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.headQuarterService.delete(id);
  }
}
