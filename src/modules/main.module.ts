import { Module } from '@nestjs/common';
import { PermissionGuard, UserHttpModule } from './user';
import { RoleModule } from './role';
import { HistoryModule } from './history';
import { BillModule } from './bill';
import { CardModule } from './card';
import { CardTypeModule } from './cardtype';
import { MailModule } from './mail';

@Module({
  imports: [
    UserHttpModule,
    RoleModule,
    HistoryModule,
    BillModule,
    CardModule,
    CardTypeModule,
    MailModule
  ],
})
export class MainModule { }