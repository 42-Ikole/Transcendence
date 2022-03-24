import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer, OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: ['http://localhost:8080', 'http://localhost:3000'],
		credentials: true,
	},
	namespace: '/chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
	@WebSocketServer() wss: Server;

	afterInit(server: Server) {
		console.log('chat gateway: OnInit');
	}
	handleDisconnect(client: Socket) {
		console.log('chat gateway: OnDisconnect');
		console.log('client id:', client.id);
	}
	handleConnection(client: Socket, ...args: any[]) {
		console.log('chat gateway: OnConnection');
		console.log('client id:', client.id);
	}
	@SubscribeMessage('messageToChat')
	messageToChat(
		@MessageBody() data: string,
		@ConnectedSocket() client: Socket
	): void {
		console.log("I've got a message to chat!");
		console.log(data);
		this.wss.emit('messageToClient', data);
	}
}
