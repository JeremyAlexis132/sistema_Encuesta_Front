import { createRouter, createWebHistory } from "vue-router/auto";
import LoginUser from "@/modules/user/views/LoginView.vue";
import userRouter from "@/modules/user/router";
import LoginAdmin from "@/modules/admin/views/LoginView.vue";
import adminRouter from "@/modules/admin/router";
import PageNotFound from "@/components/PageNotFound.vue";

const routes = [
  {
    path: "/",
    name: "mainView",
    redirect:"/user",
  },
  {
    path: "/user",
    name: "userLogin",
    component: () => Promise.resolve(LoginUser),
  },
  {
    path: "/user",
    ...userRouter
  },
  {
    path: "/admin",
    name: "adminLogin",
    component: () => Promise.resolve(LoginAdmin),
  },
  {
    path: "/admin",
    ...adminRouter
  },
  {
    path: "/:pathMatch(.*)*",
    name: "PageNotFound",
    component: () => Promise.resolve(PageNotFound),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), 
  routes,
});

router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
