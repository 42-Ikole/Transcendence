import { defineStore } from "pinia";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import { useUserStore, type UserState } from "./UserStore";

const PONG_WS_ADDR = "http://localhost:3000/pong";
const CHAT_WS_ADDR = "http://localhost:3000/chat";
const STATUS_WS_ADDR = "http://localhost:3000/status";

interface SocketStore {
  status: Socket | null;
  pong: Socket | null;
  chat: Socket | null;
}

interface StatusUpdate {
  userId: number;
  newState: UserState;
}

export const useSocketStore = defineStore("socket", {
  state: (): SocketStore => {
    return {
      status: null,
      pong: null,
      chat: null,
    };
  },
  actions: {
    init() {
      this.initPongSocket();
      this.initChatSocket();
      this.initStatusSocket();
    },
    initStatusSocket() {
      this.status = io(STATUS_WS_ADDR, { withCredentials: true });
      this.status.on("statusUpdate", (update: StatusUpdate) => {
        useUserStore().setState(update.newState);
      });
      this.status.on("friendStatusUpdate", (update: StatusUpdate) => {
        console.log("other user:", update);
      });
    },
    initPongSocket() {
      console.log("init pong...");
      this.pong = io(PONG_WS_ADDR, { withCredentials: true });
      this.pong.on("exception", (error: string) => {
        console.error("Received Exception:", error);
      });
    },
    initChatSocket() {
      this.chat = io(CHAT_WS_ADDR, {
        withCredentials: true,
      });
    },
    disconnectSockets() {
      if (this.pong) {
        this.pong.disconnect();
      }
      if (this.status) {
        this.status.disconnect();
      }
    },
  },
});
