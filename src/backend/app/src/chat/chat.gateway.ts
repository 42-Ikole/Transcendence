import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
	@SubscribeMessage('')
	handleMessage(
		@MessageBody() data: string,
		@ConnectedSocket() client: Socket
	): void {

	}
}