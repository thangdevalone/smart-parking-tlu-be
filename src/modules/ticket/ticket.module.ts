import { forwardRef, Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { UserHttpModule } from '../user';
import { BillModule } from '../bill';
import { HistoryModule } from '../history';
import { CardModule } from '../card';

@Module({
  imports: [
    forwardRef(() => UserHttpModule),
    forwardRef(() => BillModule),
    forwardRef(() => HistoryModule),
    forwardRef(() => CardModule)
  ],
  controllers: [TicketController],
  providers: [TicketService]
})
export class TicketModule {
}