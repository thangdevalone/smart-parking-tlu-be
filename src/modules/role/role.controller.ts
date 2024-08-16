import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Patch, Post, UseInterceptors } from "@nestjs/common";
import { RoleService } from "./role.service";
import { create } from "domain";
import { CreateRoleDto } from "./role.dto";
import { Pagination } from "src/decorators";
import { PaginationDto } from "src/types";
import { ApiQuery } from "@nestjs/swagger";

@UseInterceptors(ClassSerializerInterceptor)
@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Post()
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
        console.log(pagination)
        return this.roleService.getRoles(pagination);
    }

    @Delete(':idRole')
    public async deleteRole() { }

    @Patch('idRole')
    public async updateRole() { }

}