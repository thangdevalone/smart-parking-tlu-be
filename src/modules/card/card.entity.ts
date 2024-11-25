import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CardType } from "../cardtype";
import { CardStatus } from "src/types";
import { Bill } from "../bill";

@Entity("cards")
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 20, unique: true, default: null })
  idCard: string;

  @Column({ type: "varchar", length: 20, unique: true })
  cardCode: string;

  @Column({ type: "varchar", length: 15, default: "" })
  licensePlate?: string;

  @Column({
    type: "enum",
    enum: CardStatus,
    default: CardStatus.ACTIVE
  })
  cardStatus: CardStatus;

  @ManyToOne(() => CardType, cardType => cardType.id)
  cardType: CardType;

  @OneToMany(() => Bill, bill => bill.card)
  bills: Bill[];

  @Column(
    {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP"
    }
  )
  createdAt: Date;

  @Column(
    {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP"
    }
  )
  updatedAt: Date;
}
