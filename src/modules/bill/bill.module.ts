
import { forwardRef, Module } from '@nestjs/common'
import {BillController} from './bill.controller'
import {BillService} from './bill.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Bill } from './bill.entity'
import { UserHttpModule } from '../user'
import { LoggerService } from 'src/logger'
import { BillRepository } from './bill.repository'

@Module({
  imports: [TypeOrmModule.forFeature([Bill]), forwardRef(() => UserHttpModule)],
  providers: [BillService, LoggerService, BillRepository],
  exports: [BillService],
  controllers: [BillController],
})
export class BillModule {
}