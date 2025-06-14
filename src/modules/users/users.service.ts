import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {EntityManager, Point, Repository} from 'typeorm';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {User} from 'src/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    manager?: EntityManager,
  ): Promise<User> {
    const repository = manager
      ? manager.getRepository(User)
      : this.usersRepository;
    const user = repository.create({
      ...createUserDto,
      dateOfBirth: new Date(createUserDto.dateOfBirth),
    });
    return repository.save(user);
  }

  async getUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({where: {id}});
    if (!user) throw new NotFoundException(`Usuário não encontrado`);
    return user;
  }

  async getUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async updateUser(id: number, updateDto: UpdateUserDto): Promise<User> {
    const user = await this.getUser(id);
    const updateData = {...updateDto};
    await this.usersRepository.update(id, updateData);
    return this.getUser(id);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({where: {email}});
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.getUser(id);
    await this.usersRepository.remove(user);
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({where: {email}});
    return !!user;
  }

  async getUserWithProfile(userId: number): Promise<User> {
    const userProfile = await this.usersRepository.findOne({
      where: {id: userId},
      relations: ['providerProfile'],
    });
    if (!userProfile) throw new NotFoundException(`Usuário não encontrado`);
    return userProfile;
  }

  async getUserWithFullProfile(userId: number): Promise<User> {
    const userWithFullProfile = await this.usersRepository.findOne({
      where: {id: userId},
      relations: ['providerProfile', 'providerProfile.services'],
    });
    if (!userWithFullProfile)
      throw new NotFoundException(`Usuário não encontrado`);
    return userWithFullProfile;
  }

  async findNearbyProviders(
    latitude: number,
    longitude: number,
    radiusInMeters: number,
  ): Promise<User[]> {
    const userLocation: Point = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    try {
      return this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.providerProfile', 'providerProfile')
        .leftJoinAndSelect('providerProfile.services', 'services')
        .where('user.userType = :userType', {userType: 'PROVIDER'})
        .andWhere('user.location IS NOT NULL')
        .andWhere(
          'ST_DWithin(user.location, ST_SetSRID(ST_GeomFromGeoJSON(:userLocation), 4326), :radius)',
          {userLocation: JSON.stringify(userLocation), radius: radiusInMeters},
        )
        .orderBy(
          'ST_Distance(user.location, ST_SetSRID(ST_GeomFromGeoJSON(:userLocation), 4326))',
          'ASC',
        )
        .setParameters({
          userLocation: JSON.stringify(userLocation),
          radius: radiusInMeters,
        })
        .getMany();
    } catch (error) {
      console.error('Error finding nearby providers:', error);
      throw new NotFoundException(
        'Erro ao buscar prestadores de serviços próximos',
      );
    }
  }

  async updateUserLocation(
    userId: number,
    latitude: number,
    longitude: number,
  ): Promise<User> {
    const user = await this.getUser(userId);

    const locationPoint: Point = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    user.location = locationPoint;
    return this.usersRepository.save(user);
  }
}
