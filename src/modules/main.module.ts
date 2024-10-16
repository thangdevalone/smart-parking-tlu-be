import { Module } from '@nestjs/common';
import { UserHttpModule, UserModule } from './user';
import { RoleModule } from './role';
import { HistoryModule } from './history';
import { BillModule } from './bill';
import { CardModule } from './card';
import { CardTypeModule } from './cardtype';
import { MailModule } from './mail';
import { TicketModule } from './ticket';
import { PaymentModule } from "./payments";

@Module({
  imports: [
    UserHttpModule,
    UserModule,
    RoleModule,
    HistoryModule,
    BillModule,
    CardModule,
    CardTypeModule,
    MailModule,
    TicketModule,
    PaymentModule
  ],
})
export class MainModule { }