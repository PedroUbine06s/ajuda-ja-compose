/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// src/modules/service-requests/service-requests.controller.ts
import {Controller, Post, Body, Request, UseGuards, Get} from '@nestjs/common';
import {JwtAuthGuard} from '../../modules/auth/guards/jwt-auth.guard';
import {CreateServiceRequestDto} from './dto/create-service-request.dto';
import {ServiceRequestsService} from './service-requests.service';
import {ServiceRequest} from '../../entities/service-request.entity';

@Controller('service-requests')
export class ServiceRequestsController {
  constructor(
    private readonly serviceRequestsService: ServiceRequestsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createRequest(
    @Request() req,
    @Body() createServiceRequestDto: CreateServiceRequestDto,
  ): Promise<ServiceRequest> {
    return this.serviceRequestsService.createServiceRequest(
      req.user.userId,
      createServiceRequestDto,
    );
  }

  @Get('my-sent-requests')
  @UseGuards(JwtAuthGuard)
  async getMySentRequests(@Request() req): Promise<ServiceRequest[]> {
    return this.serviceRequestsService.getServiceRequestsForCommonUser(
      req.user.id,
    );
  }

  @Get('my-received-requests')
  @UseGuards(JwtAuthGuard)
  async getMyReceivedRequests(@Request() req): Promise<ServiceRequest[]> {
    return this.serviceRequestsService.getServiceRequestsForProvider(
      req.user.id,
    );
  }
}
