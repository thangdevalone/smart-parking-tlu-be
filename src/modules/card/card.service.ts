import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseService } from "src/shared";
import { Card } from "./card.entity";
import { CardRepository } from "./card.repository";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { LoggerService } from "src/logger";
import { CardStatus, PaginationDto } from "src/types";
import { Messages } from "src/config";
import { CreateCardDto, UpdateCardDto } from "./card.dto";
import { CardTypeService } from "../cardtype";

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
    const { limit = 10, page = 1, sortBy = "id", sortType = "ASC", search = "" } = pagination;
    const queryBuilder = this.repository.createQueryBuilder("card");

    // Điều kiện tìm kiếm
    if (search.length > 0) {
      queryBuilder
        .where("card.cardCode LIKE :search", { search: `%${search}%` })
        .orWhere("card.licensePlate LIKE :search", { search: `%${search}%` });
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    queryBuilder
      .leftJoinAndSelect("card.bills", "bill")
      .leftJoinAndSelect("bill.user", "user")
      .andWhere("bill.startDate >= :startOfMonth AND bill.endDate < :endOfMonth", {
        startOfMonth: startOfMonth.toISOString(),
        endOfMonth: endOfMonth.toISOString()
      })
      .orWhere("bill.id IS NULL"); // Bao gồm các card không có hóa đơn

    queryBuilder.select([
      "card.id",
      "card.idCard",
      "card.cardCode",
      "card.licensePlate",
      "card.cardStatus",
      "card.createdAt",
      "card.updatedAt",
      "cardType.id",
      "cardType.cardTypeName",
      "cardType.cardTypePrice",
      "bill.id",
      "user.id",
      "user.fullName"
    ]);

    queryBuilder.leftJoinAndSelect("card.cardType", "cardType");

    const [results, total] = await queryBuilder
      .addOrderBy(`card.${sortBy}`, sortType.toUpperCase() === "ASC" ? "ASC" : "DESC")
      .offset((page - 1) * limit)
      .limit(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    const formattedResults = results.map(card => ({
      id: card.id,
      idCard: card.idCard,
      cardCode: card.cardCode,
      licensePlate: card.licensePlate,
      cardStatus: card.cardStatus,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
      cardType: {
        id: card.cardType.id,
        cardTypeName: card.cardType.cardTypeName,
        cardTypePrice: card.cardType.cardTypePrice
      },
      user: card.bills && card.bills.length > 0 ? {
        id: card.bills[0].user?.id,
        fullName: card.bills[0].user?.fullName
      } : null
    }));

    return {
      data: formattedResults,
      page: page,
      totalPages,
      hasNext: page < totalPages,
      totalItems: total
    };
  }


  async getCardDetail(idCard: string) {
    const card = await this.repository.createQueryBuilder("card")
      .leftJoinAndSelect("card.cardType", "cardType")
      .leftJoinAndSelect("bills", "bill", "bill.cardId = card.id")
      .leftJoinAndSelect("bill.user", "user")
      .where("card.id = :id", { id: +idCard })
      .getOne();

    if (!card) throw new NotFoundException(Messages.card.notFound);

    return {
      data: card
    };
  }

  async getCardDetailIdCardIOT(id: string) {
    const card = await this.repository
      .createQueryBuilder("card")
      .leftJoinAndSelect("card.cardType", "cardType")
      .where("card.idCard = :idCard", { idCard: id })
      .getOne();

    if (!card) throw new NotFoundException(Messages.card.notFound);

    return {
      data: card
    };
  }

  async createCard(createCardDto: CreateCardDto) {
    const card = await this.findOne({ cardCode: createCardDto.cardCode });
    if (card) throw new Error(Messages.card.alreadyExists);

    const cardType = await this.cardTypeService.findOne({ id: createCardDto.cardType });

    if (!cardType) throw new NotFoundException(Messages.cardType.notFound);

    const newCard = await this.store({
      idCard: createCardDto.idCard,
      cardStatus: CardStatus.ACTIVE,
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

    const filedUpdate = ["cardCode", "cardType", "cardStatus", "licensePlate", "user"];

    filedUpdate.forEach((field) => {
      if (updateCardDto[field]) card[field] = updateCardDto[field];
    });

    if (updatePlate) card["licensePlate"] = "";

    await this.repository.save(card);

    return {
      data: card,
      message: Messages.card.cardUpodated
    };
  }
}
