import {Controller, Post, Body, Get} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
    constructor (private authService: AuthService){}

    @Post('/register')
    register(@Body() registerDto: RegisterDto): Promise<{token: string}>{
        return this.authService.register(registerDto)
    }

    @Get('/login')
    login(@Body() loginDto: LoginDto): Promise<{token : string}> {
        return this.authService.login(loginDto);
    }
}