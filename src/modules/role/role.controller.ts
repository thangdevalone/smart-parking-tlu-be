import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from "@nestjs/common";
import { RoleService } from "./role.service";
import { CreateRoleDto, UpdateRoleDto } from "./role.dto";
import { Pagination } from "src/decorators";
import { PaginationDto } from "src/types";
import { ApiQuery } from "@nestjs/swagger";
import { AdminRequired, ManageOrAdminRequired } from "../user/decorators/permission.decorator";

@UseInterceptors(ClassSerializerInterceptor)
@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Post()
        // @ManageOrAdminRequired()
    public async createRole(
        @Body() createRole: CreateRoleDto,
    ) {
        return this.roleService.createRole(createRole);
    }

    @Get()
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
    public async deleteRole(
        @Param('idRole') idRole: string,
    ) {
        return await this.roleService.deleteRole(idRole);
    }

    @Patch(':idRole')
    public async updateRole(
        @Param('idRole') idRole: string,
        @Body() data: UpdateRoleDto
    ) {
        return await this.roleService.updateRole(idRole, data);
    }

}