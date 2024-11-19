import { Injectable } from '@nestjs/common';
import { BillService } from '../bill';
import { HistoryService } from '../history';
import { CardService } from '../card';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { join, resolve } from 'path';
import * as fs from 'fs';
import { BillStatus } from '../../types';
import { Messages } from '../../config';
import FormData from 'form-data';
import { handlePrice } from '../../utils';

@Injectable()
export class TicketService {
  constructor(
    private readonly billService: BillService,
    private readonly historyService: HistoryService,
    private readonly cardService: CardService,
    private config: ConfigService
  ) {}

  async checkin(cardId: string, imageUrl: string) {
    const card = await this.cardService.getCardDetail(cardId);

    if (!card) throw new Error(Messages.card.notFound);

    if (card.data.licensePlate !== '') throw new Error('Thẻ đã checkin trước đó!!');

    if (!imageUrl) {
      throw new Error('No image URL provided.');
    }

    const uploadsDir = resolve(`${__dirname.split('\\dist')[0]}`, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    try {
      // Download the image using axios
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer'
      });

      const imageBuffer = Buffer.from(response.data);
      const imageExtension = imageUrl.split('.').pop(); // Extract the file extension
      const savedImagePath = join(uploadsDir, `image_${Date.now()}.${imageExtension}`);

      // Save the image locally
      fs.writeFileSync(savedImagePath, imageBuffer);

      // Process the image
      const formData = new FormData();
      formData.append('image', imageBuffer, `image.${imageExtension}`);

      const aiResponse = await axios.post(this.config.get('service.ai'), formData, {
        headers: {
          ...formData.getHeaders()
        }
      });

      const plate = aiResponse.data['text'] ?? '';
      const outputImagePath = aiResponse.data['output_image_path'];
      const outputImageBuffer = fs.readFileSync(outputImagePath);

      const savedOutputImagePath = join(uploadsDir, `output_${Date.now()}_${imageExtension}`);
      fs.writeFileSync(savedOutputImagePath, outputImageBuffer);

      await this.cardService.updateCard(cardId, { licensePlate: plate });
      const bill = await this.billService.createBill(
        card.data.user.id,
        this.handleValidate(card) ? 0 : card.data.cardType.cardTypePrice
      );
      await this.historyService.createHistory(savedOutputImagePath, bill.id + '');

      return {
        data: {
          ...bill,
          image: savedOutputImagePath
        },
        message: 'Thành công!'
      };
    } catch (err) {
      console.error(err);
      throw new Error('An error occurred while processing the image.');
    }
  }

  async checkout(cardId: string, imageUrl: string) {
    const card = await this.cardService.getCardDetail(cardId);

    if (!card) throw new Error(Messages.card.notFound);

    if (card.data.licensePlate === '') throw new Error('Chưa checkin!!');

    if (!imageUrl) {
      throw new Error('No image URL provided.');
    }

    const uploadsDir = resolve(`${__dirname.split('\\dist')[0]}`, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    try {
      // Download the image using axios
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer' // Get the raw binary image data
      });

      const imageBuffer = Buffer.from(response.data);
      const imageExtension = imageUrl.split('.').pop(); // Get the file extension (jpg, jpeg, png)
      const savedImagePath = join(uploadsDir, `image_${Date.now()}.${imageExtension}`);

      // Save the image locally
      fs.writeFileSync(savedImagePath, imageBuffer);

      // Process the image with AI service
      const formData = new FormData();
      formData.append('image', imageBuffer, `image.${imageExtension}`);

      const aiResponse = await axios.post(this.config.get('service.ai'), formData, {
        headers: {
          ...formData.getHeaders()
        }
      });

      const plateFromAI = aiResponse.data['text'] ?? '';
      const outputImagePath = aiResponse.data['output_image_path'];

      const outputImageBuffer = fs.readFileSync(outputImagePath);
      const savedOutputImagePath = join(uploadsDir, `output_${Date.now()}_${imageExtension}`);
      fs.writeFileSync(savedOutputImagePath, outputImageBuffer);

      // Check if the AI detected license plate matches the card's license plate
      if (plateFromAI.trim() !== card.data.licensePlate.trim()) {
        throw new Error('License plate does not match.');
      }

      // Get the bill details
      const bill = await this.billService.getDetail(card.data.user);

      if (!bill) {
        throw new Error(Messages.bill.notFound);
      }

      // Handle price calculation based on the bill
      const price = handlePrice(bill.startDate, bill.price, this.handleValidate(card));

      // Update the bill status to PAID
      const billUpdate = await this.billService.updateBill(bill.id + '', { billStatus: BillStatus.PAID, price: price });

      // Retrieve the history record associated with the bill
      const history = await this.historyService.getHistoryByBillId(bill.id);

      if (!history) {
        throw new Error(Messages.history.notFound);
      }

      // Update the history with the image of the checkout
      await this.historyService.updateHistory(history.id + '', { imageOut: savedOutputImagePath });

      // Clear the card's license plate after checkout
      await this.cardService.updateCard(cardId, { licensePlate: '' }, true);

      return {
        data: {
          ...billUpdate.data,
          image: savedOutputImagePath
        },
        message: 'Thành công!'
      };
    } catch (err) {
      console.error(err);
      throw new Error('An error occurred while processing the image.');
    }
  }

  private handleValidate(card: any): boolean {
    if (!card.data.cardType.cardTypeName.includes('thang')) {
      return false;
    }
    const now = new Date();
    const newMonth = now.getMonth() + 1;
    const newYear = now.getFullYear();
    const [monthCard, yearCard] = card.data.expiration.split('-').pop()?.split('/') || [];

    return monthCard && yearCard && parseInt(monthCard, 10) >= newMonth && parseInt(yearCard, 10) === newYear;
  }
}
