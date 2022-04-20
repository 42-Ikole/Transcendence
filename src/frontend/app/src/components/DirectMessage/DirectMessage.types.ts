import type { PublicUser } from "@/types/UserType";

export interface Message {
  id: number;
  author: PublicUser;
  message: string;
}

export interface DirectMessage {
  id: number;
  userOne: PublicUser | undefined;
  userTwo: PublicUser | undefined;
  messages: Message[] | undefined;
}
