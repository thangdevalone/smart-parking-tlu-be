import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { BillService } from "./bill.service";
import { CreateBillDto, UpdateBillDto } from "./bill.dto";

@Controller('bills')
export class BillController {
    constructor(
        private readonly billService: BillService,
    ) {
    }

    @Get()
    async getAll() {
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
    }

    @Post()
    async create(@Body() createBillDto: CreateBillDto) {
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateBillDto: UpdateBillDto) {
    }



}