import { defineStore } from "pinia";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import { useUserStore } from "./UserStore";
import type { StatusUpdate } from "@/types/StatusTypes";

const PONG_WS_ADDR = "http://localhost:3000/pong";
const STATUS_WS_ADDR = "http://localhost:3000/status";

interface SocketStore {
  status: Socket | null;
  pong: Socket | null;
}


export const useSocketStore = defineStore("socket", {
  state: (): SocketStore => {
    return {
      status: null,
      pong: null,
    };
  },
  actions: {
    init() {
      this.initStatusSocket();
      this.initPongSocket();
    },
    initStatusSocket() {
      this.status = io(STATUS_WS_ADDR, { withCredentials: true });
      this.status.on("statusUpdate", (update: StatusUpdate) => {
        useUserStore().setState(update.newState);
      });
    },
    initPongSocket() {
      this.pong = io(PONG_WS_ADDR, { withCredentials: true });
      this.pong.on("exception", (error: string) => {
        console.error("Received Exception:", error);
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
