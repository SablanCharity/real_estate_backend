import { IsEmail, IsNotEmpty, IsOptional, IsEnum, MinLength, IsString } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be Admin, Agent, or Customer' })
  role?: UserRole;

  @IsOptional()
  @IsString()
  phone?: string;
}