import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { RoleService } from "./role.service";
import { CreateRoleDto, UpdateRoleDto } from "./role.dto";
import { Pagination, ReqUser } from "src/decorators";
import { PaginationDto, SystemRoles } from "src/types";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { AdminRequired, ManageOrAdminRequired } from "../user/decorators/permission.decorator";
import { JwtAuthGuard } from "src/auth/guards";
import { Payload } from "src/auth";

// @UseInterceptors(ClassSerializerInterceptor)
@Controller('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Post()
    @ManageOrAdminRequired()
    public async createRole(
        @Body() createRole: CreateRoleDto,
        @ReqUser() payload: Payload
    ) {
        const isAdmin = payload.role.name === SystemRoles.ADMIN
        return this.roleService.createRole(createRole, isAdmin);
    }

    @Get()
    @ManageOrAdminRequired()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'sortBy', required: false, type: String })
    @ApiQuery({ name: 'sortType', required: false, type: String })
    public async getRoles(
        @Pagination() pagination: PaginationDto,
    ) {
        return this.roleService.getRoles(pagination);
    }

    @Delete(':idRole')
    @ManageOrAdminRequired()
    public async deleteRole(
        @Param('idRole') idRole: string,
    ) {
        return await this.roleService.deleteRole(idRole);
    }

    @Patch(':idRole')
    @ManageOrAdminRequired()
    public async updateRole(
        @Param('idRole') idRole: string,
        @Body() data: UpdateRoleDto
    ) {
        return await this.roleService.updateRole(idRole, data);
    }

}