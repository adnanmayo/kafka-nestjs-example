import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './../../shared/entities';

@Entity('user')
export class User {
  constructor(id: number = null) {
    this.id = id;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email?: string;

  @Column({ select: false })
  password?: string;

  @Column({ nullable: true })
  first_name?: string;

  @Column({ nullable: true })
  last_name?: string;

  orders?: Order[];
}
