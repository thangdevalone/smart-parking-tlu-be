import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards";
import { CardTypeService } from "./cardtype.service";
import { AdminRequired } from "../user";
import { CreateCradTypeDto, UpdateCardTypeDto } from "./cardtype.dto";
import { Pagination } from "src/decorators";
import { PaginationDto } from "src/types";

@Controller('card-type')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CardTypeController {
    constructor(private readonly cardTypeService: CardTypeService) { }

    @Post()
    @AdminRequired()
    public async createCardType(
        @Body() createCardTypeDto: CreateCradTypeDto
    ) {
        return await this.cardTypeService.createCardType(createCardTypeDto);
    }

    @Get()
    @AdminRequired()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'sortBy', required: false, type: String })
    @ApiQuery({ name: 'sortType', required: false, type: String })
    public async getCardTypes(
        @Pagination() pagination: PaginationDto,
    ) {
        return await this.cardTypeService.getCardTypes(pagination);
    }

    @Delete(':idCardType')
    @AdminRequired()
    public async deleteCardType(
        @Param('idCardType') idCardType: string
    ) {
        return await this.cardTypeService.deleteCardType(idCardType);
    }

    @Patch(':idCardType')
    @AdminRequired()
    public async updateCardType(
        @Param('idCardType') idCardType: string,
        @Body() updateCardTypeDto: UpdateCardTypeDto
    ) {
        return await this.cardTypeService.updateCardType(idCardType, updateCardTypeDto);
    }
}