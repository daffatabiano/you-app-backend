import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateProfileDto {
    @IsString({message: 'userId must be a string'})
    readonly userId: string
    
    @IsNotEmpty({message: 'name is required'})
    readonly name: string;

    @IsNotEmpty({message: 'birthday is required'})
    readonly birthday: Date;
    
    readonly horoscope: string;
    readonly zodiac: string;

    @IsNotEmpty({message: 'height is required'})
    readonly height: number;

    @IsNotEmpty({message: 'weight is required'})
    readonly weight: number;

    @IsNotEmpty({message: 'interests is required'})
    @IsArray({message: 'interests must be an array'})
    readonly interests: [string];
}

export class UpdateProfileDto {

    @IsNotEmpty({message: 'name is required'})
    readonly name: string;

    @IsNotEmpty({message: 'birthday is required'})
    readonly birthday: Date;

    @IsNotEmpty({message: 'height is required'})
    readonly height: number;

    @IsNotEmpty({message: 'weight is required'})
    readonly weight: number;

    @IsNotEmpty({message: 'interests is required'})
    @IsArray({message: 'interests must be an array'})
    readonly interests: [string];
}