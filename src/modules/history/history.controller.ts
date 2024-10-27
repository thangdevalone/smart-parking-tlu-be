import { UpdateHistoryDto } from './history.dto';
import { HistoryService } from './history.service';
import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { GuardOrAdminRequired } from '../user';
import { JwtAuthGuard } from 'src/auth/guards';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from 'src/types';
import { Pagination } from 'src/decorators';

@Controller('history')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(
    private readonly historyService: HistoryService
  ) {
  }

  @Get()
  @GuardOrAdminRequired()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortType', required: false, type: String })
  async getAll(
    @Pagination() pagination: PaginationDto
  ) {
    return await this.historyService.getHistories(pagination);
  }

  @Get(':id')
  @GuardOrAdminRequired()
  async getById(@Param('id') id: string) {
    return {
      data: await this.historyService.findOne({ id })
    };
  }

  @Patch(':id')
  @GuardOrAdminRequired()
  async update(@Param('id') id: string, @Body() updateHistoryDto: UpdateHistoryDto) {
    return await this.historyService.updateHistory(id, updateHistoryDto);
  }


}