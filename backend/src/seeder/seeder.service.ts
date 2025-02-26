import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Post } from '../posts/posts.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  /**
   * Seeds the database with fake users.
   * @param count - Number of fake users to create.
   */
  async seedUsers(count: number) {
    const users = [];
    for (let i = 0; i < count; i++) {
      const user = this.usersRepository.create({
        provider: 'test',
        providerId: `test${i}`,
        name: faker.person.fullName(), // Changed from username to fullName for realistic names
        email: faker.internet.email(),
      });
      users.push(user);
    }
    console.log('users', users);
    await this.usersRepository.save(users);
  }

  /**
   * Seeds the database with fake posts for existing users.
   * @param userCount - Number of users to create posts for.
   * @param postsPerUser - Number of posts per user.
   */
  async seedPosts(userCount: number, postsPerUser: number) {
    const users = await this.usersRepository.find();
    const posts = [];
    for (const user of users) {
      for (let i = 0; i < postsPerUser; i++) {
        const post = this.postsRepository.create({
          title: faker.lorem.sentence(),
          body: faker.lorem.paragraphs(2),
          user,
        });
        posts.push(post);
      }
    }
    await this.postsRepository.save(posts);
  }
}
