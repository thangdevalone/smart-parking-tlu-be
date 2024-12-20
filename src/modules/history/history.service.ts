import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseService } from "src/shared";
import { History } from "./history.entity";
import { HistoryRepository } from "./history.repository";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { LoggerService } from "src/logger";
import { UpdateHistoryDto } from "./history.dto";
import { Messages } from "src/config";
import { PaginationDto } from "src/types";

@Injectable()
export class HistoryService extends BaseService<History, HistoryRepository> {
  constructor(
    @InjectRepository(History)
    protected readonly repository: Repository<History>,
    protected readonly logger: LoggerService
  ) {
    super(repository, logger);
  }

  async getHistories(pagination: PaginationDto) {
    const { limit = 10, page = 1, sortBy = "timeIn", sortType = "DESC", search = "" } = pagination;
    const queryBuilder = this.repository.createQueryBuilder("entity");
    if (search.length > 0) {
      queryBuilder.orWhere(`entity.fullName LIKE :search`, { search: `%${search}%` });
    }

    const [results, total] = await queryBuilder
      .addOrderBy(`entity.timeIn`, sortType.toUpperCase() === "ASC" ? "ASC" : "DESC")
      .offset((page - 1) * limit)
      .limit(limit)
      .getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      paginate: results,
      page: page,
      totalPages,
      hasNext: page < totalPages,
      totalItems: total
    };
  }

  async createHistory(imageIn: string, cardId: string, price: number) {

    const history = await this.store({
      imageIn,
      timeIn: new Date(),
      card: cardId,
      price
    });

    if (!history) throw new NotFoundException(Messages.history.notCreated);

    return {
      data: history
    };
  }

  async updateHistory(id: string, updateHistoryDto: UpdateHistoryDto) {
    const history = await this.findOne({ id });
    if (!history) throw new NotFoundException(Messages.history.notFound);
    history.imageOut = updateHistoryDto.imageOut;
    history.timeOut = new Date();

    await this.repository.save(history);

    return {
      data: history,
      message: Messages.history.historyUpdated
    };
  }

  async getDetailHistory(cardId: number) {
    const history = await this.repository.createQueryBuilder("history")
      .where("history.timeOut IS NULL")
      .andWhere("history.imageOut IS NULL")
      .andWhere("history.cardId = :cardId", { cardId })
      .getOne();

    if (!history) {
      throw new NotFoundException(Messages.history.notFound);
    }

    return history;
  }

}