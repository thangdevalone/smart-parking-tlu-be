import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from 'src/logger';
import { Repository } from 'typeorm';
import { UserRepository } from './user.repository';
import { compare } from 'bcrypt';

@Injectable()
export class UserService extends BaseService<User, UserRepository> {
    constructor(
        @InjectRepository(User)
        protected readonly repository: Repository<User>,
        protected readonly logger: LoggerService,
    ) {
        super(repository, logger);
    }

    async findByUser(email: string, userCode: string) {
        return await this.repository.findOne({ where: { email, userCode } });
    }

    async findByEmail(email: string) {
        return await this.repository.findOne({ where: { email } });
    }

    async findById(id: number) {
        return await this.repository.findOne({ where: { id } });
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
}
