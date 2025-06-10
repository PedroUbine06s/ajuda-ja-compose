/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  ParseFloatPipe,
  Patch,
  Post,
  Query,
  Request,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import {UsersService} from './users.service';
import {User} from 'src/entities/user.entity';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {UpdateUserLocationDto} from './dto/update-user-location.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('nearby-providers')
  @UseGuards(JwtAuthGuard)
  async getNearbyProviders(
    @Query('lat', ParseFloatPipe) latitude: number,
    @Query('lng', ParseFloatPipe) longitude: number,
    @Query('radius', new ParseArrayPipe({optional: true})) radius?: number,
  ): Promise<User[]> {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      throw new BadRequestException('Latitude and longitude must be numbers.');
    }

    const searchRadius = radius && typeof radius === 'number' ? radius : 10000;

    return this.usersService.findNearbyProviders(
      latitude,
      longitude,
      searchRadius,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUser(@Param('id') id: string): Promise<User> {
    return this.usersService.getUser(+id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Get(':id/profile')
  @UseGuards(JwtAuthGuard)
  @SerializeOptions({groups: ['with-profile']})
  getUserProfile(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserWithProfile(+id);
  }

  @Patch('me/location')
  @UseGuards(JwtAuthGuard)
  async updateMyUserLocation(
    @Request() req,
    @Body() updateLocationDto: UpdateUserLocationDto,
  ): Promise<User> {
    const userId = req.user.userId;
    return this.usersService.updateUserLocation(
      userId,
      updateLocationDto.latitude,
      updateLocationDto.longitude,
    );
  }
}
