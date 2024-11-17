import { ConflictException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Profile} from "./schemas/profile.schema";
import { CreateProfileDto, UpdateProfileDto } from "./dto/profile.dto";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/user.schema";

@Injectable()
export class ProfileService{
    constructor(@InjectModel('Profile') private profileModel: Model<Profile>, @InjectModel('User') private userModel: Model<User>, private readonly jwtService : JwtService){}

    async create(createProfileDto: CreateProfileDto, token: string): Promise<Profile>{
        const decodedToken = this.jwtService.decode(token) as {id: string};
        const user = await this.userModel.findById(decodedToken.id);
        console.log(user);

        if(!decodedToken || ! decodedToken.id) throw new UnauthorizedException('Invalid token');

        const userId = decodedToken.id;

        const existingProfile = await this.profileModel.findOne({userId});
        console.log(existingProfile);

        if(existingProfile) throw new ConflictException('Profile already exists')

        
        const createdProfile = new this.profileModel({...createProfileDto, userId} );
        return await createdProfile.save();
    }

    async findOne(id: string): Promise<Profile>{
        return await this.profileModel.findById(id).exec();
    }

    async findAll(page: number, limit: number = 10): Promise<Profile[]>{
        const skip = (page - 1) * limit;
        return await this.profileModel.find().skip(skip).limit(limit).exec();
    }

    async update(id: string, updateProfileDto: UpdateProfileDto): Promise<Profile>{
        return await this.profileModel.findByIdAndUpdate(id, updateProfileDto, {new: true}).exec();
    }

    async delete(id: string): Promise<any>{
        return await this.profileModel.findByIdAndDelete(id).exec();
    }
}