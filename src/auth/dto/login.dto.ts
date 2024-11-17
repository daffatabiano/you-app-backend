import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @IsNotEmpty({message: 'email is required'})
    @IsEmail({},{message: 'please enter a valid email'})
    email: string

    @IsNotEmpty({message: 'password is required'})
    @MinLength(6, {message: 'password must be at least 6 characters'})
    @IsString({message: 'password must be a string'})
    password: string
}