import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseService } from "src/shared";
import { History } from "./history.entity";
import { HistoryRepository } from "./history.repository";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { LoggerService } from "src/logger";
import { UpdateHistoryDto } from "./history.dto";
import { Messages } from "src/config";

@Injectable()
export class HistoryService extends BaseService<History, HistoryRepository> {
    constructor(
        @InjectRepository(History)
        protected readonly repository: Repository<History>,
        protected readonly logger: LoggerService,
    ) {
        super(repository, logger);
    }

    async createHistory(imageIn: string) {
        const history = await this.store({
            imageIn,
            timeIn: new Date(),
        });
        if (!history) throw new NotFoundException(Messages.history.notCreated);

        return {
            data: history,
        }
    }

    async updateHistory(id: string, updateHistoryDto: UpdateHistoryDto) {
        const history = await this.findOne({ id });
        if (!history) throw new NotFoundException(Messages.history.notFound);

        Object.assign(history, updateHistoryDto);

        await this.repository.save(history);

        return {
            data: history,
            message: 'History updated successfully',
        }
    }

}