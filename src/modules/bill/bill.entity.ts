import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity } from 'typeorm';
import { Card } from '../card';
import { History } from '../history';
import { BillStatus } from 'src/types';

@Entity('bills')
export class Bill extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate?: Date;

  @Column()
  price: number;

  @Column({
    type: 'enum',
    enum: BillStatus,
    default: BillStatus.UNPAID,
  })
  @Column()
  billStatus: BillStatus;

  @ManyToOne(() => Card, card => card.id)
  card: Card;

  @Column(
    {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
  )
  createdAt: Date;

  @Column(
    {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
  )
  updatedAt: Date;

}
