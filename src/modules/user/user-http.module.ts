import { Module } from '@nestjs/common';
import { UserModule } from './user.module';  // Ensure this is correct
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [UserModule],  // Import UserModule to access UserRepository
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserHttpModule { }
