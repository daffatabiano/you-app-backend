import { IsArray, IsNotEmpty } from "class-validator";

export class CreateProfileDto {
    
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