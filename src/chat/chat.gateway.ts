import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from "@nestjs/websockets";
import {Server} from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
export class ChatGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server
    handleConnection(client: any, ...args: any[]) {
        console.log(client.id);
    
    }
    broadCastMessage(message: any) {
        this.server.emit('message_received', message);
    }
}