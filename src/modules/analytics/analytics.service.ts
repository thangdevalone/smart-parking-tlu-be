import { Injectable } from "@nestjs/common";
import { Bill } from "../bill";
import { History } from "../history";
import { Between, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { arrayDaysOfData } from "../../types";

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

    const average = total ? Math.round(total * 100 / 7) / 100 : 0;

    const data = await this.historyRepository
      .createQueryBuilder("history")
      .select("DATE_FORMAT(history.timeIn, '%Y-%m-%d')", "date")
      .addSelect("COUNT(history.id)", "value")
      .where("history.timeIn BETWEEN :start AND :end", { start, end })
      .groupBy("DATE_FORMAT(history.timeIn, '%Y-%m-%d')")
      .orderBy("date", "ASC")
      .getRawMany();


    // console.log("data", data);

    // const valuesTable =
    //
    // console.log("start", start);
    // console.log("end", end);

    // const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    //   const date = new Date(start);
    //   date.setDate(start.getDate() + i);
    //   return { date: date.toISOString().split("T")[0], value: 0 };
    // });

    const daysOfWeek = this.daysOfWeek(start);
    // console.log("data", data);

    // console.log(data.map(item => item.date.toISOString().split("T")[0]));

    // console.log(data);

    const valuesTable = this.changeData(daysOfWeek, data);

    return {
      data: {
        today: todayCount,
        average,
        total,
        data: valuesTable
      }
    };
  }

  async getMonthlyRevenue() {
    const { start, end } = this.getMonthRange();

    const totalRevenue = await this.historyRepository
      .createQueryBuilder("history")
      .select("SUM(history.price)", "total")
      .where("history.timeIn BETWEEN :start AND :end", { start, end })
      .getRawOne() as unknown as { total: number };


    const dailyRevenue = await this.historyRepository
      .createQueryBuilder("history")
      .select("DATE_FORMAT(history.timeIn, '%Y-%m-%d')", "date")
      .addSelect("SUM(history.price)", "value")
      .where("history.timeIn BETWEEN :start AND :end", { start, end })
      .groupBy("DATE_FORMAT(history.timeIn, '%Y-%m-%d')")
      .orderBy("date", "ASC")
      .getRawMany();

    const today = (new Date()).toISOString().split("T")[0];

    let todayRevenue = null;
    for (const r of dailyRevenue) {
      if (String(r.date) === String(today)) {
        todayRevenue = r.value;
        break;
      }
    }

    const maxValue = dailyRevenue.length ? Math.max(...dailyRevenue.map((r) => parseFloat(r.value))) : null;

    const valuesTable = this.changeData(this.daysOfMonth(end), dailyRevenue);

    return {
      data: {
        data: valuesTable,
        today: +todayRevenue ?? 0,
        maxValue: +maxValue ?? 0,
        total: +totalRevenue.total ?? 0
      }
    };
  }

  async getCompareMonthly() {
    const thisMonth = this.getMonthRange();
    const lastMonth = {
      start: new Date(thisMonth.start.getFullYear(), thisMonth.start.getMonth() - 1, 1),
      end: new Date(thisMonth.start.getFullYear(), thisMonth.start.getMonth(), 0, 23, 59, 59, 999)
    };

    const thisMonthData = await this.historyRepository
      .createQueryBuilder("history")
      .select("COUNT(history.id)", "count")
      .where("history.timeIn BETWEEN :start AND :end", { start: thisMonth.start, end: thisMonth.end })
      .getRawOne();

    const lastMonthData = await this.historyRepository
      .createQueryBuilder("history")
      .select("COUNT(history.id)", "count")
      .where("history.timeIn BETWEEN :start AND :end", { start: lastMonth.start, end: lastMonth.end })
      .getRawOne();

    const thisMonthDays = new Date(thisMonth.start.getFullYear(), thisMonth.start.getMonth() + 1, 0).getDate();
    const lastMonthDays = new Date(lastMonth.start.getFullYear(), lastMonth.start.getMonth() + 1, 0).getDate();

    return {
      thisMonth: {
        value: Math.round(thisMonthData.count * 100 / thisMonthDays) / 100,
        perDay: +thisMonthData.count
      },
      lastMonth: {
        value: Math.round(lastMonthData.count * 100 / lastMonthDays) / 100,
        perDay: +lastMonthData.count
      }
    };
  }

  async getLastSevenDays() {
    const { start, end } = this.getLast7DaysRange();

    const data = await this.historyRepository
      .createQueryBuilder("history")
      .select("DATE_FORMAT(history.timeIn, '%Y-%m-%d')", "date")
      .addSelect("COUNT(history.id)", "value")
      .where("history.timeIn BETWEEN :start AND :end", { start, end })
      .groupBy("DATE_FORMAT(history.timeIn, '%Y-%m-%d')")
      .orderBy("date", "ASC")
      .getRawMany();

    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 5 + i);
      date.setHours(0, 0, 0, 0);
      return { date: date.toISOString().split("T")[0], value: 0 };
    });


    const valueTable = this.changeData(days, data);

    const total = data.reduce((sum, day) => sum + +day.value, 0);

    return {
      data: {
        value: Math.round(total * 100 / 7) / 100,
        data: valueTable
      }
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

  private daysOfWeek(start: Date): arrayDaysOfData[] {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return { date: date.toISOString().split("T")[0], value: 0 };
    });
  }

  private daysOfMonth(end: Date): arrayDaysOfData[] {
    return Array.from({ length: end.getDate() }, (_, i) => {
      const date = new Date(end);
      date.setDate(end.getDate() - i);
      return { date: date.toISOString().split("T")[0], value: 0 };
    });
  }

  private changeData(date: arrayDaysOfData[], data: arrayDaysOfData[]) {
    return date.map((item: { date: string, value: number }) => {
      const day = data.find((d) => {
        return String(d.date) === String(item.date);
      });
      return { date: item.date, value: day ? parseInt(String(day.value), 10) : 0 };
    });
  }

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