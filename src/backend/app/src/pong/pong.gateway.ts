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
import { GameState, PressedKeys } from './pong.types';
import { gameHasEnded, newGameState, updateGamestate } from './pong.game';
import { PongService } from './pong.service';
import { UserService } from 'src/user/user.service';
import { MatchService } from 'src/match/match.service';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsExceptionFilter } from 'src/websocket/websocket.exception.filter';
import { SocketService } from '../websocket/socket.service';
import { StatusService } from 'src/status/status.service';
import { UserState } from 'src/status/status.types';
import { ModeType } from 'src/match/match.interface';

type PlayerIndex = 'playerOne' | 'playerTwo';

function initPressedKeys(): PressedKeys {
  return {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false,
    q: false,
    r: false,
    f: false,
  };
}

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
    this.statusService.updateUserState(client.user.id, 'PLAYING');
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
    } else if (this.pongService.isChallenger(client)) {
      this.cancelChallenge(client);
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

  endGame(roomName: string, winner: PlayerIndex, loser: PlayerIndex) {
    console.log('game ended:', roomName, 'winner:', winner, 'loser:', loser);
    const gameRoom = this.pongService.getGameRoom(roomName);
    this.setStateIfOnline(gameRoom.playerOne.userId, 'VIEWING_SCORE_SCREEN');
    this.setStateIfOnline(gameRoom.playerTwo.userId, 'VIEWING_SCORE_SCREEN');
    this.addMatchHistory(roomName, winner, loser);
    this.deleteGame(roomName);
  }

  getWinner(roomName: string): PlayerIndex {
    const gameRoom = this.pongService.getGameRoom(roomName);
    if (
      gameRoom.gameState.playerOne.score > gameRoom.gameState.playerTwo.score
    ) {
      return 'playerOne';
    }
    return 'playerTwo';
  }

  getLoser(roomName: string): PlayerIndex {
    const gameRoom = this.pongService.getGameRoom(roomName);
    if (
      gameRoom.gameState.playerOne.score > gameRoom.gameState.playerTwo.score
    ) {
      return 'playerTwo';
    }
    return 'playerOne';
  }

  addMatchHistory(roomName: string, winner: PlayerIndex, loser: PlayerIndex) {
    const gameRoom = this.pongService.getGameRoom(roomName);

    this.createMatchHistory(
      gameRoom[winner].userId,
      gameRoom.gameState[winner].score,
      gameRoom[loser].userId,
      gameRoom.gameState[loser].score,
      gameRoom.gameState.default ? 'DEFAULT' : 'SPECIAL',
    );
  }

  async createMatchHistory(
    winnerId: number,
    winnerScore: number,
    loserId: number,
    loserScore: number,
    mode: ModeType,
  ) {
    const winner = await this.userService.findById(winnerId);
    const loser = await this.userService.findById(loserId);
    this.matchService.createMatch({
      winner,
      winnerScore,
      loser,
      loserScore,
      mode,
    });
  }

  @SubscribeMessage('surrenderMatch')
  surrenderMatch(@ConnectedSocket() client: SocketWithUser) {
    if (!this.pongService.isPlaying(client)) {
      return;
    }
    const gameRoom = this.pongService.getGameRoom(client.gameRoom);
    if (client.user.id === gameRoom.playerOne.userId) {
      this.endGame(client.gameRoom, 'playerTwo', 'playerOne');
      return;
    }
    this.endGame(client.gameRoom, 'playerOne', 'playerTwo');
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
      this.startNewGame(
        this.pongService.getChallenger(client),
        client,
        this.pongService.getMode(client),
      );
    }
    const challenger = this.pongService.getChallenger(client);
    this.pongService.deleteChallenge(challenger, client);
  }

  @SubscribeMessage('cancelChallenge')
  cancelChallenge(@ConnectedSocket() client: SocketWithUser) {
    console.log(client.user.id, 'cancels challenge');
    this.setStateIfOnline(client.user.id, 'ONLINE');
    const challenged = this.pongService.getChallenged(client);
    if (challenged) {
      this.sendChallengeRejection(challenged);
    }
    this.pongService.deleteChallenge(client, challenged);
  }

  @SubscribeMessage('rejectChallenge')
  rejectChallenge(@ConnectedSocket() client: SocketWithUser) {
    this.setStateIfOnline(client.user.id, 'ONLINE');
    const challenger = this.pongService.getChallenger(client);
    if (this.pongService.hasChallenger(client)) {
      this.sendChallengeRejection(challenger);
    }
    this.pongService.deleteChallenge(challenger, client);
  }

  sendChallengeRejection(client: SocketWithUser) {
    client.emit('rejectChallenge', 'challenge rejected');
    this.setStateIfOnline(client.user.id, 'ONLINE');
  }

  @SubscribeMessage('cancelMatchmaking')
  cancelMatchmaking(@ConnectedSocket() client: SocketWithUser) {
    this.pongService.cancelMatchmaking(client);
    this.setStateIfOnline(client.user.id, 'ONLINE');
  }

  // Check if there is another client ready to play, otherwise set client as waiting/searching
  matchMaking(client: SocketWithUser, mode: boolean) {
    if (!this.pongService.canMatch(mode)) {
      console.log(client.user.username, 'is searching');
      this.pongService.enterMatchmakingQueue(client, mode);
      this.setStateIfOnline(client.user.id, 'SEARCHING');
      return;
    }
    const matchedUser = this.pongService.getMatch(mode);
    if (matchedUser.id === client.id) {
      console.error('client matched with itself');
      return;
    }
    this.startNewGame(matchedUser, client, mode);
  }

  challenge(client: SocketWithUser, targetId: number, mode: boolean) {
    const target = this.pongService.getClientFromId(targetId);
    if (!target) {
      client.emit(
        'exception',
        'could not find target with id:' + targetId.toString(),
      );
      return;
    } else if (client.id === target.id) {
      client.emit('exception', 'you challenged yourself');
      return;
    } else if (this.statusService.getState(targetId) !== 'ONLINE') {
      client.emit('rejectChallenge', 'target is not available');
      return;
    }
    this.pongService.addChallenger(client, target, mode);
    this.setStateIfOnline(client.user.id, 'CHALLENGING');
    this.setStateIfOnline(target.user.id, 'CHALLENGED');
    target.emit('requestChallenge', { source: client.user });
  }

  // Create a new unique room for these clients to play in
  // Set client's state to PLAYING
  async startNewGame(
    clientOne: SocketWithUser,
    clientTwo: SocketWithUser,
    mode: boolean,
  ) {
    const roomName = this.pongService.generateRoomName();
    this.joinRoom(clientOne, roomName);
    this.joinRoom(clientTwo, roomName);

    this.setStateIfOnline(clientOne.user.id, 'PLAYING');
    this.setStateIfOnline(clientTwo.user.id, 'PLAYING');

    const gameState = newGameState(
      clientOne.user.username,
      clientTwo.user.username,
      mode,
    );
    // discuss: timeout for starting game
    setTimeout(() => {
      this.pongService.addGameRoom(roomName, {
        intervalId: undefined,
        playerOne: {
          userId: clientOne.user.id,
          disconnected: false,
          pressedKeys: initPressedKeys(),
        },
        playerTwo: {
          userId: clientTwo.user.id,
          disconnected: false,
          pressedKeys: initPressedKeys(),
        },
        observers: new Set<number>(),
        gameState,
      });
      this.startGameLoop(roomName, gameState);
    }, 100);
  }

  joinRoom(client: SocketWithUser, roomName: string) {
    client.join(roomName);
    client.gameRoom = roomName;
  }

  startGameLoop(roomName: string, gameState: GameState) {
    const gameRoom = this.pongService.getGameRoom(roomName);
    gameRoom.intervalId = setInterval(() => {
      updateGamestate(gameRoom);
      if (gameHasEnded(gameState)) {
        this.endGame(
          roomName,
          this.getWinner(roomName),
          this.getLoser(roomName),
        );
      } else {
        this.socketService.pongServer
          .to(roomName)
          .emit('updatePosition', gameState);
      }
    }, 1000 / 60);
  }

  @SubscribeMessage('movement')
  movement(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: PressedKeys,
  ) {
    const gameRoom = this.pongService.getGameRoom(client.gameRoom);
    if (!gameRoom) {
      return;
    }
    if (client.user.id === gameRoom.playerOne.userId) {
      gameRoom.playerOne.pressedKeys = data;
    } else if (client.user.id === gameRoom.playerTwo.userId) {
      gameRoom.playerTwo.pressedKeys = data;
    }
  }

  /*
  DTO: userId of user who is playing a game OR roomName of name of room to join
  */
  @SubscribeMessage('requestObserve')
  observe(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() observeDto: ObserveGameDto,
  ) {
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
  cancelObserve(@ConnectedSocket() client: SocketWithUser) {
    console.log(client.user.id, 'stops observing');
    this.pongService.cancelObserve(client);
    this.setStateIfOnline(client.user.id, 'ONLINE');
  }

  setStateIfOnline(id: number, newState: UserState) {
    if (this.statusService.getState(id) !== 'OFFLINE') {
      this.statusService.updateUserState(id, newState);
    }
  }

  @SubscribeMessage('exitScoreScreen')
  exitScoreScreen(@ConnectedSocket() client: SocketWithUser) {
    this.setStateIfOnline(client.user.id, 'ONLINE');
  }
}
