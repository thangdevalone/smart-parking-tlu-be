import { Body, Controller, ParseFilePipeBuilder, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
  constructor(private readonly ticketService: TicketService) {}

  @Post('checkin')
  @GuardOrAdminRequired()
  public async checkin(@Body() checkinDto: TicketCheckinDto) {
    return await this.ticketService.checkin(checkinDto.cardId, checkinDto.imageUrl);
  }

  @Post('checkin')
  @GuardOrAdminRequired()
  public async checkout(@Body() checkinDto: TicketCheckinDto) {
    return await this.ticketService.checkout(checkinDto.cardId, checkinDto.imageUrl);
  }
}
