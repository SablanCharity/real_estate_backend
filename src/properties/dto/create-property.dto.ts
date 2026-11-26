import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { PropertyStatus } from '../../entities/property.entity';

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  caption?: string;
}
