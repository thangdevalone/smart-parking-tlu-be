import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from 'typeorm';
import { Bill } from '../bill';

@Entity('histories')
export class History extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageIn: string;

  @Column({ nullable: true })
  imageOut?: string;

  @Column()
  timeIn: Date;

  @Column({ nullable: true })
  timeOut?: Date;

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
