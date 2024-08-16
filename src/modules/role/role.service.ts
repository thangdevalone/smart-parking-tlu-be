import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { BaseService } from 'src/shared';
import { LoggerService } from 'src/logger';
import { CreateRoleDto } from './role.dto';
import { Messages } from 'src/config';
import { PaginationDto } from 'src/types';
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

    public async createRole(createRole: CreateRoleDto) {

        createRole.name = createRole.name.toLowerCase();

        const oldRole = await this.index({ name: createRole.name });

        if (oldRole.length > 0) throw new Error(Messages.role.alreadyExists);

        const role = this.store(createRole);
        if (!role) throw new NotFoundException(Messages.role.notCreated);
        return {
            data: role,
            message: Messages.role.created,
        };
    }

    public async getRoles(pagination: PaginationDto) {
        return this.paginate(pagination, 'name');
    }

    public async deleteRole(id: any) {
        const result = await this.repository.delete(id);
        if (result.affected === 0) {
            throw new Error('Role not found');
        }
        return {
            message: 'Role deleted successfully',
        };
    }

    public async updateRole(id: any, updateRoleDto: any) {

        return {
            data: await this.repository.update(id, updateRoleDto),
            message: Messages.role.roleUpodated
        }
    }

    public async getRoleUser() {
        return (await this.repository.findOne({ where: { name: 'user' } }));
    }
}
