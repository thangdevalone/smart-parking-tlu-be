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
    private config: ConfigService
  ) {
  }

  async checkin(cardId: string, imageUrl: string) {
    const card = await this.cardService.getCardDetailIdCardIOT(cardId);

    if (!card) throw new Error(Messages.card.notFound);
    if (card.data.licensePlate !== "") throw new Error("Thẻ đã checkin trước đó!!");
    if (!imageUrl) throw new Error("No image URL provided.");

    const uploadsDir = resolve(`${__dirname.split("\\dist")[0]}`, "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    let savedOutputImagePath = "";
    let plate = "";

    try {
      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const imageBuffer = Buffer.from(response.data);
      const imageExtension = imageUrl.split(".").pop();

      const allowedExtensions = ["jpg", "jpeg", "png"];
      if (!allowedExtensions.includes(imageExtension.toLowerCase())) {
        new Error("Unsupported image format. Only JPG and PNG are allowed.");
      }

      const timestamp = Date.now();
      const savedImagePath = join(uploadsDir, `checkin_${cardId}_${timestamp}.png`);

      fs.writeFileSync(savedImagePath, imageBuffer);

      const formData = new FormData();
      formData.append("image", imageBuffer, `checkin_${cardId}_${timestamp}.png`);

      const aiResponse = await axios.post(this.config.get("service.ai"), formData, {
        headers: { ...formData.getHeaders() }
      });

      plate = aiResponse.data["text"] ?? "";
      const outputImagePath = aiResponse.data["output_image_path"];
      const outputImageBuffer = fs.existsSync(outputImagePath) ? fs.readFileSync(outputImagePath) : null;

      if (!outputImageBuffer) {
        new Error("Output image path is invalid or not accessible.");
      }

      savedOutputImagePath = join(uploadsDir, `checkin_output_ai_${timestamp}_${cardId}.png`);
      fs.writeFileSync(savedOutputImagePath, outputImageBuffer);


    } catch (err) {
      console.error(err);
      throw new Error("An error occurred while processing the image.");
    }

    await this.cardService.updateCard(card.data.id + "", { licensePlate: plate });

    const bill = await this.billService.createBill(
      card.data.user ? card.data.user.id : null,
      this.handleValidate(card) ? 0 : card.data.cardType.cardTypePrice
    );
    await this.historyService.createHistory(savedOutputImagePath, bill.id + "");

    return {
      data: { ...bill, image: savedOutputImagePath },
      message: "Thành công!"
    };

  }

  async checkout(cardId: string, imageUrl: string) {
    const card = await this.cardService.getCardDetailIdCardIOT(cardId);

    if (!card) throw new Error(Messages.card.notFound);
    if (card.data.licensePlate === "") throw new Error("Chưa checkin!!");
    if (!imageUrl) throw new Error("No image URL provided.");

    const uploadsDir = resolve(`${__dirname.split("\\dist")[0]}`, "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    let savedOutputImagePath = "";

    try {
      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const imageBuffer = Buffer.from(response.data);
      const imageExtension = imageUrl.split(".").pop();

      const allowedExtensions = ["jpg", "jpeg", "png"];
      if (!allowedExtensions.includes(imageExtension.toLowerCase())) {
        new Error("Unsupported image format. Only JPG and PNG are allowed.");
      }

      const timestamp = Date.now();
      const savedImagePath = join(uploadsDir, `checkout_${cardId}_${timestamp}.png`);

      fs.writeFileSync(savedImagePath, imageBuffer);

      const formData = new FormData();
      formData.append("image", imageBuffer, `checkout_output_ai_${cardId}_${timestamp}.png`);

      const aiResponse = await axios.post(this.config.get("service.ai"), formData, {
        headers: { ...formData.getHeaders() }
      });

      const plateFromAI = aiResponse.data["text"] ?? "";
      const outputImagePath = aiResponse.data["output_image_path"];
      const outputImageBuffer = fs.existsSync(outputImagePath) ? fs.readFileSync(outputImagePath) : null;

      if (!outputImageBuffer) {
        new Error("Output image path is invalid or not accessible.");
      }

      savedOutputImagePath = join(uploadsDir, `checkout_output_ai_${timestamp}_${cardId}.png`);
      fs.writeFileSync(savedOutputImagePath, outputImageBuffer);

      if (plateFromAI.trim() !== card.data.licensePlate.trim()) {
        new Error("License plate does not match.");
      }

    } catch (err) {
      console.error(err);
      throw new Error("An error occurred while processing the image.");
    }

    const bill = await this.billService.getDetail(card.data.user);
    if (!bill) throw new Error(Messages.bill.notFound);

    const price = handlePrice(bill.startDate, bill.price, this.handleValidate(card));
    const billUpdate = await this.billService.updateBill(bill.id + "", { billStatus: BillStatus.PAID, price: price });

    const history = await this.historyService.getHistoryByBillId(bill.id);
    if (!history) new Error(Messages.history.notFound);

    await this.historyService.updateHistory(history.id + "", { imageOut: savedOutputImagePath });
    await this.cardService.updateCard(card.data.id + "", { licensePlate: "" }, true);

    return {
      data: { ...billUpdate.data, image: savedOutputImagePath },
      message: "Thành công!"
    };
  }

  private handleValidate(card: any): boolean {
    if (!card.data.cardType.cardTypeName.includes("thang")) {
      return false;
    }
    const now = new Date();
    const newMonth = now.getMonth() + 1;
    const newYear = now.getFullYear();
    const [monthCard, yearCard] = card.data.expiration.split("-").pop()?.split("/") || [];

    return monthCard && yearCard && parseInt(monthCard, 10) >= newMonth && parseInt(yearCard, 10) === newYear;
  }
}