import http from "@/api";
// * 登录模块 interface
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
    type: number;
    captchaId?: string;
    code?: string;
  }
  export interface ResLogin {
    token: string;
    [key: string]: any;
  }
  export interface ResCaptcha {
    captchaId: string;
    img: string;
  }
}

/**
 * @name 登录模块
 */
export const login = (params: Login.ReqLoginForm) => {
  // console.warn("调用 login 接口");
  return http.post<Login.ResLogin>(`/auth/login`, params);
  return http.post<Login.ResLogin>(`/auth/login`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
};
/**
 * @name 获取验证码图片
 */
export const captcha = () => {
  return http.get<Login.ResCaptcha>(`/auth/captcha`);
};
/**
 * @name 获取按钮权限列表
 */
export const getAuthButtonListApi = () => {
  // console.warn("调用获取按钮权限接口");
  return http.get<string[]>(`/menu/user/permission`);
};
