import { BillStatus } from 'src/types';

export class CreateBillDto {
  startDate: Date;
  price: number;
}


export class UpdateBillDto {
  billStatus: BillStatus;
  price: number;
}