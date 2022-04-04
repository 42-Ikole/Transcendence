import {
  WebSocketServer,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
  ObserveGameDto,
  RequestMatchDto,
  SocketWithUser,
} from '../websocket/websocket.types';
import { GameState } from './pong.types';
import {
  gameHasEnded,
  movePlayer,
  newGameState,
  updateGamestate,
} from './pong.game';
import { PongService } from './pong.service';
import { UserService } from 'src/user/user.service';
import { MatchService } from 'src/match/match.service';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsExceptionFilter } from 'src/websocket/websocket.exception.filter';
import { SocketService } from '../websocket/socket.service';
import { StatusService, UserState } from 'src/status/status.service';

/*
Endpoints:
  `requestMatch`
  `movement`
  `requestObserve`
  `cancelObserve`
Emits:
  `endGame`
  `exception`
*/

@WebSocketGateway({
  namespace: '/pong',
  cors: {
    credentials: true,
    origin: ['http://localhost:8080', 'http://localhost:3000'],
  },
})
@UseFilters(WsExceptionFilter)
export class PongGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private pongService: PongService,
    private userService: UserService,
    private matchService: MatchService,
    private socketService: SocketService,
    private statusService: StatusService,
  ) {}

  @WebSocketServer() wss: Server;

  afterInit(server: Server) {
    this.socketService.pongServer = server;
  }

  async handleConnection(client: SocketWithUser) {
    client.user = await this.pongService.userFromCookie(
      client.handshake.headers.cookie,
    );
    if (
      !client.user ||
      this.socketService.userExistsType(client.user.id, 'pong')
    ) {
      console.log('/pong connection denied:', client.id);
      client.disconnect();
      return;
    }
    console.log('/pong connect:', client.user.username);
    this.pongService.addClient(client);
    if (this.pongService.isDisconnected(client)) {
      this.handleReconnect(client);
    }
  }

  handleReconnect(client: SocketWithUser) {
    this.pongService.reconnectUser(client);
    client.join(client.gameRoom);
    this.setStateIfOnline(client.user.id, 'PLAYING');
  }

  handleDisconnect(client: SocketWithUser) {
    if (!client.user) {
      return;
    }
    if (
      this.pongService.isChallenged(client) &&
      this.pongService.hasChallenger(client)
    ) {
      this.sendChallengeRejection(this.pongService.getChallenger(client));
    }
    if (this.pongService.isPlaying(client)) {
      this.pongService.disconnectUser(client);
      if (this.pongService.bothPlayersDisconnected(client.gameRoom)) {
        console.log(
          'both players disconnected, removing gameRoom:',
          client.gameRoom,
        );
        this.deleteGame(client.gameRoom);
      }
    }
    this.pongService.removeClient(client);
    console.log('/pong Disconnect:', client.user.username);
  }

  deleteGame(roomName: string) {
    const gameState = this.pongService.getGameState(roomName);
    this.socketService.pongServer.to(roomName).emit('endGame', gameState);
    this.pongService.deleteGameRoom(roomName);
    this.socketService.pongServer.socketsLeave(roomName);
  }

  endGame(roomName: string) {
    console.log('game ended:', roomName);
    const gameRoom = this.pongService.getGameRoom(roomName);
    this.setStateIfOnline(gameRoom.playerOne.userId, 'ONLINE');
    this.setStateIfOnline(gameRoom.playerTwo.userId, 'ONLINE');
    this.addMatchHistory(roomName);
    this.deleteGame(roomName);
  }

  addMatchHistory(roomName: string) {
    const gameRoom = this.pongService.getGameRoom(roomName);
    type PlayerIndex = 'playerOne' | 'playerTwo';
    let winner: PlayerIndex = 'playerTwo';
    let loser: PlayerIndex = 'playerOne';
    if (
      gameRoom.gameState.playerOne.score > gameRoom.gameState.playerTwo.score
    ) {
      winner = 'playerOne';
      loser = 'playerTwo';
    }
    this.createMatchHistory(
      gameRoom[winner].userId,
      gameRoom.gameState[winner].score,
      gameRoom[loser].userId,
      gameRoom.gameState[loser].score,
    );
  }

  async createMatchHistory(
    winnerId: number,
    winnerScore: number,
    loserId: number,
    loserScore: number,
  ) {
    const winner = await this.userService.findById(winnerId);
    const loser = await this.userService.findById(loserId);
    this.matchService.createMatch({
      winner,
      winnerScore,
      loser,
      loserScore,
    });
  }

  /*
	Data:
		type: "matchmaking" | "challenge"
		target: "_user_id_" | null
	*/
  @SubscribeMessage('requestMatch')
  @UsePipes(new ValidationPipe())
  requestMatch(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: RequestMatchDto,
  ) {
    if (data.type === 'matchmaking') {
      this.matchMaking(client, data.default);
    } else {
      console.log('Challenge:', data);
      this.challenge(client, data.targetId, data.default);
    }
  }

  @SubscribeMessage('acceptChallenge')
  acceptChallenge(@ConnectedSocket() client: SocketWithUser) {
    if (!this.pongService.hasChallenger(client)) {
      client.emit('rejectChallenge', 'challenger not found');
      this.setStateIfOnline(client.user.id, 'ONLINE');
    } else {
      this.startNewGame(this.pongService.getChallenger(client), client, this.pongService.getMode(client));
    }
    this.pongService.deleteChallenger(client);
  }

  @SubscribeMessage('rejectChallenge')
  rejectChallenge(@ConnectedSocket() client: SocketWithUser) {
    this.setStateIfOnline(client.user.id, 'ONLINE');
    if (this.pongService.hasChallenger(client)) {
      this.sendChallengeRejection(this.pongService.getChallenger(client));
    }
    this.pongService.deleteChallenger(client);
  }

  sendChallengeRejection(client: SocketWithUser) {
    client.emit('rejectChallenge', 'challenge rejected');
    this.setStateIfOnline(client.user.id, 'ONLINE');
  }

  // Check if there is another client ready to play, otherwise set client as waiting/searching
  matchMaking(client: SocketWithUser, mode: boolean) {
    if (!this.pongService.canMatch()) {
      console.log(client.user.username, 'is searching');
      this.pongService.enterMatchmakingQueue(client);
      this.setStateIfOnline(client.user.id, 'SEARCHING');
      return;
    }
    const matchedUser = this.pongService.getMatch();
    if (matchedUser.id === client.id) {
      console.error('client matched with itself');
      return;
    }
    this.startNewGame(matchedUser, client, mode);
  }

  challenge(client: SocketWithUser, targetId: number, mode: boolean) {
    const target = this.pongService.getClientFromId(targetId);
    if (!target) {
      client.emit('exception', 'could not find target with id:', targetId);
      return;
    } else if (client.id === target.id) {
      client.emit('exception', 'you challenged yourself');
      return;
    } else if (this.statusService.getState(targetId) !== 'ONLINE') {
      client.emit('rejectChallenge', 'target is not available');
      return;
    }
    this.pongService.addChallenger(client, target, mode);
    this.setStateIfOnline(client.user.id, 'SEARCHING');
    this.setStateIfOnline(target.user.id, 'CHALLENGED');
    target.emit('requestChallenge', { source: client.user });
  }

  // Create a new unique room for these clients to play in
  // Set client's state to PLAYING
  async startNewGame(clientOne: SocketWithUser, clientTwo: SocketWithUser, mode : boolean) {
    const roomName = this.pongService.generateRoomName();
    this.joinRoom(clientOne, roomName);
    this.joinRoom(clientTwo, roomName);

    this.setStateIfOnline(clientOne.user.id, 'PLAYING');
    this.setStateIfOnline(clientTwo.user.id, 'PLAYING');

    const gameState = newGameState(
      clientOne.user.username,
      clientTwo.user.username,
      mode
    );
    const intervalId = this.startGameLoop(roomName, gameState);
    this.pongService.addGameRoom(roomName, {
      intervalId,
      playerOne: {
        userId: clientOne.user.id,
        disconnected: false,
      },
      playerTwo: {
        userId: clientTwo.user.id,
        disconnected: false,
      },
      observers: new Set<number>(),
      gameState,
    });
  }

  joinRoom(client: SocketWithUser, roomName: string) {
    client.join(roomName);
    client.gameRoom = roomName;
  }

  startGameLoop(roomName: string, gameState: GameState) {
    const intervalId = setInterval(() => {
      updateGamestate(gameState);
      if (gameHasEnded(gameState)) {
        this.endGame(roomName);
      } else {
        this.socketService.pongServer
          .to(roomName)
          .emit('updatePosition', gameState);
      }
    }, 1000 / 60);
    return intervalId;
  }

  @SubscribeMessage('movement')
  movement(client: SocketWithUser, data: Array<string>) {
    const gameRoom = this.pongService.getGameRoom(client.gameRoom);
    if (!gameRoom) {
      return;
    }
    if (client.user.id === gameRoom.playerOne.userId) {
      movePlayer(gameRoom.gameState.playerOne.bar, Array.from(data));
    } else if (client.user.id === gameRoom.playerTwo.userId) {
      movePlayer(gameRoom.gameState.playerTwo.bar, Array.from(data));
    }
  }

  /*
  DTO: userId of user who is playing a game OR roomName of name of room to join
  */
  @SubscribeMessage('requestObserve')
  observe(client: SocketWithUser, observeDto: ObserveGameDto) {
    let roomName: string;
    console.log('Dto:', observeDto);
    if (observeDto.roomName) {
      roomName = observeDto.roomName;
    } else if (!this.socketService.userExistsType(observeDto.userId, 'pong')) {
      client.emit('exception', 'Observe: requested user not found');
      return;
    } else {
      roomName = this.socketService.sockets[observeDto.userId].pong.gameRoom;
    }
    if (!roomName || !this.pongService.gameExists(roomName)) {
      client.emit('exception', 'requested room is not an active game');
      return;
    }
    this.pongService.observe(client, roomName);
    this.setStateIfOnline(client.user.id, 'OBSERVING');
  }

  @SubscribeMessage('cancelObserve')
  cancelObserve(client: SocketWithUser) {
    this.pongService.cancelObserve(client);
    this.setStateIfOnline(client.user.id, 'ONLINE');
  }

  setStateIfOnline(id: number, newState: UserState) {
    console.log(
      'changing state of',
      id,
      'from',
      this.statusService.getState(id),
      'to',
      newState,
    );
    if (this.statusService.getState(id) !== 'OFFLINE') {
      this.statusService.updateUserState(id, newState);
    }
  }
}
