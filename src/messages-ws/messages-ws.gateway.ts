import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss: Socket;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {
    
    const token = client.handshake.headers.authentication as string;
    
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify( token );
      await this.messagesWsService.registerClient( client, payload.id );

    } catch (error) {
      client.disconnect();
      return;
    }

    // console.log({payload});
    
    
    
    this.wss.emit('clients-updated', this.messagesWsService.getConectedClient() );
  }

  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado: ', client.id)
    this.messagesWsService.removeClient(client.id);
    
    this.wss.emit('clients-updated', this.messagesWsService.getConectedClient() );
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient( client: Socket, payload: NewMessageDto ){
    
    // Emite unicamente al cliente
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo!!!',
    //   message: payload.message || 'No message!!!'
    // })
    
    // Emitir a TODOS, MENOS al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Anonimo!',
    //   message: payload.message || 'No message!!!'
    // })

    // Emitir a TODOS
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'No message!!!'
    })

  }

  
}
