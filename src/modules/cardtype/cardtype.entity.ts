import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Card } from '../card';

@Entity('cardtypes')
export class CardType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cardTypeName: string;

  @Column()
  cardTypePrice: number;

  @OneToMany(() => Card, card => card.cardType)
  cards: Card[];
  
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
