import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDTO {
  @IsNumber()
  @IsNotEmpty({ message: 'Amount is required and must be a number.' })
  amount: number;
}

export class CreatePaymentUserDTO {
  @IsString()
  @IsNotEmpty({ message: 'user is required and must be a string.' })
  user: string;

  @IsNumber()
  @IsNotEmpty({ message: 'price is required and must be a string.' })
  price: number;
}

export class CreatePaymentZLPDTO {
  @IsNumber()
  @IsNotEmpty({ message: 'Amount is required and must be a number.' })
  amount: number;
}

export class PaymentInfoQueryDto {
  @IsNotEmpty()
  @IsString()
  vnp_Amount: string;

  @IsNotEmpty()
  @IsString()
  vnp_BankCode: string;

  @IsNotEmpty()
  @IsString()
  vnp_BankTranNo: string;

  @IsNotEmpty()
  @IsString()
  vnp_CardType: string;

  @IsNotEmpty()
  @IsString()
  vnp_OrderInfo: string;

  @IsNotEmpty()
  @IsString()
  vnp_PayDate: string;

  @IsNotEmpty()
  @IsString()
  vnp_ResponseCode: string;

  @IsNotEmpty()
  @IsString()
  vnp_TmnCode: string;

  @IsNotEmpty()
  @IsString()
  vnp_TransactionNo: string;

  @IsNotEmpty()
  @IsString()
  vnp_TransactionStatus: string;

  @IsNotEmpty()
  @IsString()
  vnp_TxnRef: string;

  @IsNotEmpty()
  @IsString()
  vnp_SecureHash: string;
}


export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
