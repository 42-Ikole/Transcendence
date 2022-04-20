import { defineStore } from "pinia";
import { makeApiCall } from "@/utils/ApiCall";
import type { Chat } from "../components/chatrooms/Chatrooms.types";
import { useSocketStore } from "./SocketStore";

interface ChatStore {
  ownedChats: number[];
  adminChats: number[];
}

export const useChatStore = defineStore("chat", {
  state: (): ChatStore => {
    return {
      ownedChats: [],
      adminChats: [],
    };
  },
  actions: {
    isOwner(chatID: number): boolean {
      return this.ownedChats.includes(chatID);
    },
    isAdmin(chatID: number): boolean {
      return this.adminChats.includes(chatID);
    },
    async refresh() {
      const ownerResponse = await makeApiCall("/user/chat/owned");
      if (ownerResponse.ok) {
        const userOwnedChats: Chat[] = await ownerResponse.json();
        this.ownedChats = userOwnedChats.map((chat: Chat) => chat.id);
      }
      const adminResponse = await makeApiCall("/user/chat/admin");
      if (adminResponse.ok) {
        const userAdminChats = await adminResponse.json();
        this.adminChats = userAdminChats.map((chat: Chat) => chat.id);
      }
    },
    async init() {
      useSocketStore().chat.on("roleUpdate", this.refresh);
      await this.refresh();
    },
  },
});
