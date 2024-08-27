import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';

@Module({
    imports: [],
    controllers: [TicketController],
    providers: [TicketService],
})
export class TicketModule { }