import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { forgotPasswordDto, LoginDto, Payload, refreshTokenDto, RegisterDto, ResetPasswordDto } from './auth.dtos';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards';
import { ReqUser } from 'src/decorators';
import { UserService } from 'src/modules';
import { Messages } from 'src/config';
import { SystemRoles } from 'src/types';
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
        const { email } = data;
        return await this.authService.forgotPassword(email);
    }

    @Post('refresh-token')
    public async refreshToken(
        @Body() data: refreshTokenDto,
    ) {
        return await this.authService.refreshToken(data.refreshToken);
    }

    @Post()
    public async logout() { }

    @Post('reset-password')
    @UseGuards(JwtAuthGuard)
    public async resetPassword(@Body() data: ResetPasswordDto, @ReqUser() payload: Payload) {
        const user = await this.user.findById(data.id);
        if (!user) throw new Error(Messages.auth.notFound);

        if (user.id !== payload.id && ![SystemRoles.ADMIN, SystemRoles.MANAGE].includes(payload.role.name as any)) throw new Error(Messages.auth.unauthorized);

        if (data.password !== data.confirmPassword) throw new Error(Messages.auth.passwordNotMatch);

        const passwordHash = hashSync(data.password, 10);

        await this.user.update(user.id, { password: passwordHash });

        return { message: Messages.auth.passwordChanged };

    }

}