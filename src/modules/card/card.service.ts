import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/shared';
import { Card } from './card.entity';
import { CardRepository } from './card.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from 'src/logger';
import { CardStatus, PaginationDto } from 'src/types';
import { Messages } from 'src/config';
import { CreateCardDto, UpdateCardDto } from './card.dto';
import { CardTypeService } from '../cardtype';

@Injectable()
export class CardService extends BaseService<Card, CardRepository> {
  constructor(
    @InjectRepository(Card)
    protected readonly repository: Repository<Card>,
    protected readonly logger: LoggerService,
    private readonly cardTypeService: CardTypeService
  ) {
    super(repository, logger);
  }

  async getCards(pagination: PaginationDto) {
    const { limit = 10, page = 1, sortBy = 'id', sortType = 'ASC', search = '' } = pagination;
    const queryBuilder = this.repository.createQueryBuilder('entity');

    if (search.length > 0) {
      queryBuilder
        .orWhere('card.cardCode LIKE :search', { search: `%${search}%` })
        .orWhere('card.licensePlate LIKE :search', { search: `%${search}%` });
    }
    queryBuilder.select([
      'entity.id',
      'entity.cardCode',
      'entity.licensePlate',
      'entity.cardStatus',
      'entity.createdAt',
      'entity.updatedAt',
      'user.fullName',
      'user.phone',
      'user.email',
      'user.userCode'
    ]);

    const [results, total] = await queryBuilder
      .addOrderBy(`entity.${sortBy}`, sortType.toUpperCase() === 'ASC' ? 'ASC' : 'DESC')
      .leftJoin('entity.user', 'user')
      .leftJoinAndSelect('entity.cardType', 'cardType')
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

  async getCardDetail(idCard: string) {
    const card = await this.repository
      .createQueryBuilder('card')
      .leftJoinAndSelect('card.user', 'user')
      .leftJoinAndSelect('card.cardType', 'cardType')
      .where('card.idCard = :idCard', { idCard: idCard })
      .getOne();

    if (!card) throw new NotFoundException(Messages.card.notFound);

    delete card.user.password;

    return {
      data: card
    };
  }

  async getAllCardUser() {
    const cards = await this.repository
      .createQueryBuilder('card')
      .leftJoin('card.user', 'user')
      .leftJoinAndSelect('card.cardType', 'cardType')
      .where('user.id IS NOT NULL')
      .getMany();

    if (!cards || cards.length === 0) throw new NotFoundException(Messages.card.notFound);

    return {
      data: cards
    };
  }

  async createCard(createCardDto: CreateCardDto) {
    const card = await this.findOne({ cardCode: createCardDto.cardCode });
    if (card) throw new Error(Messages.card.alreadyExists);

    const cardType = await this.cardTypeService.findOne({ id: createCardDto.cardType });

    if (!cardType) throw new NotFoundException(Messages.cardType.notFound);

    let exp: string = '';

    if (cardType.cardTypeName.includes('thang')) {
      const newDate = new Date();
      exp = `${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
    }
    const newCard = await this.store({
      idCard: createCardDto.idCard,
      user: { id: createCardDto.userId ?? null },
      cardStatus: CardStatus.ACTIVE,
      expiration: exp,
      cardCode: createCardDto.cardCode,
      cardType: { id: createCardDto.cardType }
    });

    if (!newCard) throw new NotFoundException(Messages.card.notCreated);

    return {
      data: newCard,
      message: Messages.card.created
    };
  }

  async deleteCard(ids: number[]) {
    const res = await this.deleteMultiple(ids, Card);
    return {
      message: Messages.card.deleted
    };
  }

  async updateCard(idCard: string, updateCardDto: UpdateCardDto, updatePlate?: boolean) {
    const card = await this.repository.findOne({ where: { id: +idCard } });

    if (!card) throw new NotFoundException(Messages.card.notFound);

    const filedUpdate = ['cardCode', 'cardType', 'cardStatus', 'licensePlate', 'user'];

    filedUpdate.forEach((field) => {
      if (updateCardDto[field]) card[field] = updateCardDto[field];
    });

    if (updatePlate) card['licensePlate'] = '';

    await this.repository.save(card);

    return {
      data: card,
      message: Messages.card.cardUpodated
    };
  }
}
