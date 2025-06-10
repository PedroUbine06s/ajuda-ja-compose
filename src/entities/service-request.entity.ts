// src/entities/service-request.entity.ts
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import {User} from './user.entity';

@Entity()
export class ServiceRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentServiceRequests)
  commonUser: User;

  @ManyToOne(() => User, (user) => user.receivedServiceRequests)
  serviceProvider: User;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  requestDate: Date;
}
