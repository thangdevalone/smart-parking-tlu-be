import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Bill } from '../bill';

@Entity('histories')
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageIn: string;

  @Column()
  imageOut: string;

  @Column()
  timeIn: Date;

  @Column()
  timeOut: Date;

  @ManyToOne(() => Bill, bill => bill.histories)
  bill: Bill;

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
