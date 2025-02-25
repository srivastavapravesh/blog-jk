import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './posts.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async findAll(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ posts: Post[]; total: number }> {
    const [posts, total] = await this.postsRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { posts, total };
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async create(user: User, title: string, body: string): Promise<Post> {
    const post = this.postsRepository.create({ title, body, user });
    return this.postsRepository.save(post);
  }

  async update(
    userId: number,
    id: number,
    title: string,
    body: string,
  ): Promise<Post> {
    const post = await this.findOne(id);
    if (post.user.id !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this post',
      );
    }
    post.title = title;
    post.body = body;
    return this.postsRepository.save(post);
  }

  async remove(user: User, id: number): Promise<void> {
    const post = await this.findOne(id);
    if (post.user.id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to delete this post',
      );
    }
    await this.postsRepository.remove(post);
  }
}
