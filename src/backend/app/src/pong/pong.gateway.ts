import {
  WebSocketServer,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RequestMatchDto, SocketWithUser } from '../websocket/websocket.types';
import { GameRoom, GameState } from './pong.types';
import { gameHasEnded, movePlayer, newGameState, updateGamestate } from './pong.game';
import { PongService } from './pong.service';

/*
Endpoints:
  `requestMatch`
  `movement`
*/

@WebSocketGateway({
  namespace: '/pong',
  cors: {
    credentials: true,
    origin: ['http://localhost:8080', 'http://localhost:3000'],
  },
})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private pongService: PongService,
  ) {}

  @WebSocketServer() wss: Server;

  async handleConnection(client: SocketWithUser) {
    client.user = await this.pongService.userFromCookie(client.handshake.headers.cookie);
    if (!client.user) {
      console.log("/pong connection denied: NO USER FOUND:", client.id);
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
    client.emit('startGame');
  }

  handleDisconnect(client: SocketWithUser) {
    if (this.pongService.isPlaying(client)) {
      this.pongService.disconnectUser(client);
      if (this.pongService.bothPlayersDisconnected(client.gameRoom)) {
        console.log("both players disconnected, removing gameRoom:", client.gameRoom);
        this.deleteGame(client.gameRoom);
      }
    }
    this.pongService.removeClient(client);
    console.log('/pong Disconnect:', client.user.username);
  }

  deleteGame(roomName: string) {
    const gameState = this.pongService.getGameState(roomName);
    this.wss.to(roomName).emit("endGame", gameState);
    this.pongService.deleteGameRoom(roomName);
    this.wss.socketsLeave(roomName);
  }

  endGame(roomName: string) {
    console.log("game ended:", roomName);
    this.deleteGame(roomName);
  }

  /*
	Data:
		TYPE: "matchmaking" | "challenge"
		TARGET: "_user_id_" | null
	*/
  @SubscribeMessage('requestMatch')
  requestMatch(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: RequestMatchDto,
  ) {
    if (data.type === "matchmaking") {
      this.matchMaking(client);
    } else {
      console.log("Challenge:", data);
    }
  }

  // Check if there is another client ready to play, otherwise set client as waiting/searching
  matchMaking(client: SocketWithUser) {
	  if (!this.pongService.canMatch(client)) {
      console.log(client.user.username, "is searching");
      this.pongService.enterMatchmakingQueue(client);
      return;
	  }
    const matchedUser = this.pongService.getMatch(client);
    if (matchedUser.id === client.id) {
      console.error("client matched with itself");
      return;
    }
    // TODO: disallow a user to play against themselves, for now it is useful for testing
    // User shouldn't be able to search while they are already searching on a different machine
    this.startNewGame(matchedUser, client);
  }

  // Create a new unique room for these clients to play in
  // Signal to the clients that they can play
  // Add the game to a record (map) of games being played
  startNewGame(clientOne: SocketWithUser, clientTwo: SocketWithUser) {
    if (clientOne.user.id === clientTwo.user.id) {
      clientOne.emit("exception", "WARNING: you are playing with yourself");
      clientTwo.emit("exception", "WARNING: you are playing with yourself");
    }
    const roomName = this.pongService.generateRoomName();
    console.log(clientOne.user.username, "vs", clientTwo.user.username, "in", roomName);
    this.joinRoom(clientOne, roomName);
    this.joinRoom(clientTwo, roomName);
    this.wss.to(roomName).emit('startGame');
    const gameState = newGameState(clientOne.user.username, clientTwo.user.username);
    const intervalId = this.startGameLoop(roomName, gameState);
    this.pongService.addGameRoom(roomName, {
      intervalId,
      playerOne: { socketId: clientOne.id, userId: clientOne.user.id, disconnected: false },
      playerTwo: { socketId: clientTwo.id, userId: clientTwo.user.id, disconnected: false },
      observers: [],
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
        this.wss.to(roomName).emit('updatePosition', gameState);
      }
    }, 1000 / 60);
    return intervalId;
  }

  @SubscribeMessage('movement')
  movement(client: SocketWithUser, data: Boolean[]) {
    const room = client.gameRoom;
    if (!room) {
      return;
    }
    const gameRoom = this.pongService.getGameRoom(room);
    if (client.id === gameRoom.playerOne.socketId) {
      movePlayer(gameRoom.gameState.playerOne.bar, data);
    } else if (client.id === gameRoom.playerTwo.socketId) {
      movePlayer(gameRoom.gameState.playerTwo.bar, data);
    }
  }
}
