import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user";
import { CardType } from "../cardtype";
import { CardStatus } from "src/types";

@Entity("cards")
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  cardCode: string;

  @Column({ default: "" })
  licensePlate?: string;

  @Column({
    type: "enum",
    enum: CardStatus,
    default: CardStatus.ACTIVE
  })
  cardStatus: CardStatus;

  @ManyToOne(() => User, user => user.id)
  user?: User;

  @ManyToOne(() => CardType, cardType => cardType.id)
  cardType: CardType;

  @Column({ nullable: true })
  expiration?: string;

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
