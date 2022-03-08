import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { checkUserSession } from "./utils/Login";

async function bootstrap() {
	const app = createApp(App);
	app.use(createPinia());
	// Check with server if user is logged in.
	await checkUserSession();
	app.use(router);
	app.mount("#app");
}
bootstrap();
