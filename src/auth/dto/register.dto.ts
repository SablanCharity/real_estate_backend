import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsString,
  Matches,
} from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
  })
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be Admin, Agent, or Customer' })
  role?: UserRole;

  @IsOptional()
  @IsString()
  @Matches(/^09\d{9}$/, {
    message: 'Phone number must be 11 digits starting with 09 (e.g., 09171234567)',
  })
  phone?: string;
}