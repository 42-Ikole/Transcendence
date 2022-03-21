import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    console.log("AuthenticatedGuard");
    console.log(req.user);
    return req.isAuthenticated() && req.user.twoFactorPassed;
  }
}

export class AuthenticatedGuardWebsocket implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    return true;
  }
}
