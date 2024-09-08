import { Controller,  Post, Body, UseInterceptors, UseGuards, UploadedFiles, Res } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketCheckinDto } from './ticket.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';
import { GuardOrAdminRequired } from '../user';
import { Response } from 'express';
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
        return await this.ticketService.checkin(checkinDto.cardId, file.image[0]);
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
    public async checkout(
        @Body() checkinDto: TicketCheckinDto,
        @UploadedFiles() file: { image: Express.Multer.File },
        @Res() res: Express.Response,
    ) {
        return await this.ticketService.checkout(checkinDto.cardId, file.image[0], res as Response);
    }
}