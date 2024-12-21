import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('newMessage')
  async handleMessage(@MessageBody() message: any) {
    const savedMessage = await this.chatService.saveMessage(message);
    this.server.emit(`message:${message.receiverId}`, savedMessage);
    this.server.emit(`message:${message.userId}`, savedMessage);
    return savedMessage;
  }

  @SubscribeMessage('getMessages')
  async getMessages(
    @MessageBody() data: { userId: string; receiverId: string },
  ) {
    return await this.chatService.getMessages(data.userId, data.receiverId);
  }
}
