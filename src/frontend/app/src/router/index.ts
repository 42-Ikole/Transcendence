import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import LoginView from "@/views/LoginView.vue";
import { isLoggedIn } from "@/utils/Login";
import ProfileView from "@/views/ProfileView.vue";
import PongView from "@/views/PongView.vue";
import FriendView from "@/views/FriendView.vue";
import EditProfileView from "@/views/EditProfileView.vue";

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
    path: "/profile",
    name: "profile",
    component: ProfileView,
  },
  {
    path: "/profile/edit",
    name: "profile-edit",
    component: EditProfileView,
  },
  {
    path: "/pong",
    name: "pong",
    component: PongView,
  },
  {
    path: "/friend-view",
    name: "friend-view",
    component: FriendView,
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
