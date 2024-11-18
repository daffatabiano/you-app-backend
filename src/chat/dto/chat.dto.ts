import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class ChatDto {
    @IsString()
    @IsNotEmpty()
    readonly sender: string
    
    @IsString()
    @IsNotEmpty()
    readonly receiver: string

    @IsString()
    @IsNotEmpty()
    readonly content: string

    @IsDate()
    @IsNotEmpty()
    readonly timestamp: Date

}
