import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewingRequestsService } from './viewing-requests.service';
import { ViewingRequestsController } from './viewing-requests.controller';
import { ViewingRequest } from '../entities/viewing-request.entity';
import { ViewingLog } from '../entities/viewing-log.entity';
import { Property } from '../entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ViewingRequest, ViewingLog, Property])],
  controllers: [ViewingRequestsController],
  providers: [ViewingRequestsService],
  exports: [ViewingRequestsService],
})
export class ViewingRequestsModule {}