import { Injectable } from '@nestjs/common';
import { Bill, BillService } from '../bill';
import { HistoryService } from '../history';
import { CardService } from '../card';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { join ,resolve} from 'path';
import * as fs from 'fs';
import { BillStatus } from 'src/types';
import { Response } from 'express';
@Injectable()
export class TicketService {

    constructor(
        private readonly billService: BillService,
        private readonly historyService: HistoryService,
        private readonly cardService: CardService,
        private config: ConfigService,
    ) {
    }

    async checkin(cardId: string, Image: Express.Multer.File) {
        const card = await this.cardService.getCardDetail(cardId);

        if (!card) throw new Error('Card not found');

        if(card.data.licensePlate !== "") throw new Error('Card is already checked in');

        const uploadsDir = resolve(`${__dirname.split('\\dist')[0]}`, 'uploads');
        // Ensure the uploads directory exists
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const imagePath = join(uploadsDir, `${Date.now()}_checkin_${Image.originalname}`);
        fs.writeFileSync(imagePath, Image.buffer);

        // const responsive = await axios.post(this.config.get('service.ai'), {
        //     image: Image
        // });

        // const plate = responsive['text'] ?? '';
        const plate =  '12';

        await this.cardService.updateCard(cardId, { licensePlate: plate });

        let monthlyCard = false;

        if (card.data.cardType.cardTypeName.includes('thang')) {
            const now = new Date();
            if (now > card.data.createdAt)
                throw new Error('Card hết hạn');
            monthlyCard = true;
        }

        const bill = await this.billService.createBill(cardId, monthlyCard ? 0 : card.data.cardType.cardTypePrice);
        const history = await this.historyService.createHistory(imagePath, bill.id + '');

        return {
            message: 'Checkin successfully',
        };

    }

    async checkout(cardId: string, Image: Express.Multer.File, Res: Response) {
        const card = await this.cardService.getCardDetail(cardId);

        if (!card) throw new Error('Card not found');

        if(card.data.licensePlate === "") throw new Error('Card is not checked in');

        const uploadsDir = resolve(`${__dirname.split('\\dist')[0]}`, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const imagePath = join(uploadsDir, `${Date.now()}_checkout_${Image.originalname}`);
        fs.writeFileSync(imagePath, Image.buffer);

        const bill = await this.billService.getDetail(card.data);
        if (!bill) throw new Error('Bill not found');

        
        await this.billService.updateBill(bill.id + '', { billStatus: BillStatus.PAID });

        const history = await this.historyService.findOne({ bill: bill.id, imageOut: null });

        if (!history) throw new Error('History not found');

        await this.historyService.updateHistory(history.id + '', { imageOut: imagePath });

        console.log(history.imageIn);

        if (!fs.existsSync(history.imageIn)) {
            throw new Error('Checkin image not found');
        }
        Res.sendFile(history.imageIn);

        await this.cardService.updateCard(cardId, { licensePlate: "" });

        return {
            message: 'Checkout successfully',
        };
    }
}