import { defineStore }from "pinia";

export const useAuthenticationStore = defineStore('authentication', {
	state: () => {
		return {
			isAuthenticated: false,
		};
	},
	getters: {
		getAuthenticationStatus: (state) => {
			return state.isAuthenticated;
		}
	},
	actions: {
		login() {
			this.isAuthenticated = true;
		},
		logout() {
			this.isAuthenticated = false;
		},
	},
});
