import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';


@Schema()
export class Profile extends Document {
    @Prop({required: true})
    userId: string

    @Prop({required: true})
    name: string

    @Prop({required: true})
    birthday: Date

    @Prop()
    horoscope:string

    @Prop()
    zodiac: string

    @Prop({required: true})
    height: number

    @Prop({required: true})
    weight: number

    @Prop({required: true})
    interests: [string]
}

export const ProfileSchema = SchemaFactory.createForClass(Profile)