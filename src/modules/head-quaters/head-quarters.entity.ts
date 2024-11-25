import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class HeadQuarter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column({ nullable: true })
  businessPhone?: string;

  @Column({ nullable: true })
  websiteLink?: string;

  @Column('float', { nullable: true })
  latitude?: number;

  @Column('float', { nullable: true })
  longitude?: number;

  @Column({ default: false })
  productPickupAvailable: boolean;

  @Column({ nullable: true })
  instagramAccount?: string;
}
