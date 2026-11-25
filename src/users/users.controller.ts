import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint 3: GET /api/v1/users (Admin only)
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(
    @Query('role') role?: UserRole,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.usersService.findAll(
      role,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  // Endpoint 4: GET /api/v1/users/:id (Authenticated)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // Endpoint 5: PATCH /api/v1/users/:id (Authenticated)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  // Endpoint 6: DELETE /api/v1/users/:id (Admin only)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}