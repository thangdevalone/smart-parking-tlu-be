import { Injectable } from "@nestjs/common";
import { BaseService } from "src/shared";
import { CardType } from "./cardtype.entity";
import { CardTypeRepository } from "./cardtype.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LoggerService } from "src/logger";

@Injectable()
export class CardTypeService extends BaseService<CardType, CardTypeRepository> {
    constructor(
        @InjectRepository(CardType)
        protected readonly repository: Repository<CardType>,
        protected readonly logger: LoggerService,
    ) {
        super(repository, logger);
    }
}