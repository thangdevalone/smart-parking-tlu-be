import { Module } from '@nestjs/common'
import {HistoryController} from './history.controller'
import {HistoryService} from './history.service'

@Module({
  imports: [],
  providers: [HistoryService],
  exports: [HistoryService],
  controllers: [HistoryController],
})
export class HistoryModule {
}