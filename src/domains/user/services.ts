import { request } from "@/domains/request/utils";

/**
 * 用户登录
 * @param body
 * @returns
 */
export function login(values: { email: string; password: string }) {
  return request.post<{
    id: string;
    username: string;
    // name: string;
    // email: string;
    avatar: string;
    verified: string;
    // created: string;
    token: string;
  }>("/api/admin/user/login", values);
}

/**
 * 用户登录
 * @param body
 * @returns
 */
export function register(values: { email: string; password: string }) {
  return request.post<{
    id: string;
    username: string;
    // name: string;
    // email: string;
    avatar: string;
    verified: string;
    // created: string;
    token: string;
  }>("/api/admin/user/register", values);
}

export function logout(values: { email: string; password: string }) {
  return request.post("/api/admin/user/logout", values);
}

export function get_token() {
  return request.post("/api/token");
}

/**
 * 获取当前登录用户信息详情
 * @returns
 */
export function fetch_user_profile() {
  return request.post("/api/admin/user/profile");
}

/**
 * 成员通过授权链接访问首页时，验证该链接是否有效
 */
export function validate(body: { token: string }) {
  return request.post<{ token: string }>("/api/admin/user/validate", body);
}
