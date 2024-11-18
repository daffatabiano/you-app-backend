import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Chat extends Document {
    @Prop({required: true})
    sender : string;

    @Prop({required: true})
    receiver : string;

    @Prop({required: true})
    content : string;

    @Prop({required: true, default: Date.now})
    timestamp : Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);