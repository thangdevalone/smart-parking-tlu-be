import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseService } from "src/shared";
import { Card } from "./card.entity";
import { CardyRepository } from "./card.repository";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { LoggerService } from "src/logger";
import { CardStatus, PaginationDto } from "src/types";
import { Messages } from "src/config";
import { CreateCardDto, UpdateCardDto } from "./card.dto";
import { CardTypeService } from "../cardtype";

@Injectable()
export class CardService extends BaseService<Card, CardyRepository> {
    constructor(
        @InjectRepository(Card)
        protected readonly repository: Repository<Card>,
        protected readonly logger: LoggerService,
        private readonly cardTypeService: CardTypeService
    ) {
        super(repository, logger);
    }


    async getCards(pagination: PaginationDto) {
        return await this.paginate(pagination, 'cardCode')
    }

    async getCardDetail(idCard: string) {
        const card = await this.repository.createQueryBuilder('card')
            .leftJoinAndSelect('card.cardType', 'cardType')
            .where('card.id = :id', { id: +idCard })
            .getOne()

        if (!card) throw new NotFoundException(Messages.card.notFound)

        return {
            data: card
        }
    }

    async createCard(createCardDto: CreateCardDto) {
        const card = await this.index({ cardCode: createCardDto.cardCode })

        if (card.length > 0) throw new Error(Messages.card.alreadyExists)

        const cardType = await this.cardTypeService.index({ id: createCardDto.cardType })

        if (!cardType) throw new NotFoundException(Messages.cardType.notFound)

        const newCard = await this.store({ ...createCardDto, cardStatus: CardStatus.ACTIVE })

        return {
            data: newCard,
            message: Messages.card.created
        }

    }

    async deleteCard(ids: number[]) {
        const res = await this.deleteMultiple(ids,Card);
        return {
            message: Messages.card.deleted,
        }
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