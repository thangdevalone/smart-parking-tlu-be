import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user';
import { Card } from '../card';

@Entity('bills')
export class Bill extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ type: 'decimal', scale: 2, precision: 10 })
  price: number;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @ManyToOne(() => Card, card => card.id)
  card: Card;
}
