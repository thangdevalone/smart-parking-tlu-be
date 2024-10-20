import { Module } from "@nestjs/common";
import { CronService } from "./cron.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Card } from "../card";
import { EmailService, MailModule } from "../mail";
import { QueueService } from "../queue/queue.service";
import { QueueModule } from "../queue/queue.module"; // Import QueueModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Card]),
    MailModule,
    QueueModule
  ],
  providers: [CronService, EmailService, QueueService]
})
export class CronModule {
}
