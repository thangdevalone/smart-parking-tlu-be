import { HttpStatus, Injectable } from '@nestjs/common';
import { RoleService, User, UserService } from 'src/modules';
import { JwtPayload, JwtSign, LoginDto, Payload, RegisterDto } from './auth.dtos';
import { hashSync } from 'bcrypt';
import { Messages } from 'src/config';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomPassword } from 'src/utils';
import { EmailService } from 'src/modules/mail';

@Injectable()
export class AuthService {
  constructor(
    private user: UserService,
    private role: RoleService,
    private jwt: JwtService,
    private email: EmailService,
    private config: ConfigService
  ) {
  }

  async login(data: LoginDto) {
    const { userCode, password } = data;
    const user = await this.user.validateUser(userCode, password);

    if (!user) throw new Error(Messages.auth.wrongEmailPassword);

    return {
      message: Messages.auth.loginSuccess,
      data: {
        tokens: this.signUser(user),
        user
      },
      status: HttpStatus.OK
    };

  }

  async register(data: RegisterDto) {
    const user = await this.user.findByUser(data.email, data.userCode);

    if (user) throw new Error(Messages.auth.alreadyExists);

    let role = data.role;

    role = role ?? (await this.role.getRoleUser()).id;

    if (!role) throw new Error(Messages.role.roleUserNotFound);

    const password = randomPassword(10);

    const passwordHash = hashSync(password, 10);

    const newUser = await this.user.store({ ...data, password: passwordHash, role });

    const html = `Tài khoản của bạn là ${data.userCode} \nMật khẩu của bạn là ${password}`;
    const subject = 'Cấp lại mật khẩu';
    const send = {
      to: data.email,
      html,
      subject
    };

    this.email.sendMail(send);

    return {
      data: newUser,
      message: Messages.auth.created
    };
  }

  async refreshToken(rfToken: string) {
    const payload = this.jwt.decode(rfToken) as JwtPayload;

    const user = await this.user.findById(payload.id);

    if (!user) throw new Error(Messages.auth.notFound);

    return {
      data: this.signUser(user),
      message: Messages.auth.refreshToken
    };
  }

  async forgotPassword(email: string) {
    const user = await this.user.findByEmail(email);

    if (!user) throw new Error(Messages.auth.notFound);

    const newPassword = randomPassword(10);

    const passwordHash = hashSync(newPassword, 10);

    await this.user.update(user.id, { password: passwordHash });

    const html = `Mật khẩu mới của bạn là ${newPassword}`;
    const subject = 'Cấp lại mật khẩu';
    const data = {
      to: email,
      html,
      subject
    };

    this.email.sendMail(data);

    return {
      message: Messages.auth.passwordSent
    };


  }


  public signUser(user: User) {
    return this.jwtSign({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    });
  }

  public async jwtDecode(token: string) {
    return this.jwt.decode(token);
  }

  private getRefreshToken(id: number, role: number, roleName: string): string {
    return this.jwt.sign({ id, role, roleName }, {
      secret: this.config.get('auth.jwt.refreshSecret'),
      expiresIn: '7d'
    });
  }

  private jwtSign(data: Payload): JwtSign {
    const payload: JwtPayload = {
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      role: data.role
    };
    return {
      access_token: this.jwt.sign(payload),
      refresh_token: this.getRefreshToken(payload.id, payload.role.id, payload.role.name)
    };
  }


}