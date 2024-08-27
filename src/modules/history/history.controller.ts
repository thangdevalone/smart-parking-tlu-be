import { CreateHistoryDto, UpdateHistoryDto } from "./history.dto";
import { HistoryService } from "./history.service";
import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";

@Controller('history')
export class HistoryController {
    constructor(
        private readonly historyService: HistoryService,
    ) {
    }

    @Get()
    async getAll() {
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateHistoryDto: UpdateHistoryDto) {
    }


}