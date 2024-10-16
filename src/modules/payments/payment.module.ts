import { forwardRef, Module } from "@nestjs/common";
import { Bill } from "../bill";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, UserHttpModule, UserRepository } from "../user";
import { Payment } from "./payment.entity";
import { PaymentRepository } from "./payment.repository";
import { Card } from "../card";
import { CardyRepository } from "../card/card.repository";
import { BillRepository } from "../bill/bill.repository";
import { CardType } from "../cardtype";
import { CardTypeRepository } from "../cardtype/cardtype.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Bill, Payment, Card, User, CardType]), forwardRef(() => UserHttpModule)],
  providers: [PaymentService, PaymentRepository, CardyRepository, BillRepository, UserRepository, CardTypeRepository],
  controllers: [PaymentController]
})
export class PaymentModule {
}