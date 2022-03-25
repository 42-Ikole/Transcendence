import { defineStore } from "pinia";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";

const PONG_WS_ADDR = "http://localhost:3000/pong";
const CHAT_WS_ADDR = "http://localhost:3000/chat";

interface SocketStore {
  pong: Socket | null;
  chat: Socket | null;
}

export const useSocketStore = defineStore("socket", {
  state: (): SocketStore => {
    return {
      pong: null,
      chat: null,
    };
  },
  actions: {
    init() {
      this.initPongSocket();
      this.initChatSocket();
    },
    initPongSocket() {
      this.pong = io(PONG_WS_ADDR, {
        withCredentials: true,
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
    },
  },
});
