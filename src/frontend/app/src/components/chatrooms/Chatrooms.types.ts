export interface Chat {
	id: number;
	name: string;
	password: string;
	type: string;
	messages: string[];
}

export interface SendChatMessage {
	chatName: string;
	message: string;
}