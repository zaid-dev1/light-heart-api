import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumber, IsDecimal } from 'class-validator';

export class CreateAddressDto {
    @IsNotEmpty({ message: 'Customer ID is required.' })
    @IsString({ message: 'Customer ID must be a string.' })
    customerId: string;

    @IsNotEmpty({ message: 'Address Line 1 is required.' })
    @IsString({ message: 'Address Line 1 must be a string.' })
    address1: string;

    @IsOptional()
    @IsString({ message: 'Address Line 2 must be a string.' })
    address2?: string;

    @IsNotEmpty({ message: 'City is required.' })
    @IsString({ message: 'City must be a string.' })
    city: string;

    @IsOptional()
    @IsString({ message: 'Province must be a string.' })
    province?: string;

    @IsNotEmpty({ message: 'Country is required.' })
    @IsString({ message: 'Country must be a string.' })
    country: string;

    @IsNotEmpty({ message: 'ZIP/Postal code is required.' })
    @IsString({ message: 'ZIP/Postal code must be a string.' })
    zip: string;

    @IsOptional()
    @IsString({ message: 'Phone number must be a string.' })
    phone?: string;

    @IsOptional()
    @IsString({ message: 'Name must be a string.' })
    name?: string;

    @IsOptional()
    @IsBoolean({ message: 'Default must be a boolean value.' })
    default?: boolean;

    @IsOptional()
    @IsDecimal({ decimal_digits: '0,6' }, { message: 'Latitude must be a decimal number with up to 6 decimal places.' })
    latitude?: number;

    @IsOptional()
    @IsDecimal({ decimal_digits: '0,6' }, { message: 'Longitude must be a decimal number with up to 6 decimal places.' })
    longitude?: number;
}
