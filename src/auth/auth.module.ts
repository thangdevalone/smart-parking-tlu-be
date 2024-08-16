import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RoleModule, RoleService, UserModule, UserService } from 'src/modules';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy, LocalStrategy } from './strategies';

@Module({
    imports: [RoleModule, UserModule, JwtModule.registerAsync({
        useFactory: (config: ConfigService) => ({
            secret: config.get('auth.jwt.secret'),
            signOptions: { expiresIn: '1d' },
        }),
        inject: [ConfigService],
    }),
    ],
    providers: [AuthService, UserService, RoleService, LocalStrategy, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule { }