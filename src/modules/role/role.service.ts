import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { BaseService } from 'src/shared';
import { LoggerService } from 'src/logger';
import { CreateRoleDto, UpdateRoleDto } from './role.dto';
import { Messages } from 'src/config';
import { PaginationDto, Roles, SystemRoles } from 'src/types';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService extends BaseService<Role, RoleRepository> {
    constructor(
        @InjectRepository(Role)
        protected readonly repository: Repository<Role>,
        protected readonly logger: LoggerService,
    ) {
        super(repository, logger);
    }

    public async createRole(createRole: CreateRoleDto, isAdmin: boolean) {

        createRole.name = createRole.name.toLowerCase();

        const oldRole = await this.index({ name: createRole.name });

        if (oldRole.length > 0) throw new Error(Messages.role.alreadyExists);

        if (createRole.name === SystemRoles.ADMIN && !isAdmin) throw new Error(Messages.common.actionNotPermitted)

        const role = this.store(createRole);
        if (!role) throw new NotFoundException(Messages.role.notCreated);
        return {
            data: role,
            message: Messages.role.created,
        };
    }

    public async getRoles(pagination: PaginationDto) {
        return this.paginate(pagination, 'name','name','admin');
    }

    public async deleteRole(ids: number[]) {
        const result = await this.deleteMultiple(ids,Role);
        return {
            message: 'Role deleted successfully',
        };
    }

    public async updateRole(id: any, updateRoleDto: UpdateRoleDto) {

        const role = await this.repository.findOne({ where: { id: +id } });

        if (!role) throw new Error('Role not found');

        Object.assign(role, updateRoleDto);

        await this.repository.save(role);

        return {
            data: role,
            message: Messages.role.roleUpodated
        }
    }

    public async getRoleUser() {
        return (await this.repository.findOne({ where: { name: Roles.USER } }));
    }

    public async getAllRole() {
        const roles = await this.repository.find();
        return roles.map(role => ({value:role.name, id:role.id}));
    }
}
