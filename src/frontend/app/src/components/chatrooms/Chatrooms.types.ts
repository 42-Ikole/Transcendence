export interface Chat {
  id: number;
  name: string;
  type: string;
  messages: string[];
}

export interface SendChatMessage {
  chatName: string;
  message: string;
}

export interface AllChats {
  joinedChats: Chat[];
  otherChats: Chat[];
}
