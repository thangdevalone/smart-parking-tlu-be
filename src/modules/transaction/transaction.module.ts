import { forwardRef, Module } from "@nestjs/common";
import { Bill } from "../bill";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, UserHttpModule, UserRepository } from "../user";
import { Payment } from "./transaction.entity";
import { TransactionRepository } from "./transaction.repository";
import { Card } from "../card";
import { CardRepository } from "../card/card.repository";
import { BillRepository } from "../bill/bill.repository";
import { CardType } from "../cardtype";
import { CardTypeRepository } from "../cardtype/cardtype.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Bill, Payment, Card, User, CardType]), forwardRef(() => UserHttpModule)],
  providers: [TransactionService, TransactionRepository, CardRepository, BillRepository, UserRepository, CardTypeRepository],
  controllers: [TransactionController]
})
export class TransactionModule {
}