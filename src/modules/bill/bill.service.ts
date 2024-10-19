import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseService } from "src/shared";
import { Bill } from "./bill.entity";
import { BillRepository } from "./bill.repository";
import { LoggerService } from "src/logger";
import { InjectRepository } from "@nestjs/typeorm";
import { BillStatus, PaginationDto } from "src/types";
import { UpdateBillDto } from "./bill.dto";
import { Messages } from "src/config";
import { Payload } from "../../auth";
import { User, UserRepository } from "../user";

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

  async createBill(cardId: string, price: number) {
    const bill = await this.store({
      // card: cardId,
      price,
      billStatus: BillStatus.UNPAID,
      startDate: new Date()
    });

    if (!bill) throw new NotFoundException(Messages.bill.notFound);
    return bill;
  }

  async updateBill(id: string, updateBillDeto: UpdateBillDto) {
    const bill = await this.findOne({ id });
    if (!bill) throw new NotFoundException(Messages.bill.notFound);

    bill.billStatus = updateBillDeto.billStatus;
    bill.endDate = new Date();

    await this.repository.save(bill);

    return {
      data: bill,
      message: Messages.bill.billUpdated
    };
  }

  async getDetail(user: User) {
    const bill = await this.repository.findOne({
      where: {
        user: user,
        billStatus: BillStatus.UNPAID
      }
    });
    if (!bill) throw new NotFoundException(Messages.bill.notFound);
    return bill;
  }

  async paginateBill(payload: Payload, paginate: PaginationDto) {
    if (payload.role.name.toLowerCase() === "admin") {
      return await this.paginate(paginate);
    }
    const user = await this.userRepository.findOne({ where: { id: payload.id } });

    if (!user) throw new NotFoundException(Messages.auth.notFound);

    const { limit = 10, page = 1, sortBy = "createdAt", sortType = "ASC", search = "" } = paginate;

    const queryBuilder = this.repository
      .createQueryBuilder("bill")
      .where("bill.userId = :userId", { userId: user.id });

    if (search) {
      queryBuilder.andWhere("bill.price LIKE :search", { search: `%${search}%` });
    }

    queryBuilder.orderBy(`bill.${sortBy}`, sortType);

    const [result, total] = await queryBuilder
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