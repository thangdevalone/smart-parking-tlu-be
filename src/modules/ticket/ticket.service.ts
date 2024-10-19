import { Injectable } from "@nestjs/common";
import { BillService } from "../bill";
import { HistoryService } from "../history";
import { CardService } from "../card";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import { join, resolve } from "path";
import * as fs from "fs";
import { BillStatus } from "../../types";
import { Messages } from "../../config";
import FormData from "form-data";

@Injectable()
export class TicketService {

  constructor(
    private readonly billService: BillService,
    private readonly historyService: HistoryService,
    private readonly cardService: CardService,
    private config: ConfigService
  ) {
  }

  async checkin(cardId: string, Image: Express.Multer.File) {
    const card = await this.cardService.getCardDetail(cardId);

    if (!card) throw new Error(Messages.card.notFound);

    if (card.data.licensePlate !== "") throw new Error(Messages.card.alreadyExists);

    let monthlyCard = false;

    if (card.data.cardType.cardTypeName.includes("thang")) {
      const now = new Date();
      const newMonth = now.getMonth() + 1;
      const newYear = now.getFullYear();

      const expCard = card.data.expiration.split("-");
      const dateCard = expCard[expCard.length - 1];
      const [monthCard, yearCard] = dateCard.split("/");
      if (parseInt(monthCard, 10) > newMonth && parseInt(yearCard, 10) === newYear) {
        monthlyCard = true;
      }
    }

    if (!Image || !Image.buffer) {
      throw new Error("File upload failed or file buffer is undefined");
    }

    const uploadsDir = resolve(`${__dirname.split("\\dist")[0]}`, "uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const imagePath = join(uploadsDir, `${Date.now()}_checkin_${Image.originalname}`);
    fs.writeFileSync(imagePath, Image.buffer);

    try {

      const formData = new FormData();
      formData.append("image", Image.buffer, Image.originalname);

      const response = await axios.post(this.config.get("service.ai"), formData, {
        headers: {
          ...formData.getHeaders()
        }
      });

      const plate = response["text"] ?? "";

      await this.cardService.updateCard(cardId, { licensePlate: plate });
      const bill = await this.billService.createBill(card.data.user.id, monthlyCard ? 0 : card.data.cardType.cardTypePrice);
      await this.historyService.createHistory(imagePath, bill.id + "");

      return {
        data: {
          ...bill
        },
        message: "Thành công!"
      };
    } catch (err) {
      console.error(err);
    }
  }

  async checkout(cardId: string, Image: Express.Multer.File) {
    const card = await this.cardService.getCardDetail(cardId);

    if (!card) throw new Error(Messages.card.notFound);

    if (card.data.licensePlate === "") throw new Error(Messages.card.alreadyExists);

    if (!Image || !Image.buffer) {
      throw new Error("File upload failed or file buffer is undefined");
    }

    const uploadsDir = resolve(`${__dirname.split("\\dist")[0]}`, "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const imagePath = join(uploadsDir, `${Date.now()}_checkout_${Image.originalname}`);
    fs.writeFileSync(imagePath, Image.buffer);

    const bill = await this.billService.getDetail(card.data.user);
    if (!bill) throw new Error(Messages.bill.notFound);

    const newBill = await this.billService.updateBill(bill.id + "", { billStatus: BillStatus.PAID });

    const history = await this.historyService.findOne({ bill: bill.id, imageOut: null });

    if (!history) throw new Error(Messages.history.notFound);

    await this.historyService.updateHistory(history.id + "", { imageOut: imagePath });

    if (!fs.existsSync(history.imageIn)) {
      throw new Error("Checkin image not found");
    }

    await this.cardService.updateCard(cardId, { licensePlate: "" });

    return {
      data: {
        ...newBill
      },
      message: "Thành công!"
    };
  }
}