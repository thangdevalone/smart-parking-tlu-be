import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Bill } from '../bill';

@Entity('histories')
export class History extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  imageIn: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageOut?: string;

  @Column()
  timeIn: Date;

  @Column({ nullable: true })
  timeOut?: Date;

  @ManyToOne(() => Bill, bill => bill.id)
  bill: Bill;

  @Column(
    {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP'
    }
  )
  createdAt: Date;

  @Column(
    {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP'
    }
  )
  updatedAt: Date;
}
