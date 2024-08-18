import { Injectable } from "@nestjs/common";
import { BaseService } from "src/shared";
import { Card } from "./card.entity";
import { CardyRepository } from "./card.repository";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { LoggerService } from "src/logger";

@Injectable()
export class CardService extends BaseService<Card, CardyRepository> {
    constructor(
        @InjectRepository(Card)
        protected readonly repository: Repository<Card>,
        protected readonly logger: LoggerService,
    ) {
        super(repository, logger);
    }
}