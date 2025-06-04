// src/entities/service-request.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Service } from './service.entity';

export enum ServiceRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

@Entity()
export class ServiceRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentServiceRequests)
  commonUser: User;

  @ManyToOne(() => User, (user) => user.receivedServiceRequests)
  serviceProvider: User;

  @ManyToOne(() => Service)
  service: Service;

  @Column({ type: 'enum', enum: ServiceRequestStatus, default: ServiceRequestStatus.PENDING })
  status: ServiceRequestStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  requestDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduledDate: Date;

  @Column('text')
  description: string;
}