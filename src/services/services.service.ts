import {InjectRepository} from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import {Service} from 'src/entities/service.entity';
import {Repository} from 'typeorm';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
  ) {}

  async findAll() {
    return this.servicesRepository.find();
  }
}
