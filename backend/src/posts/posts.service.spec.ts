import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './posts.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let postsRepository: Repository<Post>;

  const mockPostsRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: mockPostsRepository },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postsRepository = module.get(getRepositoryToken(Post));
  });

  describe('findAll', () => {
    it('should return posts and total count', async () => {
      const posts = [{ id: 1, title: 'Test' }];
      mockPostsRepository.findAndCount.mockResolvedValue([posts, 1]);

      const result = await service.findAll(1, 1, 10);
      expect(result).toEqual({ posts, total: 1 });
      expect(mockPostsRepository.findAndCount).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        relations: ['user'],
        skip: 0,
        take: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return a post', async () => {
      const post = { id: 1, title: 'Test' };
      mockPostsRepository.findOne.mockResolvedValue(post);

      const result = await service.findOne(1);
      expect(result).toEqual(post);
    });

    it('should throw NotFoundException if post not found', async () => {
      mockPostsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a post', async () => {
      const user = {
        provider: 'google',
        providerId: '123',
        name: 'Test User',
        email: 'test@example.com',
      };
      const post = { id: 1, title: 'Test', body: 'Body', user };
      mockPostsRepository.create.mockReturnValue(post);
      mockPostsRepository.save.mockResolvedValue(post);

      const result = await service.create(user, 'Test', 'Body');
      expect(result).toEqual(post);
    });
  });

  describe('update', () => {
    it('should update and return a post', async () => {
      const post = { id: 1, title: 'Old', body: 'Old', user: { id: 1 } };
      const updatedPost = { id: 1, title: 'New', body: 'New', user: { id: 1 } };
      mockPostsRepository.findOne.mockResolvedValue(post);
      mockPostsRepository.save.mockResolvedValue(updatedPost);

      const result = await service.update(1, 1, 'New', 'New');
      expect(result).toEqual(updatedPost);
    });

    it('should throw ForbiddenException if user not authorized', async () => {
      const post = { id: 1, user: { id: 2 } };
      mockPostsRepository.findOne.mockResolvedValue(post);

      await expect(service.update(1, 1, 'New', 'New')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      const user = { id: 1 };
      const post = { id: 1, user };
      mockPostsRepository.findOne.mockResolvedValue(post);
      mockPostsRepository.remove.mockResolvedValue(undefined);

      await expect(service.remove(user.id, 1)).resolves.toBeUndefined();
    });

    it('should throw ForbiddenException if user not authorized', async () => {
      const user = { id: 1 };
      const post = { id: 1, user: { id: 2 } };
      mockPostsRepository.findOne.mockResolvedValue(post);

      await expect(service.remove(user.id, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
