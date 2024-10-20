// import { Injectable } from "@nestjs/common";
// import { InjectQueue } from "@nestjs/bullmq";
// import { Queue } from "bullmq";
//
// @Injectable()
// export class QueueService {
//   constructor(
//     @InjectQueue("email") private emailQueue: Queue
//   ) {
//   }
//
//   async enqueueEmail(cardUser: any) {
//     for (const card of cardUser) {
//       const emailData = {
//         to: card.user.email,
//         subject: "Thông báo gia hạn thẻ",
//         html: `<p>Thẻ của bạn có mã <strong>${card.cardCode}</strong> sắp hết hạn.</p>`
//       };
//       await this.emailQueue.add("sendEmail", emailData);
//     }
//   }
// }


import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue("email") private emailQueue: Queue
  ) {
  }

  async enqueueEmail(email: string) {
    await this.emailQueue.add("sendEmail", { email });
  }
}
