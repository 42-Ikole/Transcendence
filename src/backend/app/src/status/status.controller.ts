import { Controller, Get, UseGuards, Req, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/auth.types';
import { SocketService } from 'src/websocket/socket.service';
import { StatusService } from './status.service';

@ApiTags('status')
@Controller('status')
@UseGuards(AuthenticatedGuard)
export class StatusController {
  constructor(
    private statusService: StatusService,
    private socketService: SocketService,
  ) {}

  @Get()
  getStates() {
    return this.statusService.getStates();
  }

  @Get('can-connect')
  canConnect(@Req() request: RequestWithUser) {
    if (this.socketService.userExists(request.user.id)) {
      return 'CONNECTION DENIED';
    } else {
      this.socketService.reserveSocket(request.user.id);
      return 'OK';
    }
  }

  @Delete('reset-connection')
  resetConnection(@Req() request: RequestWithUser) {
    this.statusService.updateUserState(request.user.id, 'CONNECTION_DENIED');
    this.socketService.disconnectUser(request.user.id);
  }
}
