import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RequestHelpDto } from './dto/request-help.dto';
import { HelpComingDto } from './dto/help-coming.dto';

@WebSocketGateway(4000, {
  cors: {
    origin: 'http://localhost:3002',
    credentials: true,
  },
})
export class ActivityGateway implements OnGatewayConnection {
  handleConnection(client: any, ...args: any[]) {
    console.log('client connected');
  }
  @WebSocketServer()
  public server: Server;

  @SubscribeMessage('help-requested')
  requestHelp(@MessageBody() data: RequestHelpDto) {
    console.log(data);
    this.server.emit('help-requested', data);
  }

  @SubscribeMessage('help-coming')
  helpComing(@MessageBody() data: HelpComingDto) {
    this.server.emit('help-coming', data);
  }
}
