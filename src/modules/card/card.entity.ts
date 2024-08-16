import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user';
import { CardType } from '../cardtype';
import { Bill } from '../bill';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  cardCode: string;

  @Column()
  licensePlate: string;

  @Column()
  cardStatus: string;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @ManyToOne(() => CardType, cardType => cardType.cards)
  cardType: CardType;

  @OneToMany(() => Bill, bill => bill.card)
  bills: Bill[];

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
