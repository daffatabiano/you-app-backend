import { Module } from "@nestjs/common";
import { ProfileSchema } from "./schemas/profile.schema";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "src/auth/auth.service";
import { UsersService } from "src/users/user.service";
import { UserSchema } from "src/users/user.schema";

@Module({
    imports: [MongooseModule.forFeature([{name: 'Profile', schema: ProfileSchema}, { name: 'User', schema: UserSchema }])],
    controllers: [ProfileController],
    providers: [ProfileService, JwtService],
    exports: [ProfileService]
})

export class ProfileModule {}