import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ name: 'customer_id', type: 'varchar', length: 255 })
  customerId: string;

  @IsEmail()
  @Column({ name: 'email', nullable: true })
  email: string;

  @IsNotEmpty()
  @Column({ name: 'password', type: 'varchar' })
  password: string;

  @IsOptional()
  @Column({ name: 'created_at', nullable: true })
  createdAt: Date;

  @IsOptional()
  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @IsOptional()
  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @IsOptional()
  @Column({ name: 'phone', nullable: true })
  phone: string;

  @IsOptional()
  @Column({ type: 'varchar', nullable: true })
  role: string;
}
