import { EntityRepository, Repository } from 'typeorm';
import { Card } from './card.entity';

@EntityRepository(Card)
export class CardyRepository extends Repository<Card> {

}