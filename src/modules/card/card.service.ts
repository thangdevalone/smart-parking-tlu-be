import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseService } from "src/shared";
import { Card } from "./card.entity";
import { CardyRepository } from "./card.repository";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { LoggerService } from "src/logger";
import { PaginationDto } from "src/types";
import { Messages } from "src/config";
import { CreateCardDto, UpdateCardDto } from "./card.dto";

@Injectable()
export class CardService extends BaseService<Card, CardyRepository> {
    constructor(
        @InjectRepository(Card)
        protected readonly repository: Repository<Card>,
        protected readonly logger: LoggerService,
    ) {
        super(repository, logger);
    }


    async getCards(pagination: PaginationDto) {
        return await this.paginate(pagination, 'cardCode')
    }

    async getCardDetail(idCard: string) {
        const card = await this.findById(idCard)

        if (!card) throw new NotFoundException(Messages.card.notFound)

        return {
            data: card
        }
    }

    async createCard(createCardDto: CreateCardDto) {
        const card = await this.index({ cardCode: createCardDto.cardCode })

        if (card.length > 0) throw new Error(Messages.card.alreadyExists)

        return {
            data: await this.repository.create(createCardDto),
            message: Messages.card.created
        }

    }

    async deleteCard(idCard: string) {
        const card = await this.repository.findOne({ where: { id: +idCard } });

        if (!card) throw new NotFoundException(Messages.card.notFound)

        await this.repository.delete(idCard)

        return {
            message: Messages.card.deleted,
        };
    }

    async updateCard(idCard: string, updateCardDto: UpdateCardDto) {
        const card = await this.repository.findOne({ where: { id: +idCard } })

        if (!card) throw new NotFoundException(Messages.card.notFound)

        Object.assign(card, updateCardDto);

        await this.repository.save(card);

        return {
            data: card,
            message: Messages.card.cardUpodated
        }
    }
}