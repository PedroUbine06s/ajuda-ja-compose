import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, Point } from 'typeorm';
import { ServiceProvider } from './service-provider.entity';
import { Exclude, Expose } from 'class-transformer';
import { ServiceRequest } from './service-request.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: ['COMMON', 'PROVIDER'] })
  userType: 'COMMON' | 'PROVIDER';


  @Column({
    type: 'geography', 
    spatialFeatureType: 'Point', 
    srid: 4326, 
    nullable: true 
  })
  location: Point; 

  @OneToOne(() => ServiceProvider, (sp) => sp.user, { nullable: true, cascade: true })
  @JoinColumn()
  @Exclude()
  providerProfile?: ServiceProvider;

  @Expose({ groups: ['with-profile'] })
  get profile() {
    return this.providerProfile;
  }

  @OneToMany(() => ServiceRequest, (serviceRequest) => serviceRequest.commonUser)
  sentServiceRequests: ServiceRequest[];

  @OneToMany(() => ServiceRequest, (serviceRequest) => serviceRequest.serviceProvider)
  receivedServiceRequests: ServiceRequest[];
}
