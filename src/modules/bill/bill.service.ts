import { Injectable } from "@nestjs/common";
import { BaseService } from "src/shared";
import { Bill } from "./bill.entity";
import { BillRepository } from "./bill.repository";
import { LoggerService } from "src/logger";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class BillService extends BaseService<Bill, BillRepository> {
    constructor(
        @InjectRepository(Bill)
        protected readonly billRepository: BillRepository,
        protected readonly logger: LoggerService,
    ) {
        super(billRepository, logger);
    }

    async getBills() { }

    async getBill(id: number) {
    }

    async createBill() {
    }

    async updateBill() {
    }

}