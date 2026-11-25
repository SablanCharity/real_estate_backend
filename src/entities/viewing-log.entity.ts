import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ViewingRequest } from './viewing-request.entity';
import { User } from './user.entity';

export enum LogStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  COMPLETED = 'Completed',
}

@Entity('viewing_logs')
export class ViewingLog {
  @PrimaryGeneratedColumn({ name: 'LogID' })
  logId: number;

  @Column({ name: 'RequestID' })
  requestId: number;

  @Column({ name: 'UpdatedBy' })
  updatedBy: number;

  @Column({
    name: 'Status',
    type: 'enum',
    enum: LogStatus,
    default: LogStatus.PENDING,
  })
  status: LogStatus;

  @Column({ name: 'Remarks', type: 'text', nullable: true })
  remarks: string;

  @CreateDateColumn({ name: 'UpdatedAt' })
  updatedAt: Date;

  @ManyToOne(() => ViewingRequest, (request) => request.logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'RequestID' })
  viewingRequest: ViewingRequest;

  @ManyToOne(() => User, (user) => user.viewingLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UpdatedBy' })
  updatedByUser: User;
}