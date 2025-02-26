import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Post } from '../posts/posts.entity';
import { SeederService } from './seeder.service';
import { SeederCommand } from './seeder.command';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post])],
  providers: [SeederService, SeederCommand],
})
export class SeederModule {}
