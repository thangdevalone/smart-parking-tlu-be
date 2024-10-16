import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guards";
import { PaymentService } from "./payment.service";
import { CreatePaymentDTO, PaymentInfoQueryDto } from "./payment.dto";
import { Request, Response } from "express";
import { ReqUser } from "../../decorators";
import { Payload } from "../../auth";


@Controller("payment")

export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService) {
  }

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

  @Post("zlp/create-payment")
  async createPaymentZLP() {
  }

  @Post("mm/create-payment")
  async createPaymentMM() {
  }


}
