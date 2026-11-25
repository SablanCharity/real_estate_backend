import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Property } from './property.entity';

@Entity('property_images')
export class PropertyImage {
  @PrimaryGeneratedColumn({ name: 'ImageID' })
  imageId: number;

  @Column({ name: 'PropertyID' })
  propertyId: number;

  @Column({ name: 'ImageURL', length: 255 })
  imageUrl: string;

  @CreateDateColumn({ name: 'UploadedAt' })
  uploadedAt: Date;

  @ManyToOne(() => Property, (property) => property.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'PropertyID' })
  property: Property;
}