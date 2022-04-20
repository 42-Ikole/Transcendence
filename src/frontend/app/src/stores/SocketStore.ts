import { defineStore } from "pinia";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import { useUserStore } from "./UserStore";
import type { StatusUpdate } from "@/types/StatusTypes";

const PONG_WS_ADDR = "http://localhost:3000/pong";
const CHAT_WS_ADDR = "http://localhost:3000/chat";
const STATUS_WS_ADDR = "http://localhost:3000/status";

interface SocketStore {
  status: Socket | null;
  pong: Socket | null;
  chat: Socket | null;
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
      this.initStatusSocket();
      this.initPongSocket();
      this.initChatSocket();
    },
    initStatusSocket() {
      this.status = io(STATUS_WS_ADDR, { withCredentials: true });
      this.status.on("statusUpdate", (update: StatusUpdate) => {
        useUserStore().setState(update.newState);
      });
    },
    initPongSocket() {
      this.pong = io(PONG_WS_ADDR, { withCredentials: true });
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
      if (this.chat) {
        this.chat.disconnect();
      }
    },
  },
});
