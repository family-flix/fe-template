/**
 * @file 路由配置
 */
// import { RouteViewCore, onViewCreated } from "@/domains/route_view";

import { pages } from "@/pages";
import { PathnameKey, RouteConfig } from "@/types";

// export const pages: RouteViewCore[] = [];
// onViewCreated((created) => {
//   if (pages.includes(created)) {
//     return;
//   }
//   pages.push(created);
// });

// export const homeIndexPage = new RouteViewCore({
//   key: "/home/index",
//   title: "首页",
//   component: HomePage,
// });
// export const homeTaskProfilePage = new RouteViewCore({
//   key: "/home/task_profile",
//   title: "任务详情",
//   // component: TaskProfilePage,
//   component: TaskProfilePage,
// });
// export const homeTaskListPage = new RouteViewCore({
//   key: "/home/task",
//   title: "任务列表",
//   // component: TaskListPage,
//   component: TaskListPage,
// });
// export const homeTVProfilePage = new RouteViewCore({
//   key: "/home/tv_profile",
//   title: "电视剧详情",
//   // component: TVProfilePage,
//   component: HomeSeasonProfilePage,
// });
// export const homeSeasonListPage = new RouteViewCore({
//   key: "/home/tv",
//   title: "电视剧列表",
//   component: HomeSeasonListPage,
// });
// export const homeUnknownTVPage = new RouteViewCore({
//   key: "/home/unknown_media/season",
//   title: "未识别的电视剧",
//   component: UnknownSeasonListPage,
// });
// export const homeUnknownMoviePage = new RouteViewCore({
//   key: "/home/unknown_media/movie",
//   title: "未识别的电影",
//   component: UnknownMovieListPage,
// });
// export const homeUnknownMediaLayout = new RouteViewCore({
//   key: "/home/unknown_tv",
//   title: "未识别影视剧",
//   component: UnknownMediaLayout,
//   children: [homeUnknownTVPage, homeUnknownMoviePage],
// });
// // homeUnknownMediaLayout.replaceSubViews([homeUnknownTVPage, homeUnknownSeasonPage, homeUnknownMoviePage]);

// // export const homeLayout = new RouteViewCore({
// //   key: "/home",
// //   title: "首页",
// //   component: HomeLayout,
// //   children: [
// //     homeIndexPage,
// //     homeSeasonListPage,
// //     homeTVProfilePage,
// //     homeTaskListPage,
// //     homeTaskProfilePage,
// //     homeUnknownMediaLayout,
// //   ],
// // });
// export const loginPage = new RouteViewCore({
//   key: "/login",
//   title: "登录",
//   // component: LoginPage,
//   component: LoginPage,
// });
// export const registerPage = new RouteViewCore({
//   key: "/register",
//   title: "注册",
//   // component: RegisterPage,
//   component: RegisterPage,
// });
// export const testPage = new RouteViewCore({
//   key: "/test",
//   title: "测试",
//   // component: TestPage,
//   component: TestPage,
// });
// export const rootView = new RouteViewCore({
//   key: "/",
//   title: "ROOT",
//   component: "div",
//   // layers: true,
//   // children: [homeLayout, registerPage, loginPage, testPage],
// });

// const routes = [
//   {
//     path: '/',
//   },
// ];
// export const pages = {
//   HOME_LAYOUT: HomeLayout,
//   HOME_INDEX_PAGE: HomeIndexPage,
//   LOGIN_PAGE: LoginPage,
// };
type OriginalRouteConfigure = Record<
  PathnameKey,
  {
    title: string;
    destroy?: boolean;
    children?: OriginalRouteConfigure;
    component: unknown;
  }
>;
function apply(configure: OriginalRouteConfigure, parent: PathnameKey): RouteConfig[] {
  const routes = Object.keys(configure).map((pathname) => {
    const config = configure[pathname];
    const { title, destroy, component, children } = config;
    if (children) {
      const subRoutes = apply(children, pathname);
      return [
        {
          title,
          destroy,
          pathname,
          component,
          parent_pathname: parent,
        },
        ...subRoutes,
      ];
    }
    return [
      {
        title,
        destroy,
        pathname,
        component,
        parent_pathname: parent,
      },
    ];
  });
  return routes.reduce((a, b) => {
    return a.concat(b);
  }, []);
}
const configure: OriginalRouteConfigure = {
  "/": {
    title: "ROOT",
    component: "div",
    children: {
      "/home": {
        title: "首页布局",
        component: pages.HOME_LAYOUT,
        children: {
          "/home/index": {
            title: "首页",
            component: pages.HOME_INDEX_PAGE,
          },
          "/home/season": {
            title: "电视剧列表",
            component: pages.HOME_SEASON_LIST_PAGE,
          },
          "/home/season_profile": {
            title: "电视剧详情",
            destroy: true,
            component: pages.HOME_SEASON_PROFILE_PAGE,
          },
          "/home/unknown_media": {
            title: "未识别影视剧",
            component: pages.HOME_UNKNOWN_MEDIA_LAYOUT,
            children: {
              "/home/unknown_media/season": {
                title: "未识别电视剧",
                component: pages.HOME_UNKNOWN_MEDIA_SEASON_PAGE,
              },
              "/home/unknown_media/movie": {
                title: "未识别电影",
                component: pages.HOME_UNKNOWN_MEDIA_MOVIE_PAGE,
              },
            },
          },
        },
      },
      "/login": {
        title: "管理员登录",
        component: pages.LOGIN_PAGE,
      },
      "/register": {
        title: "管理员注册",
        component: pages.REGISTER_PAGE,
      },
      "/notfound": {
        title: "404",
        component: pages.NOT_FOUND_PAGE,
      },
    },
  },
};
const configs = apply(configure, "/");
export const routes: Record<PathnameKey, RouteConfig> = configs
  .map((a) => {
    return {
      [a.pathname]: a,
    };
  })
  .reduce((a, b) => {
    return {
      ...a,
      ...b,
    };
  }, {});
// @ts-ignore
window.__routes__ = routes;

export function find_route(pathname: PathnameKey) {
  const matched = routes[pathname];
  if (!matched) {
    return {
      key: "/notfound",
      title: "404",
      component: pages.NOT_FOUND_PAGE,
      parent_pathname: "/",
    };
  }
  return {
    key: matched.pathname,
    title: matched.title,
    component: matched.component,
    destroyAfterHide: matched.destroy,
    parent_pathname: matched.parent_pathname,
  };
}
