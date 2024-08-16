import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { forgotPasswordDto, LoginDto, Payload, RegisterDto, ResetPasswordDto } from './auth.dtos';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards';
import { ReqUser } from 'src/decorators';
import { UserService } from 'src/modules';
import { Messages } from 'src/config';
import { SystemRoles } from 'src/types';
import { randomPassword } from 'src/utils';
import { hashSync } from 'bcrypt';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {

    constructor(private readonly authService: AuthService, private user: UserService) { }

    @Post('login')
    public async login(@Body() data: LoginDto) {
        return await this.authService.login(data);
    }

    @Post('register')
    public async register(@Body() data: RegisterDto) {
        return await this.authService.register(data);
    }

    @Post('forgot-password')
    public async forgotPassword(@Body() data: forgotPasswordDto) {
        console.log(data);
    }

    @Post('reset-password')
    @UseGuards(JwtAuthGuard)
    public async resetPassword(@Body() data: ResetPasswordDto, @ReqUser() payload: Payload) {
        const user = await this.user.findById(data.id);
        if (!user) throw new Error(Messages.auth.notFound);

        if (user.id !== payload.id && !Object.values(SystemRoles).includes(payload.role.name as any)) throw new Error(Messages.auth.unauthorized);

        if (data.password !== data.confirmPassword) throw new Error(Messages.auth.passwordNotMatch);

        const passwordHash = hashSync(data.password, 10);

        await this.user.update(user.id, { password: passwordHash });

        return { message: Messages.auth.passwordChanged };

    }

}