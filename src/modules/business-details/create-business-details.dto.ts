import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateBusinessDetailsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  businessPhone: string;

  @IsOptional()
  @IsString()
  instagramAccount?: string;

  @IsOptional()
  @IsString()
  websiteLink?: string;

  @IsOptional()
  @IsString()
  courses?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}
