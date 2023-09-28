import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hashPassword, safeAssign } from '../utils/helpers';
import { User } from './entities';
import { ProducerService } from './../kafka/producer.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly producerService: ProducerService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findOneByColumn(name: string, value: any): Promise<User> {
    return await this.userRepository.findOne({ where: { [name]: value } });
  }

  private assignUserSafe(
    dto: CreateUserDto | UpdateUserDto,
    entity: User,
  ): void {
    safeAssign(dto, entity, ['email', 'first_name', 'last_name', 'password']);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (Boolean((await this.findOneByColumn('email', createUserDto.email))?.id))
      throw new ConflictException({ email: 'ALREADY_EXISTS' });

    const entity = new User();
    return await this.upsert(createUserDto, entity);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const entity: User = await this.findOne(id);
    if (!Boolean(entity?.id)) throw new NotFoundException();

    return await this.upsert(updateUserDto, entity);
  }

  private async upsert(
    dto: CreateUserDto | UpdateUserDto,
    entity: User,
  ): Promise<User> {
    if (dto.password) dto.password = hashPassword(dto.password);
    else delete dto.password;

    this.assignUserSafe(dto, entity);
    const user = await this.userRepository.save(entity);
    await this.producerService.publish(
      `user.${entity.id ? 'updated' : 'created'}`,
      `${user.id}`,
    );
    return user;
  }

  async remove(id: number): Promise<void> {
    const entity: User = await this.findOne(id);
    if (!Boolean(entity?.id)) throw new NotFoundException();

    await this.userRepository.remove(entity);
    await this.producerService.publish(`user.deleted`, `${id}`);
  }
}
