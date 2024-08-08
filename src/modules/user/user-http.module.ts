import { Module } from '@nestjs/common'
import { UserModule } from './user.module'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
  imports: [UserModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserHttpModule {
}