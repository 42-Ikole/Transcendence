import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { WsException, BaseWsExceptionFilter } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException, HttpException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    this.sendError(client, exception.message);
  }

  private sendError(client: Socket, message: string) {
    client.emit('exception', message);
  }
}
