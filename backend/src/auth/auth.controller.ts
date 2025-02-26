import { Controller, Post, Body, Res, UsePipes, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login or register user via provider and return access token' })
  @ApiResponse({ status: 201, description: 'login successfull.' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Res() res: Response, @Body() body: LoginDto) {
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
