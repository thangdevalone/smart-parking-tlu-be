import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { Role, RoleService } from '../role';
import { LoggerService } from 'src/logger';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, Role, User])
  ],
  providers: [LoggerService, RoleService],
  exports: [TypeOrmModule]
})
export class UserModule {
}
