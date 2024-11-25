import { Injectable } from "@nestjs/common";
import { Bill } from "../bill";
import { History } from "../history";
import { Between, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(History)
    protected readonly historyRepository: Repository<History>,
    @InjectRepository(Bill)
    protected readonly billRepository: Repository<Bill>
  ) {
  }

  async getWeekly() {
    const { start, end } = this.getWeekRange();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const total = await this.historyRepository.count({ where: { timeIn: Between(start, end) } });

    const todayCount = await this.historyRepository.count({ where: { timeIn: Between(today, new Date()) } });

    const average = total ? Math.round(total / 7) : 0;

    return {
      today: todayCount,
      average,
      total
    };
  }

  async getMonthlyRevenue() {
    const { start, end } = this.getMonthRange();

    const totalRevenue = await this.historyRepository
      .createQueryBuilder("history")
      .select("SUM(history.price)", "total")
      .where("history.timeIn BETWEEN :start AND :end", { start, end })
      .getRawOne();

    const dailyRevenue = await this.historyRepository
      .createQueryBuilder("history")
      .select("DATE(history.timeIn)", "date")
      .addSelect("SUM(history.price)", "revenue")
      .where("history.timeIn BETWEEN :start AND :end", { start, end })
      .groupBy("DATE(history.timeIn)")
      .orderBy("revenue", "DESC")
      .getRawMany();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRevenue = dailyRevenue.find((r) => r.date === today.toISOString().split("T")[0]);
    const maxValue = dailyRevenue.length ? Math.max(...dailyRevenue.map((r) => parseFloat(r.revenue))) : 0;

    return {
      today: todayRevenue ? parseFloat(todayRevenue.revenue) : 0,
      maxValue,
      total: totalRevenue?.total ? parseFloat(totalRevenue.total) : 0
    };
  }

  async getCompareMonthly() {
    const thisMonth = this.getMonthRange();
    const lastMonth = {
      start: new Date(thisMonth.start.getFullYear(), thisMonth.start.getMonth() - 1, 1),
      end: new Date(thisMonth.start.getFullYear(), thisMonth.start.getMonth(), 0, 23, 59, 59, 999)
    };

    const thisMonthCount = await this.historyRepository.count({
      where: { timeIn: Between(thisMonth.start, thisMonth.end) }
    });

    const lastMonthCount = await this.historyRepository.count({
      where: { timeIn: Between(lastMonth.start, lastMonth.end) }
    });

    return {
      thisMonth: thisMonthCount,
      lastMonth: lastMonthCount,
      perDay: thisMonthCount ? Math.round(thisMonthCount / new Date().getDate()) : 0
    };
  }

  async getLastSevenDays() {
    const { start, end } = this.getLast7DaysRange();

    const data = await this.historyRepository
      .createQueryBuilder("history")
      .select("DATE(history.timeIn)", "date")
      .addSelect("COUNT(history.id)", "count")
      .where("history.timeIn BETWEEN :start AND :end", { start, end })
      .groupBy("DATE(history.timeIn)")
      .orderBy("date", "ASC")
      .getRawMany();

    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 6 + i);
      date.setHours(0, 0, 0, 0);
      return { date: date.toISOString().split("T")[0], count: 0 };
    });

    data.forEach((entry) => {
      const day = days.find((d) => d.date === entry.date);
      if (day) {
        day.count = parseInt(entry.count, 10);
      }
    });

    const total = days.reduce((sum, day) => sum + day.count, 0);

    return {
      value: Math.round(total / 7),
      data: days
    };
  }

  async inOut() {
    const inCount = await this.historyRepository.count({ where: { timeIn: Between(new Date(0), new Date()) } });
    const outCount = await this.historyRepository.count({ where: { timeOut: Between(new Date(0), new Date()) } });

    return {
      in: inCount,
      out: outCount
    };
  }

  //private func


  // Helper: Lấy khoảng thời gian tuần hiện tại
  private getWeekRange(): { start: Date; end: Date } {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const start = new Date(now);
    start.setDate(now.getDate() - (dayOfWeek - 1));
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // Helper: Lấy khoảng thời gian trong tháng hiện tại
  private getMonthRange(): { start: Date; end: Date } {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
  }

  // Helper: Lấy khoảng thời gian 7 ngày trước
  private getLast7DaysRange(): { start: Date; end: Date } {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return { start, end };
  }
}