import { Module } from '@nestjs/common';
import { UserHttpModule } from './user';
import { RoleModule } from './role';
import { HistoryModule } from './history';
import { BillModule } from './bill';
import { CardModule } from './card';
import { CardTypeModule } from './cardtype';

@Module({
  imports: [
    UserHttpModule,RoleModule,HistoryModule,BillModule,CardModule,CardTypeModule
  ],
})
export class MainModule {

}