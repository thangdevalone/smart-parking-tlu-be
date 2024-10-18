import { EntityRepository, Repository } from 'typeorm';
import { CardType } from './cardtype.entity';

@EntityRepository(CardType)
export class CardTypeRepository extends Repository<CardType> {

}