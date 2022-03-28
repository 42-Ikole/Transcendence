import { useUserStore, type AuthenticatedState } from "@/stores/UserStore";
import type { Router } from "vue-router";
import makeApiCall from "./ApiCall";

// Warning: hard redirects the user to the API
type OAuthProvider = "github" | "discord" | "intra";
export function loginUser(provider: OAuthProvider) {
  window.location.href = `http://localhost:8080/api/auth/login/${provider}`;
}

export async function logoutUser(router: Router) {
  const response = await makeApiCall("/auth/logout", {
    method: "DELETE",
  });
  const userStore = useUserStore();
  router.push("/login");
  userStore.logout();
}

export async function getUserInfo() {
  return useUserStore().$state;
}

export async function checkUserSession() {
  if (isLoggedIn()) {
    return;
  }
  const response = await makeApiCall("/auth/status");
  const state: AuthenticatedState = (await response.json()).state;
  const userStore = useUserStore();
  userStore.setAuthState(state);
  console.log("Frontend State:", state);
  if (state === "AUTHENTICATED") {
    await userStore.login();
  }
}

export function isLoggedIn() {
  return useUserStore().isAuthenticated;
}
