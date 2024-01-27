/**
 * @file 应用实例，也可以看作启动入口，优先会执行这里的代码
 * 应该在这里进行一些初始化操作、全局状态或变量的声明
 */
import { ListCore } from "@/domains/list";
import { Application } from "@/domains/app";
import { NavigatorCore } from "@/domains/navigator";
import { RouteViewCore, onViewCreated } from "@/domains/route_view";
import { HttpClientCore } from "@/domains/http_client";
import { BizError } from "@/domains/error";
// import { has_admin } from "@/services";
import { Result } from "@/types";

import { cache } from "./cache";
import { user } from "./user";
import { routes } from "./routes";

NavigatorCore.prefix = PATHNAME_PREFIX;

export const router = new NavigatorCore();
// const views: Record<string, RouteViewCore> = {};
// onViewCreated((view) => {
//   views[view.key] = view;
// });
const rootView = new RouteViewCore({
  key: "/",
  title: "ROOT",
  component: "div",
  visible: true,
  parent: null,
  views: [],
});
export const app = new Application({
  view: rootView,
  user,
  router,
  routes,
  views: {
    "/": rootView,
  },
  async beforeReady() {
    if (!user.isLogin) {
      // const r = await has_admin();
      // if (r.error) {
      //   return Result.Ok(null);
      // }
      // const { existing } = r.data;
      // if (!existing) {
      //   app.showView(registerPage);
      //   user.needRegister = true;
      //   return Result.Ok(null);
      // }
      // app.showView(loginPage);
      // rootView.showSubView(loginPage);
      return Result.Ok(null);
    }
    await app.user.validate();
    return Result.Ok(null);
  },
});
export const request = new HttpClientCore({
  app,
  user,
});
// @ts-ignore
window.__APP = app;
// setApp(app);
user.onTip((msg) => {
  app.tip(msg);
});
user.onLogin((profile) => {
  cache.set("user", profile);
  // app.showView(homeIndexPage);
  // homeLayout.showSubView(homeIndexPage);
  // rootView.showSubView(homeLayout);
  // router.push("/home/index");
});
user.onLogout(() => {
  cache.clear("user");
  // app.showView(loginPage);
});
user.onExpired(() => {
  cache.clear("user");
  app.tip({
    text: ["token 已过期，请重新登录"],
  });
  // app.showView(loginPage);
});

ListCore.commonProcessor = <T>(
  originalResponse: any
): {
  dataSource: T[];
  page: number;
  pageSize: number;
  total: number;
  empty: boolean;
  noMore: boolean;
  error: BizError | null;
} => {
  if (originalResponse === null) {
    return {
      dataSource: [],
      page: 1,
      pageSize: 20,
      total: 0,
      noMore: false,
      empty: false,
      error: null,
    };
  }
  try {
    const data = originalResponse.data || originalResponse;
    const { list, page, page_size, total, noMore, no_more, next_marker } = data;
    const result = {
      dataSource: list,
      page,
      pageSize: page_size,
      total,
      empty: false,
      noMore: false,
      error: null,
      next_marker,
    };
    if (total <= page_size * page) {
      result.noMore = true;
    }
    if (no_more !== undefined) {
      result.noMore = no_more;
    }
    if (noMore !== undefined) {
      result.noMore = noMore;
    }
    if (next_marker === null) {
      result.noMore = true;
    }
    if (list.length === 0 && page === 1) {
      result.empty = true;
    }
    if (list.length === 0) {
      result.noMore = true;
    }
    return result;
  } catch (error) {
    return {
      dataSource: [],
      page: 1,
      pageSize: 20,
      total: 0,
      noMore: false,
      empty: false,
      error: new BizError(`${(error as Error).message}`),
      // next_marker: "",
    };
  }
};
