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
    init() {
      this.initPongSocket();
    },
    initPongSocket() {
      this.pong = io(PONG_WS_ADDR, { withCredentials: true });
      this.pong.on("exception", (error: string) => {
        console.error("Received Exception:", error);
      });
      this.pong.on("startGame", () => {
        useUserStore().setState("PLAYING");
      });
      this.pong.on("endGame", () => {
        useUserStore().setState("ONLINE");
      });
      this.pong.on("observeGame", () => {
        useUserStore().setState("OBSERVING");
      });
      this.pong.on("requestChallenge", (user: any) => {
        console.log("challenge received from:", user.username);
        useUserStore().setState("CHALLENGED");
      });
      this.pong.on("rejectChallenge", () => {
        console.log("challenge got rejected");
        useUserStore().setState("ONLINE");
      });
    },
    disconnectSockets() {
      if (this.pong) {
        this.pong.disconnect();
      }
    },
  },
});
