import { IsOptional, IsString, IsEnum } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be Admin, Agent, or Customer' })
  role?: UserRole;
}