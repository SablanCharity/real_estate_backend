import { IsOptional, IsString } from 'class-validator';

export class CreatePropertyImageDto {
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  caption?: string;
}