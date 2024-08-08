import { Module } from '@nestjs/common'
import { CardTypeController } from './cardtype.controller'
import { CardTypeService } from './cardtype.service'

@Module({
  imports: [],
  providers: [CardTypeService],
  exports: [CardTypeService],
  controllers: [CardTypeController],
})
export class CardTypeModule {
}