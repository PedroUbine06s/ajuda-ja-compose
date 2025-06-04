// src/modules/service-requests/service-requests.service.ts
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceRequest, ServiceRequestStatus } from '../../entities/service-request.entity';
import { Service } from '../../entities/service.entity';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UsersService } from '../users/users.service'; 

@Injectable()
export class ServiceRequestsService {
  constructor(
    @InjectRepository(ServiceRequest)
    private serviceRequestRepository: Repository<ServiceRequest>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    private readonly usersService: UsersService,
  ) {}

  async createServiceRequest(commonUserId: number, createServiceRequestDto: CreateServiceRequestDto): Promise<ServiceRequest> {
    const { serviceProviderId, serviceId, description, scheduledDate } = createServiceRequestDto;

    const commonUser = await this.usersService.getUser(commonUserId);
    if (!commonUser || commonUser.userType !== 'COMMON') {
      throw new UnauthorizedException('Only common users can create service requests.');
    }

    const serviceProviderUser = await this.usersService.getUserWithFullProfile(serviceProviderId);
    if (!serviceProviderUser || serviceProviderUser.userType !== 'PROVIDER' || !serviceProviderUser.providerProfile) {
      throw new NotFoundException('Service provider not found or is not a provider.');
    }

    const service = await this.serviceRepository.findOne({ where: { id: serviceId } });
    if (!service) {
      throw new NotFoundException('Service not found.');
    }

    const offersService = serviceProviderUser.providerProfile.services.some(s => s.id === service.id);
    if (!offersService) {
      throw new BadRequestException('Service provider does not offer this service.');
    }

    const serviceRequest = this.serviceRequestRepository.create({
      commonUser: commonUser,
      serviceProvider: serviceProviderUser,
      service: service,
      description,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
      status: ServiceRequestStatus.PENDING,
    });

    return this.serviceRequestRepository.save(serviceRequest);
  }

  async getServiceRequestsForCommonUser(userId: number): Promise<ServiceRequest[]> {
    return this.serviceRequestRepository.find({
      where: { commonUser: { id: userId } },
      relations: ['serviceProvider', 'service'],
    });
  }

  async getServiceRequestsForProvider(userId: number): Promise<ServiceRequest[]> {
    return this.serviceRequestRepository.find({
      where: { serviceProvider: { id: userId } },
      relations: ['commonUser', 'service'],
    });
  }

  async updateServiceRequestStatus(requestId: number, providerId: number, status: ServiceRequestStatus): Promise<ServiceRequest> {
    const serviceRequest = await this.serviceRequestRepository.findOne({
      where: { id: requestId },
      relations: ['serviceProvider'],
    });

    if (!serviceRequest) {
      throw new NotFoundException('Service request not found.');
    }

    if (serviceRequest.serviceProvider.id !== providerId) {
      throw new UnauthorizedException('You are not authorized to update this service request.');
    }

    serviceRequest.status = status;
    return this.serviceRequestRepository.save(serviceRequest);
  }
}