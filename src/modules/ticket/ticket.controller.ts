import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { TicketService } from './ticket.service';

@Controller('ticket')
export class TicketController {
    @Post('checkin')
    public async checkin() { }

    @Post('checkout')
    public async checkout() { }
}