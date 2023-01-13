import { defineStore } from "pinia";
import { getShowMenuList, getRouterMenuList } from "@/utils/util";
import { getAuthButtonListApi } from "@/api/login/login";

// AuthStore 菜单、权限相关存储
export const useAuthStore = defineStore({
  id: "AuthState",
  state: () => ({
    // 原始菜单列表 后端返回
    authOriginMenuList: <Menu.MenuOptions[]>[],
    // 处理后的动态路由，不做持久化存储
    authMenuList: <any[]>[],
    // 按钮权限列表
    authButtonList: <string[]>[],
  }),
  getters: {
    // 后端返回的原始菜单列表
    authOriginMenuListGet: (state) => state.authOriginMenuList,
    // 后端返回的菜单列表 => 左侧菜单栏渲染，去除 hidden == 1 和 type > 5
    showMenuListGet: (state) => getShowMenuList(state.authOriginMenuList),
    // 后端返回的菜单列表 => 生成处理前的动态路由，去除 type > 5
    routerMenuListGet: (state) => getRouterMenuList(state.authOriginMenuList),
    // 处理后的动态路由
    authMenuListGet: (state) => state.authMenuList,
    // 按钮权限列表
    authButtonListGet: (state) => state.authButtonList,
  },
  actions: {
    // 获取按钮权限列表
    async getAuthButtonList() {
      // console.log("store,auth.ts 里获取按钮的 actions");
      const { data } = await getAuthButtonListApi();
      this.authButtonList = data;
    },
    // 设置菜单列表
    async setOriginAuthMenuList(menuList: Menu.MenuOptions[]) {
      this.authOriginMenuList = menuList;
    },
    // 设置动态路由
    async setAuthMenuList(menuList: any) {
      this.authMenuList = menuList;
    },
  },
  persist: { key: "AuthState", storage: window.localStorage, paths: ["authOriginMenuList", "authButtonList"] },
});
