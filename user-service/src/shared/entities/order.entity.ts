import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './../../users/entities';
import { Product } from './product.entity';

@Entity('orders')
export class Order {
  constructor(id: number = null) {
    this.id = id;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  quantity?: number;

  @Column({ type: 'int', nullable: true })
  private userId: number;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ type: 'int', nullable: true })
  private productId: number;
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product?: Product;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  private setFKShell() {
    if (this.userId) {
      this.user = new User(this.userId);

      delete this.userId;
    }
    if (this.productId) {
      this.product = new Product(this.productId);

      delete this.productId;
    }
  }
}
