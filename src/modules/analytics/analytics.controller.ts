import { Controller, Get } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService
  ) {
  }

  @Get("weekly")
  async getWeekly() {
    return await this.analyticsService.getWeekly();
  }

  @Get("monthly-revenue")
  async getMonthlyRevenue() {
    return await this.analyticsService.getMonthlyRevenue();
  }

  @Get("compare-monthly")
  async getCompareMonthly() {
    return await this.analyticsService.getCompareMonthly();
  }


  @Get("last-seven-days")
  async getLastSevenDays() {
    return await this.analyticsService.getLastSevenDays();
  }

  @Get("in-out")
  async inOut() {
    return await this.analyticsService.inOut();
  }

}