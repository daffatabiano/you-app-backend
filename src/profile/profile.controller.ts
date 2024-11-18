import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { CreateProfileDto, UpdateProfileDto } from "./dto/profile.dto";
import { Profile } from "./schemas/profile.schema";
import { AuthGuard } from "@nestjs/passport";

interface ProfileResponse {
    userId: string; name: string; birthday: Date; height: number; weight: number; interests: string[]; horoscope: string; zodiac: string;
}

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService){}
    
    @Post('create')
    @UseGuards(AuthGuard('jwt'))
    async createProfile(@Body() createProfileDto: CreateProfileDto, @Request() req): Promise<Profile> {
        const token = req.headers.authorization.split(' ')[1];
        return await this.profileService.create(createProfileDto, token);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Request() req): Promise<ProfileResponse> {
        const token = req.headers.authorization.split(' ')[1];
        return await this.profileService.getProfile(token);
    }

    @Put(':id')
    async updateProfile(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto): Promise<Profile> {
        return this.profileService.update(id, updateProfileDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<any> {
        return this.profileService.delete(id);
    }
}