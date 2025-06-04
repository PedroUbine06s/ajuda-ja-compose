import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRequest } from '../../entities/service-request.entity';
import { ServiceRequestsService } from './service-requests.service';
import { ServiceRequestsController } from './service-requests.controller';
import { User } from 'src/entities/user.entity';
import { Service } from 'src/entities/service.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceRequest, User, Service]),
    UsersModule, 
  ],
  providers: [ServiceRequestsService],
  controllers: [ServiceRequestsController],
})
export class ServiceRequestsModule {}