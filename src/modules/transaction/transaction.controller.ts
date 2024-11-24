import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards';
import { TransactionService } from './transaction.service';
import { CreatePaymentDTO, CreatePaymentUserDTO, PaymentInfoQueryDto } from './transaction.dto';
import { Request, Response } from 'express';
import { ReqUser } from '../../decorators';
import { Payload } from '../../auth';


@Controller('payment')

export class TransactionController {
  constructor(
    private readonly paymentService: TransactionService) {
  }

  @Get('info')
  async getPaymentInfo(
    @Query() query: PaymentInfoQueryDto,
    @Res() res: Response
  ) {
    return await this.paymentService.paymentInfoVNP(query, res);
  }

  @Post('vnp/create-payment')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createPaymentVNP(
    @Body() createPaymentDTO: CreatePaymentDTO,
    @Req() req: Request,
    @ReqUser() payload: Payload
  ) {
    return await this.paymentService.createPaymentVNP(createPaymentDTO, req, payload.id);
  }

  @Post('create-payment-user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createPaymentUser(
    @Body() createPaymentUserDTO: CreatePaymentUserDTO,
    @ReqUser() payload: Payload
  ) {
    return await this.paymentService.createPaymentUser(payload, createPaymentUserDTO);
  }

}
