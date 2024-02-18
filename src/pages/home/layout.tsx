/**
 * @file 后台/首页布局
 */
import { For, JSX, createSignal, onMount } from "solid-js";
import { Home, EyeOff, Tv, LogOut, Settings, Sparkles } from "lucide-solid";

import { PageKeys } from "@/store/routes";
import { DropdownMenu, KeepAliveRouteView } from "@/components/ui";
import { DropdownMenuCore, MenuItemCore } from "@/domains/ui";
// import { RouteViewCore } from "@/domains/route_view";
// import { Application } from "@/domains/app";
// import { Show } from "@/packages/ui/show";
import { ViewComponent, ViewComponentProps } from "@/store/types";
import { cn } from "@/utils";
import { pages } from "@/store/views";

export const HomeLayout: ViewComponent = (props) => {
  const { app, history, view } = props;

  // const [curSubView, setCurSubView] = createSignal(view.curView);
  const [subViews, setSubViews] = createSignal(view.subViews);

  view.onSubViewsChange((nextSubViews) => {
    // console.log("[LAYOUT]home/layout - view.onSubViewsChange", nextSubViews);
    setSubViews(nextSubViews);
  });
  // view.onCurViewChange((nextCurView) => {
  //   setCurSubView(nextCurView);
  // });
  const userMenu = new DropdownMenuCore({
    align: "end",
    side: "right",
    items: [
      new MenuItemCore({
        label: "用户设置",
        icon: <Settings class="w-4 h-4" />,
      }),
      new MenuItemCore({
        label: "退出登录",
        icon: <LogOut class="w-4 h-4" />,
        onClick() {
          history.push("root.login");
          userMenu.hide();
        },
      }),
    ],
  });

  const [menus, setMenus] = createSignal([
    {
      text: "首页",
      icon: <Home class="w-6 h-6" />,
      onClick() {
        history.push("root.home_layout.home_index");
      },
    },
    {
      text: "电视剧",
      icon: <Tv class="w-6 h-6" />,
      onClick() {
        history.push("root.home_layout.home_season");
      },
    },
    {
      text: "刮削结果",
      icon: <Sparkles class="w-6 h-6" />,
      onClick() {
        history.push("root.home_layout.home_unknown_media.home_unknown_media_movie");
      },
    },
  ]);

  onMount(() => {
    console.log("[PAGE]home/layout onMount");
  });

  return (
    <>
      <div class="flex w-full h-full bg-white">
        <div class="w-[248px] py-4 pl-2 pr-2 border border-r-slate-300">
          <div class="flex flex-col justify-between h-full w-full">
            <div class="relative flex-1 space-y-1 p-2 w-full h-full overflow-y-auto rounded-xl self-start">
              <For each={menus()}>
                {(menu) => {
                  const { icon, text, onClick } = menu;
                  return (
                    <div
                      class={cn(
                        "relative flex items-center px-4 py-2 space-x-2 rounded-lg opacity-80 cursor-pointer hover:bg-slate-300"
                        // highlight ? "bg-slate-200" : ""
                      )}
                      onClick={onClick}
                    >
                      <div class="w-6 h-6">{icon}</div>
                      <div class="flex-1 text-lg text-slate-800">
                        <div class="relative inline-block">{text}</div>
                      </div>
                    </div>
                  );
                }}
              </For>
              <div class="absolute bottom-4 left-1/2 -translate-x-1/2 ">
                <DropdownMenu store={userMenu}>
                  <div class="w-12 h-12 rounded-full bg-slate-500"></div>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1 bg-slate-100">
          <div class="relative w-full h-full">
            <For each={subViews()}>
              {(subView, i) => {
                const routeName = subView.name;
                const PageContent = pages[routeName as Exclude<PageKeys, "root">];
                return (
                  <KeepAliveRouteView
                    class={cn(
                      "absolute inset-0",
                      "data-[state=open]:animate-in data-[state=open]:fade-in",
                      "data-[state=closed]:animate-out data-[state=closed]:fade-out"
                    )}
                    store={subView}
                    index={i()}
                  >
                    <PageContent app={app} history={history} view={subView} />
                  </KeepAliveRouteView>
                );
              }}
            </For>
          </div>
        </div>
      </div>
    </>
  );
};
