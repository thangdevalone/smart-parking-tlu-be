import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CardService } from "./card.service";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { AdminRequired } from "../user";
import { Pagination } from "src/decorators";
import { DeleteMultipleDto, PaginationDto } from "src/types";
import { JwtAuthGuard } from "src/auth/guards";
import { CreateCardDto, UpdateCardDto } from "./card.dto";

@Controller("cards")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CardController {
  constructor(protected readonly card: CardService) {
  }

  @Get()
  @AdminRequired()
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "sortBy", required: false, type: String })
  @ApiQuery({ name: "sortType", required: false, type: String })
  public async getCard(
    @Pagination() pagination: PaginationDto
  ) {
    return await this.card.getCards(pagination);
  }

  @Get(":idCard")
  @AdminRequired()
  public async getCardDetail(
    @Param("idCard") idCard: string
  ) {
    return await this.card.getCardDetail(idCard);
  }

  @Post()
  @AdminRequired()
  public async createCard(
    @Body() createCardDto: CreateCardDto
  ) {
    return await this.card.createCard(createCardDto);
  }

  @Patch(":idCard")
  @AdminRequired()
  public async updateCard(
    @Param("idCard") idCard: string,
    @Body() updateCard: UpdateCardDto
  ) {
    return await this.card.updateCard(idCard, updateCard);
  }

  @Delete()
  @AdminRequired()
  public async deleteCard(
    @Body() deleteCard: DeleteMultipleDto
  ) {
    return await this.card.deleteCard(deleteCard.ids);
  }
}