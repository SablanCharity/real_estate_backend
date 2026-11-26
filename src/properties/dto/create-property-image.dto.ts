import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePropertyImageDto {
  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  imageUrl?: string;

  @IsOptional()
  @IsString()
  caption?: string;
}
