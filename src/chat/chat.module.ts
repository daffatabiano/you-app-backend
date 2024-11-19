import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './schema/chat.schema';
import { ChatGateway } from './chat.gateway';
import { RabbitMQModule } from 'src/rabbitmq.module';
import { ClientProxy } from '@nestjs/microservices';

@Module({
  imports: [
    RabbitMQModule,
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema}])
],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
  exports: [ChatService]
})
export class ChatModule {}
