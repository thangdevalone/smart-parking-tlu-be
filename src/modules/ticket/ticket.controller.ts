import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UseGuards, UploadedFiles } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketCheckinDto } from './ticket.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';
import { GuardOrAdminRequired } from '../user';

@Controller('ticket')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TicketController {

    constructor(private readonly ticketService: TicketService) { }

    @Post('checkin')
    @UseInterceptors(
        FileFieldsInterceptor(
            [{ name: 'image', maxCount: 100, }],
            {
                limits: {
                    fileSize: 10 * 1024 * 1024,
                },
            },
        ),
    )
    @GuardOrAdminRequired()
    public async checkin(
        @Body() checkinDto: TicketCheckinDto,
        @UploadedFiles() file: { image: Express.Multer.File },
    ) {
        return await this.ticketService.checkin(checkinDto.cardId, file.image);
    }

    @Post('checkout')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                {
                    name: 'image',
                    maxCount: 100,
                },
            ],
            {
                limits: {
                    fileSize: 10 * 1024 * 1024,
                },
            },
        ),
    )
    @GuardOrAdminRequired()
    public async checkout() { }
}