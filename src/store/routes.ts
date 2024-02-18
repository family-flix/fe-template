/**
 * @file 路由配置
 */
// import { RouteViewCore, onViewCreated } from "@/domains/route_view";

// import { pages } from "@/pages/index";
// import { HomeLayout } from "@/pages/home/layout.tsx";
// import { HomeIndexPage } from "@/pages/home/index.tsx";
// import { HomeSeasonListPage } from "@/pages/season/index";
// import { HomeSeasonProfilePage } from "@/pages/season/profile";
// import { UnknownMediaLayout } from "@/pages/unknown_media/layout";
// import { UnknownSeasonListPage } from "@/pages/unknown_media/season";
// import { UnknownMovieListPage } from "@/pages/unknown_media/movie";
// import { RegisterPage } from "@/pages/register/index";
// import { LoginPage } from "@/pages/login/index";
// import { NotFoundPage } from "@/pages/notfound/index";

const configure = {
  root: {
    title: "ROOT",
    // name: "root",
    pathname: "/",
    component: "div",
    children: {
      home_layout: {
        title: "首页布局",
        // name: "home_layout",
        pathname: "/home",
        // component: HomeLayout,
        children: {
          home_index: {
            title: "首页",
            // name: "home_index",
            pathname: "/home/index",
            // component: HomeIndexPage,
            children: {},
          },
          home_season: {
            title: "电视剧列表",
            // name: "home_season",
            pathname: "/home/season",
            // component: HomeSeasonListPage,
            children: {},
          },
          home_season_profile: {
            title: "电视剧详情",
            // name: "home_season_profile",
            pathname: "/home/season_profile",
            // component: HomeSeasonProfilePage,
            children: {},
          },
          home_unknown_media: {
            title: "未识别影视剧",
            // name: "home_unknown_media",
            pathname: "/home/unknown_media",
            // component: UnknownMediaLayout,
            children: {
              home_unknown_media_season: {
                title: "未识别电视剧",
                // name: "home_unknown_media_season",
                pathname: "/home/unknown_media/season",
                // component: UnknownSeasonListPage,
                children: {},
              },
              home_unknown_media_movie: {
                title: "未识别电影",
                // name: "home_unknown_media_movie",
                pathname: "/home/unknown_media/movie",
                // component: UnknownMovieListPage,
                children: {},
              },
            },
          },
        },
      },
      login: {
        title: "管理员登录",
        // name: "login",
        pathname: "/login",
        // component: LoginPage,
        children: {},
      },
      register: {
        title: "管理员注册",
        // name: "register",
        pathname: "/register",
        // component: RegisterPage,
        children: {},
      },
      notfound: {
        title: "404",
        // name: "notfound",
        pathname: "/notfound",
        // component: NotFoundPage,
        children: {},
      },
    },
  },
};
type PageKeysType<T extends OriginalRouteConfigure, K = keyof T> = K extends keyof T & (string | number)
  ? `${K}` | (T[K] extends object ? `${K}.${PageKeysType<T[K]["children"]>}` : never)
  : never;
export type PageKeys = PageKeysType<typeof configure>;
export type PathnameKey = string;
export type RouteConfig = {
  /** 使用该值定位唯一 route/page */
  name: PageKeys;
  title: string;
  pathname: PathnameKey;
  parent: {
    name: string;
  };
  // component: unknown;
};
type OriginalRouteConfigure = Record<
  PathnameKey,
  {
    title: string;
    pathname: string;
    children: OriginalRouteConfigure;
    // component: unknown;
  }
>;
function apply(
  configure: OriginalRouteConfigure,
  parent: {
    pathname: PathnameKey;
    name: string;
  }
): RouteConfig[] {
  const routes = Object.keys(configure).map((key) => {
    const config = configure[key];
    const { title, pathname, children } = config;
    // 一个 hack 操作，过滤掉 root
    const name = [parent.name, key].filter(Boolean).join(".") as PageKeys;
    if (children) {
      const subRoutes = apply(children, {
        name,
        pathname,
      });
      return [
        {
          title,
          name,
          pathname,
          // component,
          parent: {
            name: parent.name,
          },
        },
        ...subRoutes,
      ];
    }
    return [
      {
        title,
        name,
        pathname,
        // component,
        parent: {
          name: parent.name,
        },
      },
    ];
  });
  return routes.reduce((a, b) => {
    return a.concat(b);
  }, []);
}
const configs = apply(configure, {
  name: "",
  pathname: "/",
});
export const routes: Record<PathnameKey, RouteConfig> = configs
  .map((a) => {
    return {
      [a.name]: a,
    };
  })
  .reduce((a, b) => {
    return {
      ...a,
      ...b,
    };
  }, {});
export const routesWithPathname: Record<PathnameKey, RouteConfig> = configs
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
// configs.home_layout.parent_pathname
// export function find_route(pathname: PathnameKey) {
//   const matched = routes[pathname];
//   if (!matched) {
//     return {
//       key: "/notfound",
//       title: "404",
//       component: NotFoundPage,
//       parent_pathname: "/",
//     };
//   }
//   return {
//     key: matched.pathname,
//     title: matched.title,
//     component: matched.component,
//     destroyAfterHide: matched.destroy,
//     parent_pathname: matched.parent_pathname,
//   };
// }
