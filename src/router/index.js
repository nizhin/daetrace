import { createRouter, createWebHistory } from "vue-router";
import { getCurrentUser, useFirebaseAuth } from "vuefire";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

import Dashboard from "../views/Dashboard.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LogIn.vue"),
      //meta: { loggedIn: true },
    },
    {
      path: "/",
      name: "dashboard",
      component: Dashboard,
      //meta: { requiresAuth: true },
    },
    {
      path: "/category",
      name: "category",
      component: () => import("../views/Category.vue"),
      //meta: { requiresAuth: true },
    },
    {
      path: "/session",
      name: "session",
      component: () => import("../views/Session.vue"),
      //meta: { requiresAuth: true },
    },
  ],
});

export default router;