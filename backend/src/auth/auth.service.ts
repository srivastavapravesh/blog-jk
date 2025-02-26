import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

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
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
