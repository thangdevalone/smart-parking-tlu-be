import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from './role.entity';
import { LoggerService } from 'src/logger';
import { RoleRepository } from './role.repository';
import { UserHttpModule } from '../user';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), forwardRef(() => UserHttpModule)],
  providers: [RoleService, LoggerService, RoleRepository],
  exports: [RoleService],
  controllers: [RoleController]
})
export class RoleModule {
}