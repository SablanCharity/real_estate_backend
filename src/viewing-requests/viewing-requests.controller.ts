import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ViewingRequestsService } from './viewing-requests.service';
import { CreateViewingRequestDto } from './dto/create-viewing-request.dto';
import { UpdateViewingRequestDto } from './dto/update-viewing-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequestStatus } from '../entities/viewing-request.entity';
import { UserRole } from '../entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('viewing-requests')
export class ViewingRequestsController {
  constructor(private readonly viewingRequestsService: ViewingRequestsService) {}

  // POST /api/v1/viewing-requests (Customer only)
  @Roles(UserRole.CUSTOMER)
  @Post()
  async create(@Body() dto: CreateViewingRequestDto, @Req() req: any) {
    return this.viewingRequestsService.create(dto, req.user);
  }

  // GET /api/v1/viewing-requests (Agent, Admin)
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @Get()
  async findAll(@Query('status') status: RequestStatus | undefined, @Req() req: any) {
    return this.viewingRequestsService.findAll(status, req.user);
  }

  // GET /api/v1/viewing-requests/:id (Authenticated)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.viewingRequestsService.findOne(id, req.user);
  }

  // PATCH /api/v1/viewing-requests/:id (Agent, Admin)
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @Patch(':id')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateViewingRequestDto,
    @Req() req: any,
  ) {
    return this.viewingRequestsService.updateStatus(id, dto, req.user);
  }

  // DELETE /api/v1/viewing-requests/:id (Customer, Admin)
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.viewingRequestsService.remove(id, req.user);
  }

  // GET /api/v1/viewing-requests/:id/logs (Agent, Admin)
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @Get(':id/logs')
  async getLogs(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.viewingRequestsService.getLogs(id, req.user);
  }
}
