import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from "socket.io";

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
	return true;
  }
}
