import { defineStore } from "pinia";
import { useSocketStore } from "./SocketStore";

export type UserState = "OFFLINE" | "ONLINE" | "SEARCHING" | "PLAYING" | "OBSERVING" | "CHALLENGED";
export type AuthenticatedState = "AUTHENTICATED" | "2FA" | "OAUTH";

interface UserStore {
	state: UserState;
	authenticatedState: AuthenticatedState;
}

export const useUserStore = defineStore("user", {
  state: (): UserStore => {
    return {
      state: "OFFLINE",
      authenticatedState: "OAUTH",
    };
  },
  getters: {
    isAuthenticated: (state) => {
      return state.authenticatedState === "AUTHENTICATED";
    },
  },
  actions: {
    setState(state: UserState) {
      console.log("New UserState:", state);
      this.state = state;
    },
    setAuthState(state: AuthenticatedState) {
      this.authenticatedState = state;
    },
    setTwoFactor() {
      this.authenticatedState = "2FA";
    },
    login() {
      this.authenticatedState = "AUTHENTICATED";
      this.state = "ONLINE";
      useSocketStore().initPongSocket();
    },
    logout() {
      this.authenticatedState = "OAUTH";
      useSocketStore().disconnectSockets();
    },
  },
});
