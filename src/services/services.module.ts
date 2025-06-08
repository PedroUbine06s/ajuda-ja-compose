import {Module} from '@nestjs/common';
import {ServicesService} from './services.service';
import {ServicesController} from './services.controller';
import {User} from 'src/entities/user.entity';
import {Service} from 'src/entities/service.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ServiceProvider} from 'src/entities/service-provider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Service, ServiceProvider])],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
