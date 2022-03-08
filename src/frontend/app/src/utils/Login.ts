import { useAuthenticationStore } from "@/stores/authentication";
import makeApiCall from "./ApiCall"

// Warning: hard redirects the user to the API
export function loginUser() {
	window.location.href = 'http://localhost:8080/api/auth/login';
}

export async function logoutUser() {
	if (!isLoggedIn()) {
		return;
	}
	const response = await makeApiCall('/auth/logout', {
		method: "DELETE",
	});
	const authStore = useAuthenticationStore();
	authStore.logout();
}

export async function getUserInfo() {
	const response = await makeApiCall('/auth/status');
	if (response.status !== 200) {
		return null;
	}
	return response.json();
}

export async function checkUserSession() {
	if (isLoggedIn()) {
		return;
	}
	const response = await makeApiCall('/auth/status');
	if (response.status === 200) {
		const authStore = useAuthenticationStore();
		authStore.login();
	}
}

export function isLoggedIn() {
	const authentication = useAuthenticationStore();
	return authentication.getAuthenticationStatus;
}
