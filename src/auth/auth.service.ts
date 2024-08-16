import { HttpStatus, Injectable } from '@nestjs/common';
import { RoleService, User, UserService } from 'src/modules';
import { JwtPayload, LoginDto, Payload, RegisterDto, JwtSign } from './auth.dtos';
import { hashSync } from 'bcrypt';
import { Messages } from 'src/config';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private user: UserService,
        private role: RoleService,
        private jwt: JwtService,
        private config: ConfigService,
    ) { }

    async login(data: LoginDto) {
        const { email, password } = data;
        const user = await this.user.validateUser(email, password);

        if (!user) throw new Error(Messages.auth.wrongEmailPassword);

        return {
            message: Messages.auth.loginSuccess,
            data: this.signUser(user),
            status: HttpStatus.OK
        };

    }

    async register(data: RegisterDto) {
        const user = await this.user.findByUser(data.email, data.userCode);

        if (user) throw new Error(Messages.auth.alreadyExists);

        if (data.password !== data.confirmPassword) throw new Error(Messages.auth.passwordNotMatch);

        let role = data.role

        role = role ?? (await this.role.getRoleUser()).id;

        if (!role) throw new Error(Messages.role.roleUserNotFound);

        const passwordHash = hashSync(data.confirmPassword, 10);

        delete data.confirmPassword;

        const newUser = await this.user.store({ ...data, password: passwordHash, role });

        return {
            data: newUser,
            message: Messages.auth.created
        }
    }

    async forgotPassword(email: string) {

    }


    public signUser(user: User) {
        return this.jwtSign({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        });
    }

    public async jwtDecode(token: string) {
        return this.jwt.decode(token);
    }

    private getRefreshToken(id: number, role: number, roleName: string): string {
        return this.jwt.sign({ id, role, roleName }, {
            secret: this.config.get('auth.jwt.refreshSecret'),
            expiresIn: '7d',
        });
    }

    private jwtSign(data: Payload): JwtSign {
        const payload: JwtPayload = {
            id: data.id,
            fullName: data.fullName,
            email: data.email,
            role: data.role,
        };
        return {
            access_token: this.jwt.sign(payload),
            refresh_token: this.getRefreshToken(payload.id, payload.role.id, payload.role.name),
        };
    }


}