import { IsOptional, IsString, IsEnum, Matches } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^09\d{9}$/, {
    message: 'Phone number must be 11 digits starting with 09 (e.g., 09171234567)',
  })
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be Admin, Agent, or Customer' })
  role?: UserRole;
}