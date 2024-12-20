import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user';
import { PaymentStatus } from './transaction.dto';

@Entity('transaction')
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amount: number; // Số tiền thanh toán

  @Column({ type: 'varchar', length: 50 })
  bankCode: string; // Mã ngân hàng

  @Column({ type: 'varchar', length: 50, nullable: true })
  bankTranNo: string; // Số giao dịch ngân hàng

  @Column({ type: 'varchar', length: 255 })
  orderInfo: string; // Thông tin đơn hàng

  @Column({ type: 'varchar', length: 50, nullable: true })
  cardType: string; // Loại thẻ thanh toán (ATM, VISA, ...)

  @Column()
  payDate: string; // Ngày thanh toán (định dạng string)

  @Column({ type: 'varchar', length: 50 })
  txnRef: string; // Mã giao dịch

  @Column({ type: 'varchar', length: 50, nullable: true })
  transactionNo: string; // Số giao dịch thanh toán

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

}
