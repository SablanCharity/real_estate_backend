import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ViewingRequest, RequestStatus } from '../entities/viewing-request.entity';
import { ViewingLog, LogStatus } from '../entities/viewing-log.entity';
import { Property } from '../entities/property.entity';
import { CreateViewingRequestDto } from './dto/create-viewing-request.dto';
import { UpdateViewingRequestDto } from './dto/update-viewing-request.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class ViewingRequestsService {
  constructor(
    @InjectRepository(ViewingRequest)
    private requestRepository: Repository<ViewingRequest>,
    @InjectRepository(ViewingLog)
    private logRepository: Repository<ViewingLog>,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  async create(dto: CreateViewingRequestDto, customer: User) {
    const property = await this.propertyRepository.findOne({
      where: { propertyId: dto.propertyId },
    });

    if (!property) {
      throw new NotFoundException(`Property #${dto.propertyId} does not exist.`);
    }

    const existing = await this.requestRepository.findOne({
      where: {
        customerId: customer.userId,
        propertyId: dto.propertyId,
        status: RequestStatus.PENDING,
      },
    });

    if (existing) {
      throw new ConflictException('You already have a pending viewing request for this property.');
    }

    const request = this.requestRepository.create({
      customerId: customer.userId,
      propertyId: dto.propertyId,
      scheduledDate: new Date(dto.scheduledDate),
      requestNotes: dto.requestNotes,
      status: RequestStatus.PENDING,
    });

    const savedRequest = await this.requestRepository.save(request);

    const log = this.logRepository.create({
      requestId: savedRequest.requestId,
      updatedBy: customer.userId,
      status: LogStatus.PENDING,
      remarks: 'Viewing request submitted.',
    });
    await this.logRepository.save(log);

    return savedRequest;
  }

  async findAll(status?: RequestStatus) {
    const query = this.requestRepository.createQueryBuilder('request')
      .leftJoinAndSelect('request.customer', 'customer')
      .leftJoinAndSelect('request.property', 'property');

    if (status) {
      query.andWhere('request.status = :status', { status });
    }

    return query.getMany();
  }

  async findOne(id: number) {
    const request = await this.requestRepository.findOne({
      where: { requestId: id },
      relations: { customer: true, property: true, logs: true },
    });

    if (!request) {
      throw new NotFoundException(`Viewing Request #${id} not found.`);
    }

    return request;
  }

  async updateStatus(id: number, dto: UpdateViewingRequestDto, user: User) {
    const request = await this.findOne(id);

    request.status = dto.status;
    const updatedRequest = await this.requestRepository.save(request);

    const log = this.logRepository.create({
      requestId: updatedRequest.requestId,
      updatedBy: user.userId,
      status: dto.status as unknown as LogStatus,
      remarks: dto.remarks || `Status updated to ${dto.status}`,
    });
    await this.logRepository.save(log);

    return updatedRequest;
  }

  async remove(id: number) {
    const request = await this.findOne(id);
    await this.requestRepository.remove(request);
    return { message: `Viewing request #${id} cancelled/removed.` };
  }

  async getLogs(id: number) {
    await this.findOne(id);
    return this.logRepository.find({
      where: { requestId: id },
      relations: { updatedByUser: true },
      order: { updatedAt: 'DESC' },
    });
  }
}