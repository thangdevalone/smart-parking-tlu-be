import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Card } from '../card';

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

  @ManyToOne(() => Card, card => card.id)
  card: Card;

  @Column({ type: 'decimal', scale: 2, precision: 10 })
  price: number;
}
