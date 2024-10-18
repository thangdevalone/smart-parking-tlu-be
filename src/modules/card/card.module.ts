import { forwardRef, Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { UserHttpModule } from '../user';
import { CardyRepository } from './card.repository';
import { LoggerService } from 'src/logger';
import { CardTypeModule } from '../cardtype';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), forwardRef(() => UserHttpModule), forwardRef(() => CardTypeModule)],
  providers: [CardService, CardyRepository, LoggerService],
  exports: [CardService],
  controllers: [CardController]
})
export class CardModule {
}