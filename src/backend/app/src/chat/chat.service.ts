import { Injectable } from "@nestjs/common";
import { CreateChatDto } from "./chat.types";

@Injectable()
export class ChatService {
	findAll(): any {
		return 'find all saus';
	}

	makeOne(param: CreateChatDto): any {
		console.log("type", param.type);
		console.log("name", param.name);
		console.log("password", param.password)
		return 'ik snarp het nog niet hemelaal';
	}
}
