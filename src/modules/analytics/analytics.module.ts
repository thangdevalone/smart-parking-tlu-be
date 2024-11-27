import { forwardRef, Module } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { AnalyticsController } from "./analytics.controller";
import { Bill } from "../bill";
import { History } from "../history";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserHttpModule } from "../user";

@Module({
  imports: [
    TypeOrmModule.forFeature([History]),
    TypeOrmModule.forFeature([Bill]),
    forwardRef(() => UserHttpModule)
  ],
  providers: [AnalyticsService],
  exports: [],
  controllers: [AnalyticsController]
})
export class AnalyticsModule {
}