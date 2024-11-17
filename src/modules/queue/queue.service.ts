import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { CardUserQueue } from "../../types";

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue("email") private emailQueue: Queue
  ) {
  }

  async enqueueEmail(cardUsers: CardUserQueue[], price: number) {
    for (const card of cardUsers) {
      const emailData = {
        to: card.user.email,
        subject: "Thông báo gia hạn thẻ",
        html: `
        <p>Thẻ của bạn có mã <strong>${card.cardCode}</strong> sắp hết hạn. 
        Gia hạn ở link: 
        <a href="http://localhost:5173/admin/payment/pay">tại đây</a> với giá ${price}.</p>
      `
      };
      await this.emailQueue.add("sendEmail", emailData);
    }
  }
}

