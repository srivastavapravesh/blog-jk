import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import * as fs from 'fs';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const privateKeyPath = process.cwd() + '/' + configService.get<string>('JWT_PRIVATE_KEY_PATH');
        const publicKeyPath = process.cwd() + '/' + configService.get<string>('JWT_PUBLIC_KEY_PATH');

        console.log("Private Key Exists :", fs.existsSync(privateKeyPath));
        console.log("Public Key Exists:", fs.existsSync(publicKeyPath));

        return {
          privateKey: fs.readFileSync(privateKeyPath, 'utf8'),
          publicKey: fs.readFileSync(publicKeyPath, 'utf8'),
          signOptions: {
            algorithm: 'RS256',  // Use RS256 for security
            expiresIn: '24h',
          },
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule { }
