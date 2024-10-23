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
import { handlePrice } from "../../utils";

@Injectable()
export class TicketService {

  constructor(
    private readonly billService: BillService,
    private readonly historyService: HistoryService,
    private readonly cardService: CardService,
    private config: ConfigService) {
  }

  async checkin(cardId: string, Image: Express.Multer.File) {
    const card = await this.cardService.getCardDetail(cardId);

    if (!card) throw new Error(Messages.card.notFound);

    if (card.data.licensePlate !== "") throw new Error(Messages.card.alreadyExists);

    if (!Image || !Image.buffer) {
      throw new Error("File upload failed or file buffer is undefined");
    }

    const uploadsDir = resolve(`${__dirname.split("\\dist")[0]}`, "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }


    try {
      const formData = new FormData();
      formData.append("image", Image.buffer, Image.originalname);

      const response = await axios.post(this.config.get("service.ai"), formData, {
        headers: {
          ...formData.getHeaders()
        }
      });

      const plate = response.data["text"] ?? "";
      const outputImagePath = response.data["output_image_path"];

      const outputImageBuffer = fs.readFileSync(outputImagePath);

      const savedOutputImagePath = join(uploadsDir, `output_${Date.now()}_${Image.originalname}`);
      fs.writeFileSync(savedOutputImagePath, outputImageBuffer);

      await this.cardService.updateCard(cardId, { licensePlate: plate });
      const bill = await this.billService.createBill(card.data.user.id, this.handleValidate(card) ? 0 : card.data.cardType.cardTypePrice);
      await this.historyService.createHistory(savedOutputImagePath, bill.id + "");

      return {
        data: {
          ...bill,
          image: savedOutputImagePath
        }, message: "Thành công!"
      };
    } catch (err) {
      console.error(err);
      throw new Error("An error occurred while processing the image.");
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

    try {
      const formData = new FormData();
      formData.append("image", Image.buffer, Image.originalname);

      const response = await axios.post(this.config.get("service.ai"), formData, {
        headers: {
          ...formData.getHeaders()
        }
      });

      const plateFromAI = response.data["text"] ?? "";
      const outputImagePath = response.data["output_image_path"];

      const outputImageBuffer = fs.readFileSync(outputImagePath);

      const savedOutputImagePath = join(uploadsDir, `output_${Date.now()}_${Image.originalname}`);
      fs.writeFileSync(savedOutputImagePath, outputImageBuffer);

      if (plateFromAI.trim() !== card.data.licensePlate.trim()) {
        new Error("License plate does not match.");
      }

      const bill = await this.billService.getDetail(card.data.user);
      if (!bill) new Error(Messages.bill.notFound);

      const price = handlePrice(bill.startDate, bill.price, this.handleValidate(card));

      const newBill = await this.billService.updateBill(bill.id + "", { billStatus: BillStatus.PAID, price: price });

      const history = await this.historyService.findOne({ bill: bill.id, imageOut: null });
      if (!history) new Error(Messages.history.notFound);

      await this.historyService.updateHistory(history.id + "", { imageOut: savedOutputImagePath });

      await this.cardService.updateCard(cardId, { licensePlate: "" }, true);

      return {
        data: {
          ...newBill,
          image: savedOutputImagePath
        },
        message: "Thành công!"
      };
    } catch (err) {
      console.error(err);
      throw new Error("An error occurred while processing the image.");
    }
  }

  private handleValidate(card: any): boolean {
    if (!card.data.cardType.cardTypeName.includes("thang")) {
      return false;
    }
    const now = new Date();
    const newMonth = now.getMonth() + 1;
    const newYear = now.getFullYear();
    const [monthCard, yearCard] = card.data.expiration.split("-").pop()?.split("/") || [];
    return monthCard && yearCard && parseInt(monthCard, 10) > newMonth && parseInt(yearCard, 10) === newYear;
  }
}