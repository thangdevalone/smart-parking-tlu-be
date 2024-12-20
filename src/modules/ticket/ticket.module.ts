import { forwardRef, Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { UserHttpModule } from '../user';
import { BillModule } from '../bill';
import { HistoryModule } from '../history';
import { Card, CardModule } from "../card";
import { CardTypeModule } from '../cardtype';
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    forwardRef(() => UserHttpModule),
    forwardRef(() => CardTypeModule),
    forwardRef(() => BillModule),
    forwardRef(() => HistoryModule),
    forwardRef(() => CardModule)
  ],
  controllers: [TicketController],
  providers: [TicketService]
})
export class TicketModule {
}