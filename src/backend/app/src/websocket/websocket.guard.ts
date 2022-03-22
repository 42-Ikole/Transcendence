import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SocketWithUser } from './websocket.types';

@Injectable()
export class WebsocketGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: SocketWithUser = context.switchToWs().getClient();
    // return authenticated if the user object is defined
    return !!client.user;
  }
}
