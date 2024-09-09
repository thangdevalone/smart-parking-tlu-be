import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AdminRequired } from "./decorators";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { Pagination, ReqUser } from "src/decorators";
import { Payload } from "src/auth";
import { UpdateUserDto } from "./user.dto";
import { DeleteMultipleDto, PaginationDto, SystemRoles } from "src/types";
import { JwtAuthGuard } from "src/auth/guards";

@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @AdminRequired()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'sortBy', required: false, type: String })
    @ApiQuery({ name: 'sortType', required: false, type: String })
    async getUsers(
        @Pagination() pagination: PaginationDto,
    ) {
        return await this.userService.getUsers(pagination);
    }

    @Get(':id')
    @AdminRequired()
    async getUser(
        @Param('id') id: string
    ) {
        return await this.userService.findById(+id)
    }

    @Patch(':id')
    async updateUser(
        @Param('id') id: string,
        @ReqUser() user: Payload,
        @Body() updateUserDto: UpdateUserDto
    ) {
        if (id !== user.id.toString() && user.role.name !== SystemRoles.ADMIN) throw new Error('Unauthorized');
        return await this.userService.updateUser(id, updateUserDto);
    }

    // @Delete()
    // @AdminRequired()
    // async deleteUser(
    //     @Body() deleteUserDto :DeleteMultipleDto
    // ) {
    //     return await this.userService.deleteUser(deleteUserDto.ids);
    // }


}