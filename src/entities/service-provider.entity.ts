import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Service } from './service.entity';

@Entity()
export class ServiceProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.providerProfile)
  user: User;

  @ManyToMany(() => Service, { cascade: true })
  @JoinTable()
  services: Service[];

  @Column({ nullable: true })
  profilePictureUrl: string;
}
