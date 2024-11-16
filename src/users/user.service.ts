import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";
import { Model } from "mongoose";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

    async findOne(id: string): Promise<User> {
        const user = await this.userModel.findById(id).exec();
        if(!user) throw new NotFoundException("User not found");
        return user;
    }

    async update(id: string, updateUserDto: User): Promise<User> {
        const existingUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true}).exec();

        if(!existingUser) throw new NotFoundException("User not found");

        return existingUser;
    }

}