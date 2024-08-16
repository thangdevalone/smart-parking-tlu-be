import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { JwtPayload, Payload } from '../auth.dtos';
// import { Messages } from "../../../../base";
// import { DbService } from '../../db';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private config: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('auth.jwt.secret'),
        });
    }

    public async validate(payload: JwtPayload): Promise<Payload> {
        return {
            id: payload.id,
            fullName: payload.fullName,
            email: payload.email,
            role: payload.role,
        };
    }
}

