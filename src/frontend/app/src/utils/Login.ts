import {
  useAuthenticationStore,
  type AuthenticatedState,
} from "@/stores/authentication";
import { useSocketStore } from "@/stores/SocketStore";
import type { Router } from "vue-router";
import makeApiCall from "./ApiCall";

// Warning: hard redirects the user to the API
export function loginUser() {
  window.location.href = "http://localhost:8080/api/auth/login";
}

export async function logoutUser(router: Router) {
  const response = await makeApiCall("/auth/logout", {
    method: "DELETE",
  });
  const authStore = useAuthenticationStore();
  router.push("/login");
  authStore.logout();
}

export async function getUserInfo() {
  const response = await makeApiCall("/auth/status");
  return response.json();
}

export async function checkUserSession() {
  if (isLoggedIn()) {
    return;
  }
  const response = await makeApiCall("/auth/status");
  const state: AuthenticatedState = (await response.json()).state;
  const authStore = useAuthenticationStore();
  authStore.setState(state);
  console.log("Frontend State:", state);
  if (state === "AUTHENTICATED") {
    authStore.login();
  }
}

export function isLoggedIn() {
  const authentication = useAuthenticationStore();
  return authentication.isAuthenticated;
}
