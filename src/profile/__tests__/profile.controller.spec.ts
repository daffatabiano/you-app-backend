import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from '../profile.controller';
import { ProfileService } from '../profile.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateProfileDto, UpdateProfileDto } from '../dto/profile.dto';
import { Profile } from '../schemas/profile.schema';

// Mocking ProfileService
const mockProfileService = {
  create: jest.fn(),
  getProfile: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// Mocking AuthGuard to bypass authentication
const mockAuthGuard = {
  canActivate: jest.fn(() => true), // Always return true for testing
};

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
        {
          provide: AuthGuard('jwt'),
          useValue: mockAuthGuard,
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
  });

  describe('createProfile', () => {
    it('should successfully create a profile', async () => {
      const createProfileDto: CreateProfileDto = {
        userId: '1',
        name: 'John Doe',
        birthday: new Date('1990-01-01'),
        height: 180,
        weight: 75,
        interests: ['sports'],
        horoscope: 'Aquarius',
        zodiac: 'Water Bearer',
      };

      const mockProfile: { userId: string} = {
        userId: '1',
        ...createProfileDto,
      };

      // Mocking ProfileService create method
      mockProfileService.create.mockResolvedValue(mockProfile);

      const req = {
        headers: {
          authorization: 'Bearer mock-token',
        },
      };

      const result = await controller.createProfile(createProfileDto, req);

      expect(result).toEqual(mockProfile);
      expect(mockProfileService.create).toHaveBeenCalledWith(createProfileDto, 'mock-token');
    });
  });

  describe('getProfile', () => {
    it('should return the user profile', async () => {
      const mockProfileResponse = {
        userId: '1',
        name: 'John Doe',
        birthday: new Date('1990-01-01'),
        height: 180,
        weight: 75,
        interests: ['sports', 'music'],
        horoscope: 'Aquarius',
        zodiac: 'Water Bearer',
      };

      // Mocking ProfileService getProfile method
      mockProfileService.getProfile.mockResolvedValue(mockProfileResponse);

      const req = {
        headers: {
          authorization: 'Bearer mock-token',
        },
      };

      const result = await controller.getProfile(req);

      expect(result).toEqual(mockProfileResponse);
      expect(mockProfileService.getProfile).toHaveBeenCalledWith('mock-token');
    });
  });

  describe('updateProfile', () => {
    it('should update the profile', async () => {
      const updateProfileDto: UpdateProfileDto = {
        name: 'Jane Doe',
        birthday: new Date('1992-02-02'),
        height: 170,
        weight: 65,
        interests: ['reading'],
      };

      const mockUpdatedProfile: { userId: string} = {
        userId: '1',
        ...updateProfileDto,
      };

      mockProfileService.update.mockResolvedValue(mockUpdatedProfile);

      const result = await controller.updateProfile('1', updateProfileDto);

      expect(result).toEqual(mockUpdatedProfile);
      expect(mockProfileService.update).toHaveBeenCalledWith('1', updateProfileDto);
    });
  });

  describe('remove', () => {
    it('should delete the profile', async () => {
      const mockDeletedResponse = { deleted: true };

      mockProfileService.delete.mockResolvedValue(mockDeletedResponse);

      const result = await controller.remove('1');

      expect(result).toEqual(mockDeletedResponse);
      expect(mockProfileService.delete).toHaveBeenCalledWith('1');
    });
  });
});
