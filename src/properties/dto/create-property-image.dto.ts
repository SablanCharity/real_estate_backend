import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreatePropertyImageDto {
  @IsNotEmpty()
  @IsUrl({}, { message: 'imageUrl must be a valid URL string' })
  imageUrl: string;
}