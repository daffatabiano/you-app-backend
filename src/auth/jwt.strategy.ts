import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy  } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt,Strategy } from "passport-jwt";
import { User } from "src/users/user.schema";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(@InjectModel(User.name) private userModel: Model<User>){
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || 'daffa tabiano'
        })
    }



    async validate (payload: {id: string}): Promise<User> {
        const {id} = payload;
        const user = await this.userModel.findById(id);

        if(!user) throw new UnauthorizedException('Login first for access this page');

        return user
    }
}