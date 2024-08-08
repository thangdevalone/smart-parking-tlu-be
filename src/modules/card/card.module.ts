import { Module } from '@nestjs/common'
import {CardController} from './card.controller'
import {CardService} from './card.service'

@Module({
  imports: [],
  providers: [CardService],
  exports: [CardService],
  controllers: [CardController],
})
export class CardModule {
}