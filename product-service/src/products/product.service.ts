import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { safeAssign } from '../utils/helpers';
import { Product } from './entities';
import { ProducerService } from './../kafka/producer.service';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(
    
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly producerService: ProducerService,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    return await this.productRepository.findOne({ where: { id } });
  }

  private assignProductSafe(
    dto: CreateProductDto | UpdateProductDto,
    entity: Product,
  ): void {
    safeAssign(dto, entity, ['name', 'quantity', 'description']);
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const entity = new Product();
    return await this.upsert(createProductDto, entity);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const entity: Product = await this.findOne(id);
    if (!Boolean(entity?.id)) throw new NotFoundException();

    return await this.upsert(updateProductDto, entity);
  }

  private async upsert(
    dto: CreateProductDto | UpdateProductDto,
    entity: Product,
  ): Promise<Product> {
    this.assignProductSafe(dto, entity);
    const product = await this.productRepository.save(entity);
    await this.producerService.publish(
      `product.${entity.id ? 'updated' : 'created'}`,
      `${product.id}`,
    );
    return product;
  }

  async remove(id: number): Promise<void> {
    const entity: Product = await this.findOne(id);
    if (!Boolean(entity?.id)) throw new NotFoundException();

    await this.productRepository.remove(entity);
    await this.producerService.publish(`product.deleted`, `${id}`);
  }
}
