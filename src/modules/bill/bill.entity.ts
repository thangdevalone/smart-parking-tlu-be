import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BillStatus } from "src/types";
import { User } from "../user";

@Entity("bills")
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
    type: "enum",
    enum: BillStatus,
    default: BillStatus.UNPAID
  })
  @Column()
  billStatus: BillStatus;

  @ManyToOne(() => User, user => user.id)
  user: User;

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
