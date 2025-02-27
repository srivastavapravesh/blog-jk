import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client('305232548719-ji8avor2m2q0birhdfimv02acbleneh5.apps.googleusercontent.com');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async validateUser(
    provider: string,
    providerId: string,
    name: string,
    email: string,
  ): Promise<any> {
    let user = await this.usersRepository.findOne({
      where: { provider, providerId },
    });
    if (!user) {
      user = this.usersRepository.create({ provider, providerId, email, name });
      await this.usersRepository.save(user);
    }
    return user;
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload = { id: user.id, sub: user.providerId, name: user.name, email: user.email, provider: 'google' };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }

  async verifyGoogleToken(token): Promise<any> {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '305232548719-ji8avor2m2q0birhdfimv02acbleneh5.apps.googleusercontent.com'
      });
      const payload = ticket.getPayload();
      console.log('Google payload:', payload);
      return payload;
    } catch (error) {
      console.error('Error verifying Google token:', error);
      throw new Error('Invalid token');
    }
  }

  verifyFacebookToken(token: string) {
    throw new Error('Method not implemented.');
  }

}
