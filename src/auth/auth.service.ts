import {Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private userModel: Model<User>,
        private readonly jwtService: JwtService
    ){}

    async register (registerDto : RegisterDto): Promise<{token: string, message: string}> {
        const {email, password, username} = registerDto;

        const existingUser = await this.userModel.findOne({email});

        if(existingUser) throw new UnauthorizedException('User already exists');


        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
        const user = await this.userModel.create({
            username, email, password: hashedPassword
        });


        await user.save()

        const token = this.jwtService.sign({id: user._id});

        return {message: 'User created successfully',token};
    }

    async login (loginDto : LoginDto): Promise<{token: string, message: string, user: User}>{
        const {email, password} = loginDto;
        const user = await this.userModel.findOne({email})
        if(!user) throw new UnauthorizedException('User not found');

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch) throw new UnauthorizedException('password incorrect');

        const token = this.jwtService.sign({id: user._id});

        return {message: 'Login successful', user: user, token};
    }
    
}