import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from '../profile.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Profile } from '../schemas/profile.schema';
import { User } from 'src/users/user.schema';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { CreateProfileDto, UpdateProfileDto } from '../dto/profile.dto';

// Mocking dependencies
const mockProfileModel = {
  create: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

const mockUserModel = {
  findById: jest.fn(),
};

const mockJwtService = {
  decode: jest.fn(),
};

describe('ProfileService', () => {
  let profileService: ProfileService;
  let profileModel;
  let userModel;
  let jwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getModelToken('Profile'),
          useValue: mockProfileModel,
        },
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

    profileService = module.get<ProfileService>(ProfileService);
    profileModel = module.get(getModelToken('Profile'));
    userModel = module.get(getModelToken('User'));
    jwtService = module.get(JwtService);
  });

  describe('create', () => {
    it('should create a profile successfully', async () => {
      // Sesuaikan objek ini dengan struktur CreateProfileDto
      const createProfileDto: CreateProfileDto = {
        name: 'John Doe',
        userId: 'user123',
        birthday: new Date('1990-01-01'),
        height: 180,
        weight: 75,
        interests: ['sports'],
        horoscope: 'Aquarius',
        zodiac: 'Water Bearer',
      };

      const token = 'valid-token';
      const userId = 'user123';

      // Mocking decoded token and user lookup
      mockJwtService.decode.mockReturnValue({ id: userId });
      mockUserModel.findById.mockResolvedValue({ _id: userId });
      mockProfileModel.findOne.mockResolvedValue(null); // No existing profile
      mockProfileModel.save.mockResolvedValue(createProfileDto);

      const result = await profileService.create(createProfileDto, token);

      expect(result).toEqual({ ...createProfileDto, userId });
      expect(mockProfileModel.save).toHaveBeenCalledWith({ ...createProfileDto, userId });
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const token = 'invalid-token';
      mockJwtService.decode.mockReturnValue(null); // Invalid token

      await expect(profileService.create({} as any, token)).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw ConflictException if profile already exists', async () => {
      const createProfileDto: CreateProfileDto = {
        name: 'John Doe',
        birthday: new Date('1990-01-01'),
        height: 180,
        weight: 75,
        interests: ['sports'],
        horoscope: 'Aquarius',
        zodiac: 'Water Bearer',
        userId: 'user123',
      };
      const token = 'valid-token';
      const userId = 'user123';

      mockJwtService.decode.mockReturnValue({ id: userId });
      mockUserModel.findById.mockResolvedValue({ _id: userId });
      mockProfileModel.findOne.mockResolvedValue({ userId }); // Existing profile found

      await expect(profileService.create(createProfileDto, token)).rejects.toThrowError(ConflictException);
    });
  });

  describe('getProfile', () => {
    it('should return profile with horoscope and zodiac', async () => {
      const token = 'valid-token';
      const userId = 'user123';

      const mockProfile = {
        userId: 'user123',
        name: 'John Doe',
        birthday: new Date('1990-01-01'),
        height: 180,
        weight: 75,
        interests: ['sports', 'music'],
        horoscope: 'Aquarius',
        zodiac: 'Water Bearer',
      };

      mockJwtService.decode.mockReturnValue({ id: userId });
      mockProfileModel.findOne.mockResolvedValue(mockProfile);

      const result = await profileService.getProfile(token);

      expect(result).toEqual({
        ...mockProfile,
        horoscope: 'Aquarius',
        zodiac: 'Horse', // Sesuaikan dengan hasil perhitungan zodiak
      });
    });

    it('should throw UnauthorizedException if profile not found', async () => {
      const token = 'valid-token';
      const userId = 'user123';

      mockJwtService.decode.mockReturnValue({ id: userId });
      mockProfileModel.findOne.mockResolvedValue(null); // No profile found

      await expect(profileService.getProfile(token)).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('update', () => {
    it('should update profile successfully', async () => {
      const id = 'profile-id';
      const updateProfileDto: UpdateProfileDto = { name: 'Jane Doe', birthday: new Date('1992-02-02'), height: 170, weight: 65, interests: ['reading'] };

      const updatedProfile = { ...updateProfileDto, _id: id };
      mockProfileModel.findByIdAndUpdate.mockResolvedValue(updatedProfile);

      const result = await profileService.update(id, updateProfileDto);

      expect(result).toEqual(updatedProfile);
      expect(mockProfileModel.findByIdAndUpdate).toHaveBeenCalledWith(id, updateProfileDto, { new: true });
    });
  });

  describe('delete', () => {
    it('should delete profile successfully', async () => {
      const id = 'profile-id';
      const deleteResponse = { deleted: true };

      mockProfileModel.findByIdAndDelete.mockResolvedValue(deleteResponse);

      const result = await profileService.delete(id);

      expect(result).toEqual(deleteResponse);
      expect(mockProfileModel.findByIdAndDelete).toHaveBeenCalledWith(id);
    });
  });
});
