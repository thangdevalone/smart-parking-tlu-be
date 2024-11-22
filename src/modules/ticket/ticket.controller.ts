import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards";
import { GuardOrAdminRequired } from "../user";
import { TicketDto } from "./ticket.dto";

@Controller("ticket")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {
  }

  @Post("checkin")
  @GuardOrAdminRequired()
  public async checkin(@Body() checkinDto: TicketDto) {
    return await this.ticketService.checkin(checkinDto.cardId, checkinDto.imageUrl);
  }

  @Post("checkin")
  @GuardOrAdminRequired()
  public async checkout(@Body() checkinDto: TicketDto) {
    return await this.ticketService.checkout(checkinDto.cardId, checkinDto.imageUrl);
  }
}
