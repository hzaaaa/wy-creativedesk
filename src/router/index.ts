import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Layout from "@/layouts/Layout.vue";
import { useAuthStore } from "@/store/auth";
import { initDynamicRouter } from "./dynamicRouter";
import { useGlobalStore } from "@/store";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue"), // 注意这里要带上 文件后缀.vue
  },
  {
    path: "/404",
    component: () => import("@/components/ErrorMessage/404.vue"),
  },
  {
    path: "/info",
    component: Layout,
    children: [
      {
        path: "",
        name: "Info",
        component: () => import("@/views/info/Info.vue"),
      },
    ], // 注意这里要带上 文件后缀.vue
  },
  // {
  //   path: "/:catchAll(.*)",
  //   component: () => import("@/components/ErrorMessage/404.vue"),
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const blackList = ["/account"];
// const blackList: any = [];

/**
 * @description 前置路由守卫
 */
router.beforeEach(async (to, from, next) => {
  // console.log("from", from);
  // console.log("to", to);

  const globalStore = useGlobalStore();

  // 1. 如果访问登录页，没有 token 直接放行，有 token 停留在当前页
  if (to.path.startsWith("/login")) {
    return next();
    // if (!globalStore.token || from.path === "/") return next();
    // else return next(from.fullPath);
  }

  // 2. 判断是否有 token，没有重定向到登录页
  if (!globalStore.token) {
    const path = `/login?redirect=${to.path}&params=${JSON.stringify(to.query ? to.query : to.params)}`;
    return next(path);
  }

  // 3. 如果没有菜单列表，重新请求菜单列表并添加动态路由（手动刷新、输入地址跳转时）
  const authStore = useAuthStore();
  if (!authStore.authMenuList.length) {
    await initDynamicRouter();
    return next({ ...to, replace: true });
  }

  // 4. 如果在路由黑名单，直接跳转 404 页面
  if (blackList.includes(to.path)) {
    next("/404");
    return;
  }

  // 5. 正常访问页面
  next();
});

export default router;
