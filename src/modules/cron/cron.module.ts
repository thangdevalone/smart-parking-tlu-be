import { Module } from "@nestjs/common";
import { CronService } from "./cron.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Card } from "../card";
import { EmailService, MailModule } from "../mail";
import { QueueModule } from "../queue/queue.module";
import { CardType } from "../cardtype";

@Module({
  imports: [
    TypeOrmModule.forFeature([Card, CardType]),
    MailModule,
    QueueModule
  ],
  providers: [CronService, EmailService]
})
export class CronModule {
}
