import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HeadQuarter } from './head-quarters.entity';

@Injectable()
export class HeadQuarterService {
  constructor(
    @InjectRepository(HeadQuarter)
    private readonly headQuarterRepository: Repository<HeadQuarter>,
  ) {}

  async create(data: Partial<HeadQuarter>) {
    try {
      const headQuarter = this.headQuarterRepository.create(data);
      const savedHeadQuarter =
        await this.headQuarterRepository.save(headQuarter);
      return {
        message: 'Headquarter created successfully.',
        data: savedHeadQuarter,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to create headquarter.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      const headquarters = await this.headQuarterRepository.find();
      return {
        message: 'Headquarters retrieved successfully.',
        data: headquarters,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve headquarters.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const headQuarter = await this.headQuarterRepository.findOneBy({ id });
      if (!headQuarter) {
        throw new HttpException('Headquarter not found.', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'Headquarter retrieved successfully.',
        data: headQuarter,
      };
    } catch (error) {
      throw new HttpException(
        error.response || 'Failed to retrieve headquarter.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, data: Partial<HeadQuarter>) {
    try {
      const existingHeadQuarter = await this.headQuarterRepository.findOneBy({
        id,
      });
      if (!existingHeadQuarter) {
        throw new HttpException('Headquarter not found.', HttpStatus.NOT_FOUND);
      }
      await this.headQuarterRepository.update(id, data);
      const updatedHeadQuarter = await this.headQuarterRepository.findOneBy({
        id,
      });
      return {
        message: 'Headquarter updated successfully.',
        data: updatedHeadQuarter,
      };
    } catch (error) {
      throw new HttpException(
        error.response || 'Failed to update headquarter.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: number) {
    try {
      const existingHeadQuarter = await this.headQuarterRepository.findOneBy({
        id,
      });
      if (!existingHeadQuarter) {
        throw new HttpException('Headquarter not found.', HttpStatus.NOT_FOUND);
      }
      await this.headQuarterRepository.delete(id);
      return {
        message: 'Headquarter deleted successfully.',
      };
    } catch (error) {
      throw new HttpException(
        error.response || 'Failed to delete headquarter.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
