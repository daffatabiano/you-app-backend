import { ConflictException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Profile} from "./schemas/profile.schema";
import { CreateProfileDto, UpdateProfileDto } from "./dto/profile.dto";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/user.schema";

interface ProfileResponse {
    userId: string; name: string; birthday: Date; height: number; weight: number; interests: string[]; horoscope: string; zodiac: string;
}

@Injectable()
export class ProfileService{
    constructor(@InjectModel('Profile') private profileModel: Model<Profile>, @InjectModel('User') private userModel: Model<User>, private readonly jwtService : JwtService){}

    async create(createProfileDto: CreateProfileDto, token: string): Promise<Profile>{
        const decodedToken = this.jwtService.decode(token) as {id: string};


        if(!decodedToken || ! decodedToken.id) throw new UnauthorizedException('Invalid token');
        const userId = decodedToken.id;

        
        const user = await this.userModel.findById(userId);

        if(!user) throw new UnauthorizedException('User not found');

        const existingProfile = await this.profileModel.findOne({userId})
        console.log(existingProfile);

        if(existingProfile) throw new ConflictException('Profile already exists')

        const createdProfile = await this.profileModel.create({...createProfileDto, userId} );
        try {
            return await createdProfile.save();
        }catch (err){
            if(err.code === 11000) throw new ConflictException('Profile already created');
        }
    }

    async getProfile(token: string) : Promise<ProfileResponse>{
        const decodedToken = await this.jwtService.decode(token) as {id: string};

        const userId = decodedToken.id;
        const profile = await this.profileModel.findOne({userId});
        if(!profile) throw new UnauthorizedException('Profile not found');

        const horoscope = this.calculateHoroscope(profile.birthday);
        const zodiac = this.calculateZodiac(profile.birthday);

        return {...profile.toObject(), horoscope, zodiac};

    }

    private calculateHoroscope(birthday: Date): string{
        const month = birthday.getMonth() + 1;
        const day = birthday.getDate();

        if(month === 3 && day >= 21 || month === 4 && day <= 19) return 'Aries';
        if(month === 4 && day >= 20 || month === 5 && day <= 20) return 'Taurus';
        if(month === 5 && day >= 21 || month === 6 && day <= 20) return 'Gemini';
        if(month === 6 && day >= 21 || month === 7 && day <= 22) return 'Cancer';
        if(month === 7 && day >= 23 || month === 8 && day <= 22) return 'Leo';
        if(month === 8 && day >= 23 || month === 9 && day <= 22) return 'Virgo';
        if(month === 9 && day >= 23 || month === 10 && day <= 22) return 'Libra';
        if(month === 10 && day >= 23 || month === 11 && day <= 21) return 'Scorpio';
        if(month === 11 && day >= 22 || month === 12 && day <= 21) return 'Sagittarius';
        if(month === 12 && day >= 22 || month === 1 && day <= 19) return 'Capricorn';
        if(month === 1 && day >= 20 || month === 2 && day <= 18) return 'Aquarius';
        if(month === 2 && day >= 19 || month === 3 && day <= 20) return 'Pisces';

        return '';
    }

    private calculateZodiac(birthday : Date): string{
        const years = birthday.getFullYear();
        const zodiac = ["Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey"];
        return zodiac[years % 12];
    }

    async update(id: string, updateProfileDto: UpdateProfileDto): Promise<Profile>{
        return await this.profileModel.findByIdAndUpdate(id, updateProfileDto, {new: true})
    }

    async delete(id: string): Promise<any>{
        return await this.profileModel.findByIdAndDelete(id)
    }
}