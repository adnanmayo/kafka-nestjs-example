import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { safeAssign } from '../utils/helpers';
import { Order } from './entities';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { ProducerService } from './../kafka/producer.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly producerService: ProducerService,
  ) { }

  private async createQueryBuilder(): Promise<SelectQueryBuilder<Order>> {
    const orderAlias = 'orders';
    const userAlias = 'user';
    const productAlias = 'product';
    return await this.orderRepository
      .createQueryBuilder(orderAlias)
      .leftJoinAndSelect(
        `${orderAlias}.${userAlias}`,
        userAlias,
        `${orderAlias}.userId = ${userAlias}.id`,
      )
      .leftJoinAndSelect(
        `${orderAlias}.${productAlias}`,
        productAlias,
        `${orderAlias}.productId = ${productAlias}.id`,
      );
  }

  async findAll(): Promise<Order[]> {
    const qb = await this.createQueryBuilder();
    return qb.getMany();
  }

  async findOne(id: number): Promise<Order> {
    const qb = await this.createQueryBuilder();
    qb.where({ id });
    return qb.getOne();
  }

  private assignOrderSafe(
    dto: CreateOrderDto | UpdateOrderDto,
    entity: Order,
  ): void {
    safeAssign(dto, entity, ['userId', 'quantity', 'productId']);
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const entity = new Order();
    return await this.upsert(createOrderDto, entity);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const entity: Order = await this.findOne(id);
    if (!Boolean(entity?.id)) throw new NotFoundException();

    return await this.upsert(updateOrderDto, entity);
  }

  private async upsert(
    dto: CreateOrderDto | UpdateOrderDto,
    entity: Order,
  ): Promise<Order> {
    this.assignOrderSafe(dto, entity);
    const order = await this.orderRepository.save(entity);
    await this.producerService.publish(
      `order.${entity.id ? 'updated' : 'created'}`,
      `${order.id}`,
    );
    return order;
  }

  async remove(id: number): Promise<void> {
    const entity: Order = await this.findOne(id);
    if (!Boolean(entity?.id)) throw new NotFoundException();

    await this.orderRepository.remove(entity);
    await this.producerService.publish(`order.deleted`, `${id}`);
  }
}
