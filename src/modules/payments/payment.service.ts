import { Injectable, NotFoundException } from "@nestjs/common";
import { Request, Response } from "express";
import { CreatePaymentDTO, CreatePaymentUserDTO, PaymentInfoQueryDto, PaymentStatus } from "./payment.dto";
import moment from "moment";
import { ConfigService } from "@nestjs/config";
import * as querystring from "qs";
import * as crypto from "node:crypto";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "./payment.entity";
import { PaymentRepository } from "./payment.repository";
import { BillRepository } from "../bill/bill.repository";
import { CardRepository } from "../card/card.repository";
import { User, UserRepository } from "../user";
import { Bill } from "../bill";
import { Card } from "../card";
import { BillStatus, CardStatus } from "../../types";
import { CardTypeRepository } from "../cardtype/cardtype.repository";
import { CardType } from "../cardtype";
import { Payload } from "../../auth";
import { Messages } from "../../config";

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) protected readonly paymentRepository: PaymentRepository,
    @InjectRepository(Bill) private readonly billRepository: BillRepository,
    @InjectRepository(Card) private readonly cardRepository: CardRepository,
    @InjectRepository(User) private readonly userRepository: UserRepository,
    @InjectRepository(CardType) private readonly cardTypeRepository: CardTypeRepository,
    private readonly config: ConfigService) {
  }

  async createPaymentUser(payload: Payload, createPaymentUserDTO: CreatePaymentUserDTO) {
    if (payload.role.name.toLowerCase() !== "admin") throw new NotFoundException(Messages.common.actionNotPermitted);

    const user = await this.userRepository.findOne({ where: { id: payload.id } });

    if (!user) throw new NotFoundException(Messages.auth.notFound);

    const cardType = await this.cardTypeRepository.findOne({ where: { cardTypeName: "vethang" } });
    const card = await this.cardRepository.findOne({ where: { cardType, user: null } });
    if (card && card.cardStatus === CardStatus.ACTIVE) {
      const newDate = new Date();
      card.user = user;
      card.expiration = `${newDate.getMonth()}/${newDate.getFullYear()}`;
      await this.cardRepository.save(card);
      const bill = this.billRepository.create({
        user: user,
        billStatus: BillStatus.PAID,
        startDate: new Date(),
        endDate: new Date(),
        price: cardType.cardTypePrice
      });
      await this.billRepository.save(bill);
    }

    return true;

  }

  async createPaymentVNP(createPaymentDTO: CreatePaymentDTO, req: Request, user: number) {

    const userEntity = await this.userRepository.findOne({ where: { id: user } });
    console.log("userEntity", userEntity);
    const isValidate = await this.handleValidate(userEntity) as unknown as boolean;
    console.log("isValidate", isValidate);
    if (isValidate) throw new NotFoundException("Bạn đã gia hạn tháng này!");

    const date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr = req.headers["x-forwarded-for"] || "192.168.1.1";

    const tmnCode = this.config.get("payment.vnp.tmnCode");
    const secretKey = this.config.get("payment.vnp.hashSecret");
    let vnpUrl = this.config.get("payment.vnp.url");
    const returnUrl = this.config.get("payment.vnp.returnUrl");

    let orderId = moment(date).format("DDHHmmss");

    const { amount, language, bankCode } = createPaymentDTO;

    const locale = language || "vn";

    const currCode = "VND";

    let vnp_Params: any = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan cho ma GD: ${orderId}`,
      vnp_OrderType: "other",
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl || "http://localhost:8080/payment/info",
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate
    };
    if (bankCode !== null && bankCode !== "") vnp_Params["vnp_BankCode"] = bankCode;

    vnp_Params = this.sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    vnp_Params["vnp_SecureHash"] = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    const payment = await this.createPayment(userEntity, amount, orderId, bankCode);

    if (payment) {
      return vnpUrl;
    }
    throw new Error("Lỗi hệ thống");

  }

  async paymentInfoVNP(queryDTO: PaymentInfoQueryDto, res: Response) {
    const {
      vnp_BankTranNo,
      vnp_ResponseCode,
      vnp_CardType,
      vnp_TxnRef,
      vnp_TransactionNo
    } = queryDTO;

    if (vnp_ResponseCode === "00") {
      const payment = await this.paymentRepository.findOne({ where: { txnRef: vnp_TxnRef }, relations: ["user"] });
      if (payment) {
        const card = await this.cardRepository.findOne({ where: { user: payment.user } });
        if (card) {
          const newDate = new Date();
          card.expiration += `-${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
          await this.cardRepository.save(card);
          const bill = this.billRepository.create({
            user: payment.user,
            billStatus: BillStatus.PAID,
            startDate: new Date(),
            endDate: new Date(),
            price: payment.amount
          });
          await this.billRepository.save(bill);
        } else {
          const cardType = await this.cardTypeRepository.findOne({ where: { cardTypeName: "vethang" } });
          const card = await this.cardRepository.findOne({ where: { cardType, user: null } });
          if (card && card.cardStatus === CardStatus.ACTIVE) {
            const newDate = new Date();
            card.user = payment.user;
            card.expiration = `${newDate.getMonth()}/${newDate.getFullYear()}`;
            await this.cardRepository.save(card);
            const bill = this.billRepository.create({
              user: payment.user,
              billStatus: BillStatus.PAID,
              startDate: new Date(),
              endDate: new Date(),
              price: payment.amount
            });
            await this.billRepository.save(bill);
          } else {
            return res.redirect("http://localhost:5173/admin/payment/pay?statusPayment=04");
          }
        }
        payment.status = PaymentStatus.COMPLETED;
        payment.updatedAt = new Date();
        payment.bankTranNo = vnp_BankTranNo;
        payment.cardType = vnp_CardType;
        payment.transactionNo = vnp_TransactionNo;
        await this.paymentRepository.save(payment);
        return res.redirect("http://localhost:5173/admin/payment/pay?statusPayment=00");
      }
    } else {
      return res.redirect("http://localhost:5173/admin/payment/pay?statusPayment=04");
    }
  }

  // private function

  private async handleValidate(user: User) {
    const card = await this.cardRepository.findOne({ where: { user: user } });
    if (card) {
      const expCard = card.expiration.split("-");
      const dateCard = expCard[expCard.length - 1];
      const [monthCard, yearCard] = dateCard.split("/");
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      if (parseInt(monthCard, 10) === currentMonth && parseInt(yearCard, 10) === currentYear) {
        return true;
      }
    }
    return false;
  }

  private async createPayment(userEntity: User, amount: number, orderId: string, bankCode?: string) {
    const payment = this.paymentRepository.create({
      createdAt: new Date(),
      updatedAt: null,
      amount,
      bankCode: bankCode || "",
      orderInfo: `Thanh toan cho ma GD: ${orderId}`,
      payDate: new Date().toISOString(),
      txnRef: orderId,
      status: PaymentStatus.PENDING,
      user: userEntity
    });
    await this.paymentRepository.save(payment);
    return payment;
  }

  private sortObject(data: any) {
    let sorted = {};
    let str = [];
    let key: any;
    for (key in data) {
      if (data.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(data[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }

}