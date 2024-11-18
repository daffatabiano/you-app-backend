import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './schema/chat.schema';
import { ClientProxy } from '@nestjs/microservices';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
    constructor(@InjectModel('Chat') private readonly chatModel: Model<Chat>,private  gateway: ChatGateway){}

    async sendMessage(sender: string, receiver: string, content: string) :Promise<Chat> {
        const message = new this.chatModel({ sender, receiver, content });
        const savedMessage = await message.save();

        this.gateway.server.emit('message', savedMessage);

        return savedMessage;
    }

    async viewMessage(sender: string, receiver: string): Promise<Chat[]> {
        return this.chatModel.find({$or: [{sender: sender, receiver: receiver}, {sender: receiver, receiver: sender}]});
    }
}
