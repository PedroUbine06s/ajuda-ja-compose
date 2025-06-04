// src/modules/service-requests/service-requests.controller.ts
import { Controller, Post, Body, Request, UseGuards, Get, Param, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { ServiceRequestsService } from './service-requests.service';
import { ServiceRequest, ServiceRequestStatus } from '../../entities/service-request.entity';

@Controller('service-requests')
export class ServiceRequestsController {
  constructor(private readonly serviceRequestsService: ServiceRequestsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createRequest(@Request() req, @Body() createServiceRequestDto: CreateServiceRequestDto): Promise<ServiceRequest> {
    return this.serviceRequestsService.createServiceRequest(req.user.id, createServiceRequestDto);
  }

  @Get('my-sent-requests')
  @UseGuards(JwtAuthGuard)
  async getMySentRequests(@Request() req): Promise<ServiceRequest[]> {
    return this.serviceRequestsService.getServiceRequestsForCommonUser(req.user.id);
  }

  @Get('my-received-requests')
  @UseGuards(JwtAuthGuard)
  async getMyReceivedRequests(@Request() req): Promise<ServiceRequest[]> {
    return this.serviceRequestsService.getServiceRequestsForProvider(req.user.id);
  }

  @Patch(':id/status/:status')
  @UseGuards(JwtAuthGuard)
  async updateRequestStatus(
    @Param('id') requestId: string,
    @Param('status') status: ServiceRequestStatus,
    @Request() req
  ): Promise<ServiceRequest> {
    return this.serviceRequestsService.updateServiceRequestStatus(+requestId, req.user.id, status);
  }
}