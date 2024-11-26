import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guards";
import { TransactionService } from "./transaction.service";
import { CreatePaymentDTO, CreatePaymentUserDTO, PaymentInfoQueryDto } from "./transaction.dto";
import { Request, Response } from "express";
import { Pagination, ReqUser } from "../../decorators";
import { Payload } from "../../auth";
import { PaginationDto } from "../../types";


@Controller("payment")
export class TransactionController {
  constructor(
    private readonly paymentService: TransactionService) {
  }

  @Get("info")
  async getPaymentInfo(
    @Query() query: PaymentInfoQueryDto,
    @Res() res: Response
  ) {
    return await this.paymentService.paymentInfoVNP(query, res);
  }


  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "sortBy", required: false, type: String })
  @ApiQuery({ name: "sortType", required: false, type: String })
  public async paginationPayment(
    @Pagination() pagination: PaginationDto,
    @ReqUser() payload: Payload
  ) {
    return await this.paymentService.paginationPayment(pagination, payload.id, payload.role.name !== "admin");
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

  @Post("create-payment-user")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createPaymentUser(
    @Body() createPaymentUserDTO: CreatePaymentUserDTO,
    @ReqUser() payload: Payload
  ) {
    return await this.paymentService.createPaymentUser(payload, createPaymentUserDTO);
  }

}
