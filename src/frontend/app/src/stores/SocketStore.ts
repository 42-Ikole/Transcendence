import { defineStore } from "pinia";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";

const PONG_WS_ADDR = "http://localhost:3000/pong";

interface SocketStore {
	pong: Socket | null,
};

export const useSocketStore = defineStore("socket", {
	state: (): SocketStore => {
		return {
			pong: null,
		};
	},
	actions: {
		initPongSocket() {
			this.pong = io(PONG_WS_ADDR, {
				withCredentials: true
			});
		},
		disconnectSockets() {
			if (this.pong) {
				this.pong.disconnect();
			}
		},
	},
});
