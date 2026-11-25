import { IsNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';
import { RequestStatus } from '../../entities/viewing-request.entity';

export class UpdateViewingRequestDto {
  @IsNotEmpty()
  @IsEnum(RequestStatus, { message: 'Status must be Pending, Approved, Rejected, or Completed' })
  status: RequestStatus;

  @IsOptional()
  @IsString()
  remarks?: string;
}