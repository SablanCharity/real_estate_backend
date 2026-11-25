import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Property } from './property.entity';
import { ViewingLog } from './viewing-log.entity';

export enum RequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  COMPLETED = 'Completed',
}

@Entity('viewing_requests')
export class ViewingRequest {
  @PrimaryGeneratedColumn({ name: 'RequestID' })
  requestId: number;

  @Column({ name: 'CustomerID' })
  customerId: number;

  @Column({ name: 'PropertyID' })
  propertyId: number;

  @Column({ name: 'ScheduledDate', type: 'datetime' })
  scheduledDate: Date;

  @Column({
    name: 'Status',
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @Column({ name: 'RequestNotes', type: 'text', nullable: true })
  requestNotes: string;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.viewingRequests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'CustomerID' })
  customer: User;

  @ManyToOne(() => Property, (property) => property.viewingRequests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'PropertyID' })
  property: Property;

  @OneToMany(() => ViewingLog, (log) => log.viewingRequest)
  logs: ViewingLog[];
}