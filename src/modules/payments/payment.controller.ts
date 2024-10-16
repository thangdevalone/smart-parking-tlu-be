import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guards";
import { PaymentService } from "./payment.service";
import { CreatePaymentDTO, CreatePaymentZLPDTO, PaymentInfoQueryDto } from "./payment.dto";
import { Request, Response } from "express";
import { ReqUser } from "../../decorators";
import { Payload } from "../../auth";


@Controller("payment")

export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService) {
  }

  // vnpay

  @Get("info")
  async getPaymentInfo(
    @Query() query: PaymentInfoQueryDto,
    @Res() res: Response
  ) {
    return await this.paymentService.paymentInfoVNP(query, res);
  }

  @Post("vnp/create-payment")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createPaymentVNP(
    @Body() createPaymentDTO: CreatePaymentDTO,
    @Req() req: Request,
    @ReqUser() payload: Payload
  ) {
    return await this.paymentService.createPaymentVNP(createPaymentDTO, req, payload.id);
  }

  // zalo pay

  // @Post("zlp/create-payment")
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // async createPaymentZLP(
  //   @Body() createPaymentZLPDTO: CreatePaymentZLPDTO,
  //   @ReqUser() payload: Payload
  // ) {
  //   return await this.paymentService.createPaymentZLP(createPaymentZLPDTO, payload.id);
  // }
  //
  //
  // @Post("zlp/callback")
  // async ZLPCallBack(
  //   @Body() body: {
  //     data: string,
  //     mac: string
  //   },
  //   @Res() res: Response
  // ) {
  //   const { data, mac } = body;
  //   return await this.paymentService.callbackZLP(data, mac, res);
  // }
  //
  //
  // // momo
  //
  // @Post("mm/create-payment")
  // async createPaymentMM() {
  //   return await this.paymentService.createPaymentMM();
  // }


}
