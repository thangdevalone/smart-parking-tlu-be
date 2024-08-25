import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from 'src/logger';
import { Repository } from 'typeorm';
import { UserRepository } from './user.repository';
import { compare } from 'bcrypt';
import { PaginationDto } from 'src/types';
import { UpdateUserDto } from './user.dto';

@Injectable()
export class UserService extends BaseService<User, UserRepository> {
    constructor(
        @InjectRepository(User)
        protected readonly repository: Repository<User>,
        protected readonly logger: LoggerService,
    ) {
        super(repository, logger);
    }

    async getUsers(pagination: PaginationDto) {
        return this.paginate(pagination, 'fullName');
    }

    async updateUser(id: string, updateUser: UpdateUserDto) {
        const user = await this.repository.findOne({ where: { id: +id } });

        if (!user) throw new Error('User not found');

        Object.assign(user, updateUser);

        await this.repository.save(user);

        return {
            data: user,
            message: 'User updated successfully',
        };

    }

    async findByUser(email: string, userCode: string) {
        return await this.repository.findOne({ where: { email, userCode } });
    }

    async findByEmail(email: string) {
        return await this.repository.findOne({ where: { email } });
    }

    async findById(id: number) {
        const user = await this.repository.createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'role')
            .where('user.id = :id', { id })
            .addSelect(['role.id', 'role.name'])
            .getOne();

        return user;
    }

    async validateUser(email: string, password: string) {
        const user = await this.repository.createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'role')
            .where('user.email = :email', { email })
            .addSelect(['role.id', 'role.name'])
            .getOne();

        if (!user) return null;
        if (!user.password || user.password === '') throw new HttpException('USER_LOGIN_SSO', HttpStatus.FORBIDDEN);
        const isValidPassword = await compare(password, user.password);

        if (isValidPassword) {
            delete user.password;
            return user;
        }
        return null;
    }

    async deleteUser(id: string) {
        const result = await this.repository.delete(id);
        if (result.affected === 0) {
            throw new Error('User not found');
        }
        return {
            message: 'User deleted successfully',
        };
    }
}
