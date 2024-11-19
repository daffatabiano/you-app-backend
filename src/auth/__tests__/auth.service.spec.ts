import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: any; // Mock user model
  let jwtService: JwtService;

  beforeEach(async () => {
    const mockUserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken('User'));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should throw UnauthorizedException if user already exists', async () => {
      const registerDto = { email: 'test@example.com', password: 'password123', username: 'testuser' };
      
      // Simulating existing user
      userModel.findOne = jest.fn().mockResolvedValue({ email: 'test@example.com' });

      try {
        await authService.register(registerDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.response).toStrictEqual({ message: 'User already exists', "statusCode": 401, "error": "Unauthorized" });
      }
    });

    it('should successfully register a user and return token', async () => {
      const registerDto = { email: 'test@example.com', password: 'password123', username: 'testuser' };
      const mockHashedPassword = 'hashedpassword';

      // Mocking bcrypt.hash method
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockHashedPassword);

      // Mocking the user creation and saving process
      userModel.findOne = jest.fn().mockResolvedValue(null);
      userModel.create = jest.fn().mockResolvedValue({ ...registerDto, _id: 'user-id', save: jest.fn() });
      jwtService.sign = jest.fn().mockReturnValue('fake-jwt-token');

      const result = await authService.register(registerDto);

      expect(result).toEqual({
        message: 'User created successfully',
        token: 'fake-jwt-token',
      });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };

      // Mocking userModel to return null (user not found)
      userModel.findOne = jest.fn().mockResolvedValue(null);

      try {
        await authService.login(loginDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.response).toStrictEqual({ message: 'User not found', "statusCode": 401, "error": "Unauthorized" });
      }
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };

      // Mocking userModel to return a user
      userModel.findOne = jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'hashedpassword' });
      
      // Mocking bcrypt.compare to return false (password incorrect)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      try {
        await authService.login(loginDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.response).toStrictEqual({ message: 'password incorrect', "statusCode": 401, "error": "Unauthorized" });
      }
    });

    it('should successfully login a user and return token and user', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const mockUser = { email: 'test@example.com', password: 'hashedpassword', _id: 'user-id', username: 'testuser' };

      // Mocking userModel to return a user
      userModel.findOne = jest.fn().mockResolvedValue(mockUser);

      // Mocking bcrypt.compare to return true (password correct)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      // Mocking the JWT service
      jwtService.sign = jest.fn().mockReturnValue('fake-jwt-token');

      const result = await authService.login(loginDto);

      expect(result).toEqual({
        message: 'Login successful',
        user: mockUser,
        token: 'fake-jwt-token',
      });
    });
  });
});
