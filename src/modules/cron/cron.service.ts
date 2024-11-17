import { Injectable, NotFoundException } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import moment from "moment-timezone";
import { Messages } from "../../config";
import { InjectRepository } from "@nestjs/typeorm";
import { Card } from "../card";
import { Repository } from "typeorm";
import { QueueService } from "../queue/queue.service";
import { CardUserQueue } from "../../types";
import { CardType } from "../cardtype";

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(Card)
    protected readonly cardRepository: Repository<Card>,
    @InjectRepository(CardType)
    protected readonly cardTypeRepository: Repository<CardType>,
    private readonly queueService: QueueService
  ) {
  }

  @Cron("30 8 * * * *")
  async handleCron() {
    if (this.isLastDayOfMonth()) {
      const cardType = await this.getMonthlyPass();
      const cardUser = await this.getAllCardUser() as unknown as CardUserQueue[];
      await this.queueService.enqueueEmail(cardUser, cardType.cardTypePrice);
    }
  }

  private isLastDayOfMonth(): boolean {
    const today = moment.tz("Asia/Ho_Chi_Minh");
    const tomorrow = moment(today).add(1, "day");
    return tomorrow.date() === 1;
  }

  private async getMonthlyPass() {
    const cardType = await this.cardTypeRepository.createQueryBuilder("cardType")
      .where("cardType.cardTypeName LIKE :name", { name: "%thang%" })  // Sử dụng LIKE với ký tự đại diện
      .getOne();

    if (!cardType) throw new NotFoundException(Messages.cardType.notFound);

    return cardType;
  }

  private async getAllCardUser() {
    const cards = await this.cardRepository.createQueryBuilder("card")
      .leftJoinAndSelect("card.user", "user")
      .addSelect(["user.id", "user.fullName", "user.email", "user.userCode"])
      .where("user.id IS NOT NULL")
      .getMany();

    if (!cards || cards.length === 0) throw new NotFoundException(Messages.card.notFound);

    return cards.map(card => ({
      id: card.id,
      cardCode: card.cardCode,
      cardStatus: card.cardStatus,
      expiration: card.expiration,
      user: {
        id: card.user.id,
        fullName: card.user.fullName,
        email: card.user.email,
        userCode: card.user.userCode
      }
    }));
  }
}
