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
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { CreatePropertyImageDto } from './dto/create-property-image.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PropertyStatus } from '../entities/property.entity';
import { UserRole } from '../entities/user.entity';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  // GET /api/v1/properties (Public)
  @Get()
  async findAll(
    @Query('status') status?: PropertyStatus,
    @Query('location') location?: string,
  ) {
    return this.propertiesService.findAll(status, location);
  }

  // GET /api/v1/properties/:id (Public)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.propertiesService.findOne(id);
  }

  // POST /api/v1/properties (Agent, Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @Post()
  async create(@Body() createPropertyDto: CreatePropertyDto, @Req() req: any) {
    return this.propertiesService.create(createPropertyDto, req.user);
  }

  // PATCH /api/v1/properties/:id (Agent, Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  // DELETE /api/v1/properties/:id (Agent, Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.propertiesService.remove(id);
  }

  // GET /api/v1/properties/:id/images (Public)
  @Get(':id/images')
  async findImages(@Param('id', ParseIntPipe) id: number) {
    return this.propertiesService.findImages(id);
  }

  // POST /api/v1/properties/:id/images (Agent, Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @Post(':id/images')
  async addImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreatePropertyImageDto,
  ) {
    return this.propertiesService.addImage(id, dto);
  }

  // DELETE /api/v1/properties/:id/images/:imageId (Agent, Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/images/:imageId')
  async removeImage(
    @Param('id', ParseIntPipe) id: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.propertiesService.removeImage(id, imageId);
  }
}