import { IsString, IsNotEmpty, IsOptional, IsIn, IsInt } from "class-validator";
import { User } from "src/orm/entities/user.entity";

const CHATROOM_TYPES = ["private", "protected", "public"];

export class CreateChatDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsOptional()
	password?: string;

	@IsString()
	@IsIn(CHATROOM_TYPES)
	type: string;
}

export class CreateChatInterface extends CreateChatDto {
	owner: User;
}

export class IncomingMessageDtO {
	@IsString()
	@IsNotEmpty()
	message: string;

	@IsString()
	@IsNotEmpty()
	chatName: string;
}

export class ChatRoomDto {
	@IsString()
	@IsNotEmpty()
	roomName: string;
}