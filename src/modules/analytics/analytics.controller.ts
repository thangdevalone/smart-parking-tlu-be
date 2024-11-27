import { Controller, Get, UseGuards } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guards";
import { AdminRequired } from "../user";

@Controller("analytics")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService
  ) {
  }

  @Get("weekly")
  @AdminRequired()
  async getWeekly() {
    return await this.analyticsService.getWeekly();
  }

  @Get("monthly-revenue")
  @AdminRequired()
  async getMonthlyRevenue() {
    return await this.analyticsService.getMonthlyRevenue();
  }

  @Get("compare-monthly")
  @AdminRequired()
  async getCompareMonthly() {
    return await this.analyticsService.getCompareMonthly();
  }

  @Get("last-seven-days")
  @AdminRequired()
  async getLastSevenDays() {
    return await this.analyticsService.getLastSevenDays();
  }

  @Get("in-out")
  @AdminRequired()
  async inOut() {
    return await this.analyticsService.inOut();
  }
}