import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Service } from 'src/entities/service.entity';
import { ServiceProvider } from 'src/entities/service-provider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Service, ServiceProvider])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
