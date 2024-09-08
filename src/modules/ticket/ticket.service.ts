import { Injectable } from '@nestjs/common';
import { Bill, BillService } from '../bill';
import { HistoryService } from '../history';
import { CardService } from '../card';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

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

        const responsive = await axios.post(this.config.get('service.ai'), {
            image: Image
        });

        const plate = responsive['text'] ?? '';

        await this.cardService.updateCard(cardId, { licensePlate: plate });

        const history = await this.historyService.createHistory('');

        const bill = await this.billService.createBill(cardId, card.data.cardType.cardTypePrice, history.data.id + '');

        return {
            data: bill,
            message: 'Checkin successfully',
        };

    }

    async checkout(cardId: string, Image: Express.Multer.File) { }
}