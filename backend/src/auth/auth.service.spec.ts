import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return existing user if found', async () => {
      const user = {
        id: 1,
        provider: 'google',
        providerId: '123',
        name: 'Test',
        email: 'test@example.com',
      };
      mockUserRepository.findOne.mockResolvedValue(user);
    
      const result = await service.validateUser('google', '123', 'Test', 'test@example.com');
    
      expect(result).toEqual(expect.objectContaining(user));
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { provider: 'google', providerId: '123' },
      });
    });

    it('should create and return new user if not found', async () => {
      const newUser = {
        id: 1,
        provider: 'google',
        providerId: '123',
        name: 'Test',
        email: 'test@example.com',
      };
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(newUser);
      mockUserRepository.save.mockResolvedValue(newUser);

      const result = await service.validateUser(
        'google',
        '123',
        'Test',
        'test@example.com',
      );
      expect(result).toEqual(expect.objectContaining(newUser));
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        provider: 'google',
        providerId: '123',
        email: 'test@example.com',
        name: 'Test',
      });
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const user = { id: 1, email: 'test@example.com' };
      mockJwtService.sign.mockReturnValue('token123');

      const result = await service.login(user);
      expect(result).toEqual({ access_token: 'token123' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: 'test@example.com',
      });
    });
  });
});
