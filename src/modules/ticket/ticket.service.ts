import { Injectable } from '@nestjs/common';
import { BillService } from '../bill';
import { HistoryService } from '../history';
import { CardService } from '../card';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { join, resolve } from 'path';
import * as fs from 'fs';
import { Messages } from '../../config';
import FormData from 'form-data';
import { CardTypeService } from '../cardtype';
import { handlePrice } from '../../utils';

@Injectable()
export class TicketService {
  constructor(
    private readonly billService: BillService,
    private readonly historyService: HistoryService,
    private readonly cardService: CardService,
    private readonly cardTypeService: CardTypeService,
    private config: ConfigService
  ) {
  }

  async checkin(cardId: string, imageUrl: string, withAI: boolean) {
    const card = await this.cardService.getCardDetailIdCardIOT(cardId);

    if (!card) throw new Error(Messages.card.notFound);
    if (card.data.licensePlate !== '') throw new Error('Thẻ đã checkin trước đó!!');
    if (!imageUrl) throw new Error('No image URL provided.');

    const uploadsDir = resolve(`${__dirname.split('\\dist')[0]}`, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    let savedOutputImagePath = '';
    let plate = '';

    if (withAI) {
      try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data);
        const imageExtension = imageUrl.split('.').pop();

        const allowedExtensions = ['jpg', 'jpeg', 'png'];
        if (!allowedExtensions.includes(imageExtension.toLowerCase())) {
          new Error('Unsupported image format. Only JPG and PNG are allowed.');
        }

        const timestamp = Date.now();
        const savedImagePath = join(uploadsDir, `checkin_${cardId}_${timestamp}.png`);

        fs.writeFileSync(savedImagePath, imageBuffer);

        const formData = new FormData();
        formData.append('image', imageBuffer, `checkin_${cardId}_${timestamp}.png`);

        const aiResponse = await axios.post(this.config.get('service.ai'), formData, {
          headers: { ...formData.getHeaders() }
        });

        plate = aiResponse.data['text'] ?? '';
        const outputImagePath = aiResponse.data['output_image_path'];
        const outputImageBuffer = fs.existsSync(outputImagePath) ? fs.readFileSync(outputImagePath) : null;

        if (!outputImageBuffer) {
          new Error('Output image path is invalid or not accessible.');
        }

        savedOutputImagePath = join(uploadsDir, `checkin_output_ai_${timestamp}_${cardId}.png`);
        fs.writeFileSync(savedOutputImagePath, outputImageBuffer);

      } catch (err) {
        console.error(err);
        throw new Error('An error occurred while processing the image.');
      }
    } else {
      plate = 'checkin';
      savedOutputImagePath = imageUrl;
    }

    const bill = await this.billService.findOne({ card: { id: card.data.id } });

    let history = null;

    const present = new Date();
    if (bill && bill.startDate <= present && present <= bill.endDate) {
      history = await this.historyService.createHistory(savedOutputImagePath, card.data.id + '', 0);
    } else {
      const cardType = await this.cardTypeService.findOne({ cardTypeName: 'vengay' });
      history = await this.historyService.createHistory(savedOutputImagePath, card.data.id + '', cardType.cardTypePrice);
    }

    await this.cardService.updateCard(card.data.id + '', { licensePlate: plate });

    return {
      data: {
        ...history.data,
        plate
      },
      message: 'Thành công!'
    };
  }

  async checkout(cardId: string, imageUrl: string, withAI: boolean) {
    const card = await this.cardService.getCardDetailIdCardIOT(cardId);

    if (!card) throw new Error(Messages.card.notFound);
    if (card.data.licensePlate === '') throw new Error('Chưa checkin!!');
    if (!imageUrl) throw new Error('No image URL provided.');

    const uploadsDir = resolve(`${__dirname.split('\\dist')[0]}`, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    let savedOutputImagePath = '';
    let plate;

    if (withAI) {
      try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data);
        const imageExtension = imageUrl.split('.').pop();
        const allowedExtensions = ['jpg', 'jpeg', 'png'];
        if (!allowedExtensions.includes(imageExtension.toLowerCase())) {
          new Error('Unsupported image format. Only JPG and PNG are allowed.');
        }

        const timestamp = Date.now();
        const savedImagePath = join(uploadsDir, `checkout_${cardId}_${timestamp}.png`);

        fs.writeFileSync(savedImagePath, imageBuffer);

        const formData = new FormData();
        formData.append('image', imageBuffer, `checkout_output_ai_${cardId}_${timestamp}.png`);

        const aiResponse = await axios.post(this.config.get('service.ai'), formData, {
          headers: { ...formData.getHeaders() }
        });

        const plateFromAI = aiResponse.data['text'] ?? '';
        plate = plateFromAI;
        const outputImagePath = aiResponse.data['output_image_path'];
        const outputImageBuffer = fs.existsSync(outputImagePath) ? fs.readFileSync(outputImagePath) : null;

        if (!outputImageBuffer) {
          new Error('Output image path is invalid or not accessible.');
        }

        savedOutputImagePath = join(uploadsDir, `checkout_output_ai_${timestamp}_${cardId}.png`);
        fs.writeFileSync(savedOutputImagePath, outputImageBuffer);

        if (plateFromAI.trim() !== card.data.licensePlate.trim()) {
          new Error('License plate does not match.');
        }

      } catch (err) {
        console.error(err);
        throw new Error('An error occurred while processing the image.');
      }
    } else {
      savedOutputImagePath = imageUrl;
    }

    const history = await this.historyService.getDetailHistory(card.data.id);

    if (!history) throw new Error(Messages.history.notFound);

    let price = null;

    if (history.price !== 0) {
      price = handlePrice(history.timeIn, history.price, history.price === 0);
    }

    const updateHistory = await this.historyService.updateHistory(history.id + '', {
      imageOut: savedOutputImagePath,
      price
    });
    await this.cardService.updateCard(card.data.id + '', { licensePlate: '' }, true);

    return {
      data: {
        ...updateHistory.data,
        plate
      },
      message: 'Thành công!'
    };
  }
}
