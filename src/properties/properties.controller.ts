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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname } from 'path';
import * as fs from 'fs';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { CreatePropertyImageDto } from './dto/create-property-image.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PropertyStatus } from '../entities/property.entity';
import { UserRole } from '../entities/user.entity';

const propertyImageUploadOptions: MulterOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = './uploads/properties';
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `property-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      return cb(
        new BadRequestException('Only JPG, JPEG, PNG, and WEBP images are allowed.'),
        false,
      );
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
};

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

  // POST /api/v1/properties (Agent, Admin - supports form-data local image or raw JSON)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image', propertyImageUploadOptions))
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @Req() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.propertiesService.create(createPropertyDto, req.user, file);
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

  // POST /api/v1/properties/:id/images (Agent, Admin - supports form-data local image or raw JSON)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @Post(':id/images')
  @UseInterceptors(FileInterceptor('image', propertyImageUploadOptions))
  async addImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreatePropertyImageDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.propertiesService.addImage(id, dto, file);
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
