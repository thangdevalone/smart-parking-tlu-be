import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared';
import { CardType } from './cardtype.entity';
import { CardTypeRepository } from './cardtype.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from 'src/logger';
import { CreateCradTypeDto, UpdateCardTypeDto } from './cardtype.dto';
import { PaginationDto } from 'src/types';

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

    if (oldCardType.length > 0) throw new Error('Card Type already exists');

    const cardType = await this.store(data);

    if (!cardType) throw new Error('Card Type not created');

    return {
      data: cardType,
      message: 'Card Type created'
    };
  }

  async getCardTypes(pagination: PaginationDto) {
    return this.paginate(pagination, 'cardTypeName');
  }

  async deleteCardType(ids: number[]) {
    const res = await this.deleteMultiple(ids, CardType);
    return {
      message: 'Card Type deleted successfully'
    };
  }

  async updateCardType(idCardType: string, data: UpdateCardTypeDto) {
    const cardtype = await this.repository.findOne({ where: { id: +idCardType } });

    if (!cardtype) throw new Error('Card Type not found');

    Object.assign(cardtype, data);

    await this.repository.save(cardtype);

    return {
      data: cardtype,
      message: 'Card Type updated'
    };

  }
}