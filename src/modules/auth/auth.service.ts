import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { DataSource, EntityManager } from 'typeorm';
import { Service } from 'src/entities/service.entity';
import { ServiceProvider } from 'src/entities/service-provider.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  private async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async register(createUserDto: CreateUserDto): Promise<{ user: User; token: string }> {
    const hashedPassword = await this.hashPassword(createUserDto.password);


    const user = await this.dataSource.transaction(async manager => {
      try {
        const newUser = await this.usersService.createUser({
          ...createUserDto,
          password: hashedPassword,
        }, manager);

        if (createUserDto.userType === 'PROVIDER') {
          await this.createProviderProfile(newUser, createUserDto, manager);
        }

        return newUser;
      } catch (error) {
        throw new BadRequestException('Falha ao criar usuário');
      }
    });
    try {
      const token = this.generateToken(user);
      return { user, token };
    } catch (error) {
      throw new BadRequestException('Falha ao gerar token');
    }
  }

  async createProviderProfile(user: User, createUserDto: CreateUserDto, manager: EntityManager) {
    try {
      const services = createUserDto.serviceIds ?
        await manager.findByIds(Service, createUserDto.serviceIds) : [];

      const providerProfile = manager.create(ServiceProvider, {
        user,
        services,
        profilePictureUrl: createUserDto.profilePictureUrl,
      });

      await manager.save(providerProfile);
      user.providerProfile = providerProfile;
    } catch(error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Falha ao criar perfil do prestador de serviço');
    }
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.comparePasswords(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.usersService.getUser(userId);

    const isOldPasswordValid = await this.comparePasswords(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedNewPassword = await this.hashPassword(newPassword);
    await this.usersService.updateUser(userId, { password: hashedNewPassword });
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, email: user.email, userType: user.userType };
    return this.jwtService.sign(payload);
  }
}
