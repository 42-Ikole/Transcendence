import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import LoginView from "@/views/LoginView.vue";
import { isLoggedIn } from "@/utils/Login";
import Enable2FaView from "@/views/Enable2FaView.vue";
import RoomsView from "@/components/chatrooms/Rooms.vue";
import PongView from "@/views/PongView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/2fa",
    name: "2fa",
    component: Enable2FaView,
  },
  {
    path: "/chatrooms",
    name: "chatrooms",
    component: RoomsView,
	},
	{
    path: "/pong",
    name: "pong",
    component: PongView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Global redirect to login page if not authenticated
// Uncomment to add forced redirect

router.beforeEach((to, from) => {
  if (to.name === "login") {
    return true;
  }
  const status = isLoggedIn();
  if (!status) {
    return { name: "login" };
  }
});

export default router;
