import { Injectable } from "@nestjs/common";
import { BaseService } from "src/shared";
import { History } from "./history.entity";
import { HistoryRepository } from "./history.repository";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { LoggerService } from "src/logger";

@Injectable()
export class HistoryService extends BaseService<History, HistoryRepository> {
    constructor(
        @InjectRepository(History)
        protected readonly repository: Repository<History>,
        protected readonly logger: LoggerService,
    ) {
        super(repository, logger);
    }


    async getHistories() {
    }

    async getHistory() {
    }

    async createHistory() {
    }

    async updateHistory() {
    }

}