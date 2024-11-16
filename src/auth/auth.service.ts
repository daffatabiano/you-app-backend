import {Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import {LoginUserDto} from "src/users/dto/login-user.dto";
import { User } from 'src/users/user.schema';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly jwtService: JwtService
    ){}
    async register (createUserDto: CreateUserDto): Promise<any>{
        const {password, ...userData} = createUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.userModel.create({
            ...userData,
            password: hashedPassword
        })
        const payload = {password, username: newUser.username, email: newUser.email};
        if(!payload.password) throw new HttpException("Password is required", HttpStatus.BAD_REQUEST);
        if(!payload.username) throw new HttpException("Username is required", HttpStatus.BAD_REQUEST);
        if(!payload.email) throw new HttpException("Email is required", HttpStatus.BAD_REQUEST);

        const existingUser = await this.userModel.findOne({email: payload.email}).exec();
        if(existingUser) throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);

        try{
            await newUser.save();

        }catch (err){
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            message: "User created successfully",
            statusCode: 201
        };
    }

    async login (loginUserDto: LoginUserDto): Promise<any>{
        const {username, password} = loginUserDto;
        const user = await this.userModel.findOne({username}).exec();
        const passwordValidation = await bcrypt.compare(password, user.password);
        if(user && passwordValidation){
            const payload = passwordValidation;
            const {password, ...userData} = user.toObject();
            return {
                access_token: this.jwtService.sign(payload),
                message: "User logged in successfully",
                statusCode: 200,
                data: userData
            }
        }
        throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST);
    }
    
}