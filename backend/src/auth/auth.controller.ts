import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Res() res: Response, @Body() body: any) {
    const { provider, providerId, email, name } = body;
    const user = await this.authService.validateUser(
      provider, // it can be google or facebook
      providerId,
      email,
      name,
    );
    const data = await this.authService.login(user);
    return res.status(200).json(data);
  }
}
