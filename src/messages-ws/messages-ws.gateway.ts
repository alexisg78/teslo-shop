import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dto/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss: Socket;

  constructor(
    private readonly messagesWsService: MessagesWsService
  ) {}

  handleConnection(client: Socket) {
    // console.log('Cliente conectado: ', client.id)
    this.messagesWsService.registerClient( client );
    
    this.wss.emit('clients-updated', this.messagesWsService.conectedClient() );
  }

  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado: ', client.id)
    this.messagesWsService.removeClient(client.id);
    
    this.wss.emit('clients-updated', this.messagesWsService.conectedClient() );
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
      fullName: 'Anonimo!',
      message: payload.message || 'No message!!!'
    })

  }

  
}
