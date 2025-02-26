import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Injectable()
export class SeederCommand {
  constructor(private seederService: SeederService) {}

  @Command({
    command: 'seed:database',
    describe: 'Seed database with test data',
  })
  async seed() {
    try {
      console.log('Seeding started...');
      await this.seederService.seedUsers(10);
      await this.seederService.seedPosts(10, 10);
      console.log('Database seeded successfully');
    } catch (error) {
      console.error(error);
    }
  }
}
