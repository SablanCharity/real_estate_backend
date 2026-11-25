import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Property } from './property.entity';
import { ViewingRequest } from './viewing-request.entity';
import { ViewingLog } from './viewing-log.entity';

export enum UserRole {
  ADMIN = 'Admin',
  AGENT = 'Agent',
  CUSTOMER = 'Customer',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'UserID' })
  userId: number;

  @Column({ name: 'FullName', length: 100 })
  fullName: string;

  @Column({ name: 'Email', length: 150, unique: true })
  email: string;

  @Column({ name: 'PasswordHash', length: 255 })
  passwordHash: string;

  @Column({
    name: 'Role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({ name: 'Phone', length: 20, nullable: true })
  phone: string;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;

  @OneToMany(() => Property, (property) => property.agent)
  properties: Property[];

  @OneToMany(() => ViewingRequest, (request) => request.customer)
  viewingRequests: ViewingRequest[];

  @OneToMany(() => ViewingLog, (log) => log.updatedByUser)
  viewingLogs: ViewingLog[];
}