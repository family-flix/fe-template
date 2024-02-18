import { prepare } from "@/domains/request_v2/utils";

/**
 * 用户登录
 * @param body
 * @returns
 */
export function login() {
  return prepare<
    { email: string; password: string },
    {
      id: string;
      username: string;
      // name: string;
      // email: string;
      avatar: string;
      verified: string;
      // created: string;
      token: string;
    }
  >({ url: "/api/admin/user/login" });
}

/**
 * 用户登录
 * @param body
 * @returns
 */
export function register() {
  return prepare<
    { email: string; password: string },
    {
      id: string;
      username: string;
      // name: string;
      // email: string;
      avatar: string;
      verified: string;
      // created: string;
      token: string;
    }
  >({ url: "/api/admin/user/register" });
}

export function logout() {
  return prepare<{ email: string; password: string }, void>({ url: "/api/admin/user/logout", method: "POST" });
}

export function get_token() {
  return prepare({ url: "/api/token" });
}

/**
 * 获取当前登录用户信息详情
 * @returns
 */
export function fetch_user_profile() {
  return prepare({ url: "/api/admin/user/profile" });
}

/**
 * 成员通过授权链接访问首页时，验证该链接是否有效
 */
export function validate() {
  return prepare<{ token: string }, { token: string }>({ url: "/api/admin/user/validate" });
}
