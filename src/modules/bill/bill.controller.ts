import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { BillService } from "./bill.service";
import { UpdateBillDto } from "./bill.dto";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards";
import { GuardOrAdminRequired } from "../user";
import { Pagination, ReqUser } from "src/decorators";
import { PaginationDto } from "src/types";
import { Payload } from "../../auth";

@Controller("bills")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BillController {
  constructor(
    private readonly billService: BillService
  ) {
  }

  @Get()
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "sortBy", required: false, type: String })
  @ApiQuery({ name: "sortType", required: false, type: String })
  async getAll(
    @Pagination() pagination: PaginationDto,
    @ReqUser() payload: Payload
  ) {
    return await this.billService.paginateBill(payload, pagination);
  }

  @Get(":id")
  async getById(@Param("id") id: string) {
    return {
      data: await this.billService.findOne({ id })
    };
  }

  @Patch(":id")
  @GuardOrAdminRequired()
  async update(@Param("id") id: string, @Body() updateBillDto: UpdateBillDto) {
    return await this.billService.updateBill(id, updateBillDto);
  }
}