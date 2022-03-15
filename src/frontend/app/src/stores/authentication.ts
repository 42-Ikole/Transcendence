import { defineStore } from "pinia";

export type AuthenticatedState = "AUTHENTICATED" | "2FA" | "OAUTH";

export const useAuthenticationStore = defineStore("authentication", {
  state: () => {
    return {
      authenticatedState: "OAUTH" as AuthenticatedState,
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
    },
    logout() {
      this.setState("OAUTH");
    },
  },
});
