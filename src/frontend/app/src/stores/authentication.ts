import { defineStore } from "pinia";
import { useSocketStore } from "./SocketStore";

export type AuthenticatedState = "AUTHENTICATED" | "2FA" | "OAUTH";

interface AuthenticatedStore {
  authenticatedState: AuthenticatedState,
};

export const useAuthenticationStore = defineStore("authentication", {
  state: (): AuthenticatedStore => {
    return {
      authenticatedState: "OAUTH",
    };
  },
  getters: {
    isAuthenticated: (state) => {
      return state.authenticatedState === "AUTHENTICATED";
    },
  },
  actions: {
    setState(state: AuthenticatedState) {
      this.authenticatedState = state;
    },
    login() {
      this.setState("AUTHENTICATED");
      useSocketStore().initPongSocket();
    },
    logout() {
      this.setState("OAUTH");
      useSocketStore().disconnectSockets();
    },
  },
});
