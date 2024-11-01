import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  PrimaryColumn,
} from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Customer } from './customer.entity';

@Entity('addresses')
export class Address {
  @PrimaryColumn({ name: 'address_id', type: 'varchar' })
  addressId: string;

  @IsNotEmpty()
  @Column({ name: 'customer_id', type: 'varchar' })
  customerId: string;

  @IsNotEmpty()
  @Column({ name: 'address1', nullable: true })
  address1: string;

  @IsOptional()
  @Column({ name: 'address2', nullable: true })
  address2: string;

  @IsNotEmpty()
  @Column({ name: 'city', nullable: true })
  city: string;

  @IsOptional()
  @Column({ name: 'province', nullable: true })
  province: string;

  @IsNotEmpty()
  @Column({ name: 'country', nullable: true })
  country: string;

  @IsNotEmpty()
  @Column({ name: 'zip', nullable: true })
  zip: string;

  @IsOptional()
  @Column({ name: 'phone', nullable: true })
  phone: string;

  @IsOptional()
  @Column({ name: 'name', nullable: true })
  name: string;

  @IsOptional()
  @Column({ name: 'default', default: false })
  default: boolean;

  @Column('decimal', { precision: 10, scale: 6, nullable: true }) // Latitude up to 6 decimal places
  latitude: number;

  @Column('decimal', { precision: 10, scale: 6, nullable: true }) // Longitude up to 6 decimal places
  longitude: number;

  @ManyToOne(() => Customer, (customer) => customer.addresses)
  customer: Customer;
}
