import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity } from 'typeorm';
import { User } from '../user';
import { CardType } from '../cardtype';
import { Bill } from '../bill';
import { CardStatus } from 'src/types';

@Entity('cards')
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  cardCode: string;

  @Column()
  licensePlate?: string;

  @Column({
    type: 'enum',
    enum: CardStatus,
    default: CardStatus.ACTIVE,
  })
  cardStatus: CardStatus;

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
