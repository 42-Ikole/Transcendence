import { Injectable } from "@nestjs/common";

@Injectable()
export class ChatService {
	findAll(): any {
		return 'find all saus';
	}

	makeOne(param: any): any {
		return 'ik snarp het nog niet hemelaal';
	}
}