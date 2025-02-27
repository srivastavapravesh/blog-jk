import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { JwtModule } from '@nestjs/jwt';
import * as fs from 'fs';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: +configService.get<number>('DB_PORT'),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    PostsModule,
    // JwtModule.registerAsync({
    //   useFactory: async (configService: ConfigService) => {
    //     const privateKeyPath = process.cwd() + '/' + configService.get<string>('JWT_PRIVATE_KEY_PATH');
    //     const publicKeyPath = process.cwd() + '/' + configService.get<string>('JWT_PUBLIC_KEY_PATH');

    //     console.log("Private Key Exists:", fs.existsSync(privateKeyPath));
    //     console.log("Public Key Exists:", fs.existsSync(publicKeyPath));

    //     return {
    //       privateKey: fs.readFileSync(privateKeyPath, 'utf8'),
    //       publicKey: fs.readFileSync(publicKeyPath, 'utf8'),
    //       signOptions: {
    //         algorithm: 'RS256',  // Use RS256 for security
    //         expiresIn: '24h',
    //       },
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
  ],
})
export class AppModule { }
