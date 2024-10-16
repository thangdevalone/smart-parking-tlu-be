import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user";
import { PaymentStatus } from "./payment.dto";

@Entity("payments")
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @Column({ default: 0 })
  amount: number; // Số tiền thanh toán

  @Column()
  bankCode: string; // Mã ngân hàng

  @Column({ nullable: true })
  bankTranNo: string; // Số giao dịch ngân hàng

  @Column()
  orderInfo: string; // Thông tin đơn hàng

  @Column({ nullable: true })
  cardType: string; // Loại thẻ thanh toán (ATM, VISA, ...)

  @Column()
  payDate: string; // Ngày thanh toán (định dạng string)

  @Column()
  txnRef: string; // Mã giao dịch

  @Column({ nullable: true })
  transactionNo: string; // Số giao dịch thanh toán

  @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

}
