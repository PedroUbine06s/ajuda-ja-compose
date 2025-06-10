import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ServiceRequest} from '../../entities/service-request.entity';
import {CreateServiceRequestDto} from './dto/create-service-request.dto';
import {UsersService} from '../users/users.service';

@Injectable()
export class ServiceRequestsService {
  constructor(
    @InjectRepository(ServiceRequest)
    private serviceRequestRepository: Repository<ServiceRequest>,
    private readonly usersService: UsersService,
  ) {}

  async createServiceRequest(
    commonUserId: number,
    createServiceRequestDto: CreateServiceRequestDto,
  ): Promise<ServiceRequest> {
    const {serviceProviderId} = createServiceRequestDto;

    const commonUser = await this.usersService.getUser(commonUserId);
    if (!commonUser || commonUser.userType !== 'COMMON') {
      throw new UnauthorizedException(
        'Apenas usuários comuns podem criar solicitações de serviço.',
      );
    }

    const serviceProviderUser =
      await this.usersService.getUserWithFullProfile(serviceProviderId);
    if (
      !serviceProviderUser ||
      serviceProviderUser.userType !== 'PROVIDER' ||
      !serviceProviderUser.providerProfile
    ) {
      throw new NotFoundException(
        'Provedor de serviços não encontrado ou não possui perfil de provedor.',
      );
    }

    const serviceRequest = this.serviceRequestRepository.create({
      commonUser: commonUser,
      serviceProvider: serviceProviderUser,
    });

    return this.serviceRequestRepository.save(serviceRequest);
  }

  async getServiceRequestsForCommonUser(
    userId: number,
  ): Promise<ServiceRequest[]> {
    return this.serviceRequestRepository.find({
      where: {commonUser: {id: userId}},
      relations: ['serviceProvider'],
    });
  }

  async getServiceRequestsForProvider(
    userId: number,
  ): Promise<ServiceRequest[]> {
    const allRequests = await this.serviceRequestRepository.find({
      where: {serviceProvider: {id: userId}},
      relations: ['commonUser'],
      order: {
        requestDate: 'DESC',
      },
    });

    const latestRequestsMap = new Map<number, ServiceRequest>();

    for (const request of allRequests) {
      const commonUserId = request.commonUser.id;
      if (!latestRequestsMap.has(commonUserId)) {
        latestRequestsMap.set(commonUserId, request);
      }
    }

    const latestRequestsArray = Array.from(latestRequestsMap.values());

    latestRequestsArray.sort(
      (a, b) => b.requestDate.getTime() - a.requestDate.getTime(),
    );

    return latestRequestsArray;
  }
}
