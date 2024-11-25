import { Module } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { AnalyticsController } from "./analytics.controller";
import { Bill } from "../bill";
import { History } from "../history";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([History]),
    TypeOrmModule.forFeature([Bill])
  ],
  providers: [AnalyticsService],
  exports: [],
  controllers: [AnalyticsController]
})
export class AnalyticsModule {
}