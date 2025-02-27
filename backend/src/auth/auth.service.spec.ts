import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;

  // Create mocks for the user repository and JwtService
  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
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
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    mockJwtService.signAsync = jest.fn();
  });

  describe('validateUser', () => {
    it('should return existing user if found', async () => {
      const existingUser = {
        id: 1,
        provider: 'google',
        providerId: '123',
        name: 'Test',
        email: 'test@example.com',
      };

      // Mock repository method to return an existing user
      mockUserRepository.findOne.mockResolvedValue(existingUser);
    
      const result = await service.validateUser('google', '123', 'Test', 'test@example.com');
    
      expect(result).toEqual(expect.objectContaining(existingUser));
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

      // Simulate user not found initially, then create and save the user
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(newUser);
      mockUserRepository.save.mockResolvedValue(newUser);

      const result = await service.validateUser('google', '123', 'Test', 'test@example.com');
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
      const user = { id: 1, email: 'test@example.com', providerId: '123', name: 'Test User' };
      // Mock JwtService to return a token string using signAsync
      mockJwtService.signAsync.mockResolvedValue('token123');
  
      const result = await service.login(user);
      expect(result).toEqual({ access_token: 'token123' });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        id: user.id,
        sub: user.providerId,
        name: user.name,
        email: user.email,
        provider: 'google',
      });
    });
  });
  
});