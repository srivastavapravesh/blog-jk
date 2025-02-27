import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: fs.readFileSync(process.cwd() + '/' + configService.get<string>('JWT_PUBLIC_KEY_PATH'), 'utf8'),
      algorithms: ['RS256'], // Use RS256 algorithm
    });
  }

  async validate(payload: any) {
    // console.log('JWT Payload:', payload);
    return { id: payload.id, name: payload.name, email: payload.email, provider: payload.provider, sub: payload.sub };
  }
}
