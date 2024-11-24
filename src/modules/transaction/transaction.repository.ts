import { EntityRepository, Repository } from 'typeorm'
import { Payment } from "./transaction.entity";

@EntityRepository(Payment)
export class TransactionRepository extends Repository<Payment> {

}