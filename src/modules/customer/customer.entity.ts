import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Address } from './address.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ name: 'customer_id', type: 'varchar' })
  customerId: string;

  @IsEmail()
  @Column({ nullable: true })
  email: string;

  @IsNotEmpty()
  @Column({ name: 'created_at' })
  createdAt: Date;

  @IsNotEmpty()
  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @IsNotEmpty()
  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @IsOptional()
  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @IsOptional()
  @Column({ name: 'orders_count', default: 0, nullable: true })
  ordersCount: string;

  @IsOptional()
  @Column({ name: 'state', default: 'disabled', nullable: true })
  state: string;

  @IsOptional()
  @Column({ name: 'total_spent', type: 'decimal', default: 0.0 })
  totalSpent: string;

  @IsOptional()
  @Column({ name: 'last_order_id', nullable: true })
  lastOrderId: string;

  @IsOptional()
  @Column({ default: '', nullable: true })
  note: string;

  @Column({ name: 'verified_email', default: false })
  verifiedEmail: boolean;

  @IsOptional()
  @Column({ name: 'phone', nullable: true })
  phone: string;

  @IsOptional()
  @Column({ type: 'varchar', nullable: true })
  role: string;

  @OneToMany(() => Address, (address) => address.customer, { cascade: true })
  addresses: Address[];
}
