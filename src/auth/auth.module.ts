import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RoleModule, RoleService, UserModule, UserService } from 'src/modules';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy, LocalStrategy } from './strategies';
import { EmailService, MailModule } from 'src/modules/mail';

@Module({
    imports: [RoleModule, UserModule, MailModule, JwtModule.registerAsync({
        useFactory: (config: ConfigService) => ({
            secret: config.get('auth.jwt.secret'),
            signOptions: { expiresIn: '1d' },
        }),
        inject: [ConfigService],
    }),
    ],
    providers: [AuthService, UserService, RoleService, EmailService, LocalStrategy, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule { }