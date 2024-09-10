import { Controller, Post, Body, UseInterceptors, UseGuards, UploadedFile, ParseFilePipeBuilder } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketCheckinDto } from './ticket.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';
import { GuardOrAdminRequired } from '../user';
@Controller('ticket')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TicketController {

    constructor(private readonly ticketService: TicketService) { }

    @Post('checkin')
    @UseInterceptors(FileInterceptor('image'))
    @GuardOrAdminRequired()
    public async checkin(
        @Body() checkinDto: TicketCheckinDto,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addMaxSizeValidator({
                    maxSize: 5 * 1024 * 1024,
                })
                .addFileTypeValidator({
                    fileType: /(jpg|jpeg|png)$/,
                })
                .build(),
        ) image: Express.Multer.File,
    ) {
        return await this.ticketService.checkin(checkinDto.cardId, image);
    }

    @Post('checkout')
    @UseInterceptors(FileInterceptor('image'))
    @GuardOrAdminRequired()
    public async checkout(
        @Body() checkinDto: TicketCheckinDto,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addMaxSizeValidator({
                    maxSize: 5 * 1024 * 1024,
                })
                .addFileTypeValidator({
                    fileType: /(jpg|jpeg|png)$/,
                })
                .build(),
        ) image: Express.Multer.File,
    ) {
        return await this.ticketService.checkout(checkinDto.cardId, image);
    }
}