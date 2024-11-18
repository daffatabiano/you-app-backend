import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api')
export class ChatController {
    constructor(private readonly chatService: ChatService){}

    @Post('sendMessage')
    @UseGuards(AuthGuard('jwt'))
    async sendMessage(@Body() body: {sender: string, receiver: string, content: string}) {
        return this.chatService.sendMessage(body.sender, body.receiver, body.content);
    }

    @Get('viewMessage')
    @UseGuards(AuthGuard('jwt'))
    async viewMessage(@Body() body: {sender: string, receiver: string}){
        return this.chatService.viewMessage(body.sender, body.receiver);
    }
}
