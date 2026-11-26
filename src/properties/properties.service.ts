import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property, PropertyStatus } from '../entities/property.entity';
import { PropertyImage } from '../entities/property-image.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { CreatePropertyImageDto } from './dto/create-property-image.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(PropertyImage)
    private imageRepository: Repository<PropertyImage>,
  ) {}

  async create(
    createPropertyDto: CreatePropertyDto,
    agent: User,
    file?: Express.Multer.File,
  ) {
    const { imageUrl: dtoImageUrl, caption, ...propertyData } = createPropertyDto;

    const property = this.propertyRepository.create({
      ...propertyData,
      agentId: agent.userId,
    });
    const savedProperty = await this.propertyRepository.save(property);

    const resolvedImageUrl = file
      ? `http://localhost:3000/uploads/properties/${file.filename}`
      : dtoImageUrl;

    if (resolvedImageUrl) {
      const image = this.imageRepository.create({
        propertyId: savedProperty.propertyId,
        imageUrl: resolvedImageUrl,
      });
      await this.imageRepository.save(image);
    }

    return this.findOne(savedProperty.propertyId);
  }

  async findAll(status?: PropertyStatus, location?: string) {
    const query = this.propertyRepository.createQueryBuilder('property')
      .leftJoinAndSelect('property.agent', 'agent')
      .leftJoinAndSelect('property.images', 'images');

    if (status) {
      query.andWhere('property.status = :status', { status });
    }

    if (location) {
      query.andWhere('property.location LIKE :location', { location: `%${location}%` });
    }

    return query.getMany();
  }

  async findOne(id: number) {
    const property = await this.propertyRepository.findOne({
      where: { propertyId: id },
      relations: { agent: true, images: true },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found.`);
    }

    return property;
  }

  async update(id: number, updatePropertyDto: UpdatePropertyDto) {
    const property = await this.findOne(id);
    Object.assign(property, updatePropertyDto);
    return this.propertyRepository.save(property);
  }

  async remove(id: number) {
    const property = await this.findOne(id);
    await this.propertyRepository.remove(property);
    return { message: `Property #${id} successfully deleted.` };
  }

  // Image operations
  async addImage(
    propertyId: number,
    dto: CreatePropertyImageDto,
    file?: Express.Multer.File,
  ) {
    const property = await this.findOne(propertyId);

    const resolvedImageUrl = file
      ? `http://localhost:3000/uploads/properties/${file.filename}`
      : dto.imageUrl;

    if (!resolvedImageUrl) {
      throw new BadRequestException(
        'Please upload an image file or provide a valid imageUrl.',
      );
    }

    const image = this.imageRepository.create({
      propertyId: property.propertyId,
      imageUrl: resolvedImageUrl,
    });
    return this.imageRepository.save(image);
  }

  async findImages(propertyId: number) {
    await this.findOne(propertyId);
    return this.imageRepository.find({ where: { propertyId } });
  }

  async removeImage(propertyId: number, imageId: number) {
    const image = await this.imageRepository.findOne({
      where: { imageId, propertyId },
    });

    if (!image) {
      throw new NotFoundException(`Image #${imageId} not found on Property #${propertyId}.`);
    }

    await this.imageRepository.remove(image);
    return { message: `Image #${imageId} removed.` };
  }
}