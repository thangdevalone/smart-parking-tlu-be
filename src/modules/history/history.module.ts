import { forwardRef, Module } from '@nestjs/common'
import {HistoryController} from './history.controller'
import {HistoryService} from './history.service'
import { HistoryRepository } from './history.repository'
import { LoggerService } from 'src/logger'
import { History } from './history.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserHttpModule } from '../user'

@Module({
  imports: [TypeOrmModule.forFeature([History]), forwardRef(() => UserHttpModule)],
  providers: [HistoryService, HistoryRepository, LoggerService],
  exports: [HistoryService],
  controllers: [HistoryController],
})
export class HistoryModule {
}