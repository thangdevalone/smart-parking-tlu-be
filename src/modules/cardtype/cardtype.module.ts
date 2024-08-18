import { forwardRef, Module } from '@nestjs/common';
import { CardTypeController } from './cardtype.controller';
import { CardTypeService } from './cardtype.service';
import { LoggerService } from 'src/logger';
import { CardTypeRepository } from './cardtype.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardType } from './cardtype.entity';
import { UserHttpModule } from '../user';

@Module({
  imports: [TypeOrmModule.forFeature([CardType]), forwardRef(() => UserHttpModule)],
  providers: [CardTypeService, LoggerService, CardTypeRepository],
  exports: [CardTypeService],
  controllers: [CardTypeController],
})
export class CardTypeModule { }
