import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should call authService.register with correct arguments and return a token', async () => {
      const mockRegisterDto: RegisterDto = { email: 'test@example.com', password: 'password123', username: 'testuser' };
      const mockResponse = { token: 'fake-jwt-token', message: 'User created successfully' };
      jest.spyOn(authService, 'register').mockResolvedValue(mockResponse);

      const result = await authController.register(mockRegisterDto);

      expect(authService.register).toHaveBeenCalledWith(mockRegisterDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('login', () => {
    it('should call authService.login with correct arguments and return a token', async () => {
      const mockLoginDto: LoginDto = { email: 'test@example.com', password: 'password123' };
      const mockResponse = { token: 'fake-jwt-token', message: 'Login successful', user: { email: 'test@example.com', username: 'testuser' ,password: undefined} };
      jest.spyOn(authService, 'login').mockResolvedValue(mockResponse);

      const result = await authController.login(mockLoginDto);

      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
      expect(result).toEqual(mockResponse);
    });
  });
});
