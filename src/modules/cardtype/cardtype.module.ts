import { Module } from '@nestjs/common'
import { CardTypeController } from './cardtype.controller'
import { CardTypeService } from './cardtype.service'

@Module({
  providers: [CardTypeService],
  exports: [CardTypeService],
  controllers: [CardTypeController],
})
export class CardTypeModule {
}