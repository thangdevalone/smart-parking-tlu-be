import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseService } from "src/shared";
import { Bill } from "./bill.entity";
import { BillRepository } from "./bill.repository";
import { LoggerService } from "src/logger";
import { InjectRepository } from "@nestjs/typeorm";
import { BillStatus } from "src/types";
import { UpdateBillDto } from "./bill.dto";
import { Messages } from "src/config";
import { Not } from "typeorm";

@Injectable()
export class BillService extends BaseService<Bill, BillRepository> {
    constructor(
        @InjectRepository(Bill)
        protected readonly billRepository: BillRepository,
        protected readonly logger: LoggerService,
    ) {
        super(billRepository, logger);
    }


    async createBill(cardId: string, price: number, historyId: string) {
        const bill = await this.store({
            card: cardId,
            price,
            billStatus: BillStatus.UNPAID,
            startDate: new Date(),
            histories: historyId,
        })

        if (!bill) throw new NotFoundException(Messages.bill.notFound);
        return bill;
    }

    async updateBill(id: string, updateBillDeto: UpdateBillDto) {
        const bill = await this.findOne({ id });
        if (!bill) throw new NotFoundException(Messages.bill.notFound);

        Object.assign(bill, updateBillDeto);

        await this.repository.save(bill);

        return {
            data: bill,
            message: Messages.bill.billUpdated,
        }
    }

}