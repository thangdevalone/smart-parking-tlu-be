import { Injectable } from "@nestjs/common";
import { BaseService } from "src/shared";
import { CardType } from "./cardtype.entity";
import { CardTypeRepository } from "./cardtype.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LoggerService } from "src/logger";
import { CreateCradTypeDto, UpdateCardTypeDto } from "./cardtype.dto";
import { PaginationDto } from "src/types";
import { Messages } from "../../config";

@Injectable()
export class CardTypeService extends BaseService<CardType, CardTypeRepository> {
  constructor(
    @InjectRepository(CardType)
    protected readonly repository: Repository<CardType>,
    protected readonly logger: LoggerService
  ) {
    super(repository, logger);
  }

  async createCardType(data: CreateCradTypeDto) {
    data.cardTypeName = data.cardTypeName.toLowerCase();

    const oldCardType = await this.index({ cardTypeName: data.cardTypeName });

    if (oldCardType.length > 0) throw new Error(Messages.cardType.alreadyExists);

    const cardType = await this.store(data);

    if (!cardType) throw new Error(Messages.cardType.notCreated);

    return {
      data: cardType,
      message: Messages.cardType.created
    };
  }

  async getCardTypes(pagination: PaginationDto) {
    return this.paginate(pagination, "cardTypeName");
  }

  async deleteCardType(ids: number[]) {
    const res = await this.deleteMultiple(ids, CardType);
    return {
      message: Messages.cardType.deleted
    };
  }

  async updateCardType(idCardType: string, data: UpdateCardTypeDto) {
    const cardType = await this.repository.findOne({ where: { id: +idCardType } });

    if (!cardType) throw new Error("Card Type not found");

    Object.assign(cardType, data);

    await this.repository.save(cardType);

    return {
      data: cardType,
      message: Messages.cardType.cardTypeUpodated
    };

  }
}