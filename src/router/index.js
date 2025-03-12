import { createRouter, createWebHistory } from "vue-router";
import Register from "../components/Register.vue";
import Login from "../components/Login.vue";
import CreateDiary from "@/components/CreateDiary.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: Login,
    },
    {
      path: "/register", // Register 페이지 경로
      name: "register", // 이 부분이 'Register'가 아니라 'register'로 되어 있어야 해.
      component: Register,
    },
    {
      path: "/creatediary", // creatediary 페이지 경로
      name: "creatediary", //
      component: CreateDiary,
    },
  ],
});

export default router;
