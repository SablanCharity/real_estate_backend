import { IsNotEmpty, IsNumber, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateViewingRequestDto {
  @IsNotEmpty()
  @IsNumber()
  propertyId: number;

  @IsNotEmpty()
  @IsDateString({}, { message: 'scheduledDate must be a valid ISO 8601 date-time string' })
  scheduledDate: string;

  @IsOptional()
  @IsString()
  requestNotes?: string;
}