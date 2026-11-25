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
import { ViewingRequest } from './viewing-request.entity';
import { PropertyImage } from './property-image.entity';

export enum PropertyStatus {
  AVAILABLE = 'Available',
  PENDING = 'Pending',
  SOLD = 'Sold',
}

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn({ name: 'PropertyID' })
  propertyId: number;

  @Column({ name: 'AgentID' })
  agentId: number;

  @Column({ name: 'Title', length: 150 })
  title: string;

  @Column({ name: 'Description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'Price', type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ name: 'Location', length: 255 })
  location: string;

  @Column({
    name: 'Status',
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.AVAILABLE,
  })
  status: PropertyStatus;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.properties, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'AgentID' })
  agent: User;

  @OneToMany(() => ViewingRequest, (request) => request.property)
  viewingRequests: ViewingRequest[];

  @OneToMany(() => PropertyImage, (image) => image.property)
  images: PropertyImage[];
}