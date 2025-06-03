import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { ServiceProvider } from './service-provider.entity';
import { Exclude, Expose } from 'class-transformer';

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

  @OneToOne(() => ServiceProvider, (sp) => sp.user, { nullable: true, cascade: true })
  @JoinColumn()
  @Exclude()
  providerProfile?: ServiceProvider;

  @Expose({ groups: ['with-profile'] })
  get profile() {
    return this.providerProfile;
  }
}
