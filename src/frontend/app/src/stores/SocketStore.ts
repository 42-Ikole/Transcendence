import { defineStore } from "pinia";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import { useUserStore } from "./UserStore";

const PONG_WS_ADDR = "http://localhost:3000/pong";

interface SocketStore {
  pong: Socket | null;
}

export const useSocketStore = defineStore("socket", {
  state: (): SocketStore => {
    return {
      pong: null,
    };
  },
  actions: {
    initPongSocket() {
      this.pong = io(PONG_WS_ADDR, {
        withCredentials: true,
      });
      this.pong.on('exception', (error: string) => {
        console.error(error);
      });
      this.pong.on('startGame', () => {
        useUserStore().setState("PLAYING");
      });
    },
    disconnectSockets() {
      if (this.pong) {
        this.pong.disconnect();
      }
    },
  },
});
