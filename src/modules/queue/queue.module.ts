import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { ConfigService } from "@nestjs/config";
import * as consumers from "./consumers";
import { QueueService } from "./queue.service";
import { EmailService } from "../mail";

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        connection: {
          url: configService.get<string>("redis.uri"),
          port: configService.get<number>("redis.port"),
          host: configService.get<string>("redis.host")
        }
      }),
      inject: [ConfigService]
    }),
    BullModule.registerQueue({
      name: "email"
    })
  ],
  providers: [...Object.values(consumers), QueueService, EmailService],
  exports: [QueueService]
})
export class QueueModule {
}
