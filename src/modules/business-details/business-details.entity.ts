import { IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('business_details')
export class BusinessDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty()
  customerId: string;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty()
  name: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  address: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  businessPhone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  instagramAccount: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  websiteLink: string;

  @Column({ type: 'text', nullable: true })
  courses: string;

  @Column({ type: 'text', nullable: true })
  services: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;
}
