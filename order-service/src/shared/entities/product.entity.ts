import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './../../order/entities';

@Entity('products')
export class Product {
  constructor(id: number = null) {
    this.id = id;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name?: string;

  @Column({ nullable: true })
  quantity?: number;

  @Column({ nullable: true })
  description?: string;

  orders?: Order[];
}
