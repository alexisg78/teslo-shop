import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';

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

}
