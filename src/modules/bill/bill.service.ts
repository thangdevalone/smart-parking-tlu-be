import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseService } from "src/shared";
import { Bill } from "./bill.entity";
import { BillRepository } from "./bill.repository";
import { LoggerService } from "src/logger";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "src/types";
import { UpdateBillDto } from "./bill.dto";
import { Messages } from "src/config";
import { Payload } from "../../auth";
import { UserRepository } from "../user";

@Injectable()
export class BillService extends BaseService<Bill, BillRepository> {
  constructor(
    @InjectRepository(Bill)
    protected readonly billRepository: BillRepository,
    protected readonly userRepository: UserRepository,
    protected readonly logger: LoggerService
  ) {
    super(billRepository, logger);
  }

  async createBill(user: number | null, price: number) {
    const startDate = new Date();
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    const bill = await this.store({
      user: { id: user },
      price,
      startDate: startDate,
      endDate: endDate
    });

    if (!bill) throw new NotFoundException(Messages.bill.notFound);
    return bill;
  }

  async updateBill(id: string, updateBillDTO: UpdateBillDto) {
    const bill = await this.findOne({ id });
    if (!bill) throw new NotFoundException(Messages.bill.notFound);

    const { user, price } = updateBillDTO;

    if (user) bill.user.id = user;
    if (price) bill.price = price;

    await this.repository.save(bill);

    return {
      data: bill,
      message: Messages.bill.billUpdated
    };
  }

  async getDetail(cardId: number) {
    const bill = await this.repository.findOne({
      where: {
        card: { id: cardId }
      }
    });
    if (!bill) throw new NotFoundException(Messages.bill.notFound);
    return bill;
  }

  async paginateBill(payload: Payload, paginate: PaginationDto) {
    const { limit = 10, page = 1, sortBy = "createdAt", sortType = "ASC", search = "" } = paginate;
    if (payload.role.name.toLowerCase() === "admin") {
      const queryBuilder = this.repository
        .createQueryBuilder("bill")
        .leftJoinAndSelect("bill.user", "user")
        .select([
          "bill",
          "user.id",
          "user.fullName"
        ]);


      if (search) {
        queryBuilder.andWhere("bill.price LIKE :search", { search: `%${search}%` });
      }

      const [result, total] = await queryBuilder
        .orderBy(`bill.${sortBy}`, sortType.toUpperCase() === "ASC" ? "ASC" : "DESC")
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
      return {
        data: result,
        total,
        limit,
        page
      };

    }


    const queryBuilder = this.repository
      .createQueryBuilder("bill")
      .leftJoinAndSelect("bill.user", "user")
      .select([
        "bill",
        "user.id",
        "user.fullName"
      ])
      .where("bill.user = :user", { user: payload.id });

    if (search) {
      queryBuilder.andWhere("bill.price LIKE :search", { search: `%${search}%` });
    }

    const [result, total] = await queryBuilder
      .addOrderBy(`bill.${sortBy}`, sortType.toUpperCase() === "ASC" ? "ASC" : "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: result,
      total,
      limit,
      page
    };
  }

}