/**
 * @file 后台/首页布局
 */
import { For, JSX, createSignal, onMount } from "solid-js";
import { Home, EyeOff, Tv, LogOut, Settings, Sparkles } from "lucide-solid";

import { pages } from "@/store/views";
import { PageKeys } from "@/store/routes";
import { DropdownMenu, KeepAliveRouteView, ScrollView } from "@/components/ui";
import { DropdownMenuCore, MenuItemCore, ScrollViewCore } from "@/domains/ui";
// import { RouteViewCore } from "@/domains/route_view";
// import { Application } from "@/domains/app";
// import { Show } from "@/packages/ui/show";
import { ViewComponent, ViewComponentProps } from "@/store/types";
import { cn } from "@/utils";

import { PullRefreshWPTVersion } from "./tmp";

export const HomeLayout: ViewComponent = (props) => {
  const { app, history, view } = props;

  let containerRef: undefined | HTMLDivElement;
  let loadingRef: undefined | HTMLDivElement;
  let topPlaceholder: undefined | HTMLDivElement;
  let bottomPlaceholder: undefined | HTMLDivElement;
  let ended = false;
  let isScrolling = false;
  let prevInstanceOfScrolling = 0;
  let scrollingTop = 0;
  let isBottom = false;
  const [start, setStart] = createSignal({ x: 0, y: 0 });
  const [cur, setCur] = createSignal({ x: 0, y: 0 });
  const [subViews, setSubViews] = createSignal(view.subViews);
  const [pressCount, setPressCount] = createSignal(0);
  const [height, setHeight] = createSignal(0);
  const [scrolling, setScrolling] = createSignal(0);
  const [inBottom, setInBottom] = createSignal(false);

  const resetLoading = () => {
    const $loading = loadingRef;
    if (!$loading) {
      return;
    }
    $loading.style.height = "0px";
    $loading.classList.remove(
      "pull-to-refresh__loading--show",
      "pull-to-refresh__loading--close",
      "pull-to-refresh__loading--cancel"
    );
  };
  const closeLoading = () => {
    const $loading = loadingRef;
    if (!$loading) {
      return;
    }
    $loading.classList.add("pull-to-refresh__loading--close");
  };
  const handlePullEnd = (h: number) => {
    const $loading = loadingRef;
    console.log("handlePullEnd", $loading);
    if (!$loading) {
      return;
    }
    $loading.style["paddingBottom"] = "0";
    if (h > 40) {
      $loading.style["alignItems"] = "center";
      // $loading.style['paddingBottom'] = '0';
      $loading.classList.add("pull-to-refresh__loading--show");
      // $(this.$loadingBg).text(this.props.text).addClass(S.loadingIcon).addClass(S.showLoading);

      // triggerPageRefresh();
      // this.props.onRefresh && this.props.onRefresh();

      // todo 通过ref更改显示文案
      // this.setTimeout(() => {
      // closeLoading();
      $loading.classList.add("pull-to-refresh__loading--close");
      // }, this.props.refreshTime);
    } else {
      $loading.classList.add("pull-to-refresh__loading--cancel");
      // $(this.$loadingBg).addClass(S.cancelLoading).text("");
    }
  };
  const pullToRefresh = new PullRefreshWPTVersion({
    // $ele: WPT.$curPage[0],
    onStart: () => {
      resetLoading();
    },
    onChange(h) {
      const $loading = loadingRef;
      if (!$loading) {
        return;
      }
      $loading.style.height = `${Math.floor(h)}px`;
      $loading.style["alignItems"] = "flex-end";
      // $loading.style["paddingBottom"] = "10px";
    },
    onEnd: handlePullEnd,
  });
  // this.autoGenerateColor();

  // const [menus, setMenus] = createSignal([
  //   {
  //     text: "首页",
  //     icon: <Home class="w-6 h-6" />,
  //     onClick() {
  //       history.push("root.home_layout.home_index");
  //     },
  //   },
  //   {
  //     text: "电视剧",
  //     icon: <Tv class="w-6 h-6" />,
  //     onClick() {
  //       history.push("root.home_layout.home_season");
  //     },
  //   },
  //   {
  //     text: "刮削结果",
  //     icon: <Sparkles class="w-6 h-6" />,
  //     onClick() {
  //       history.push("root.home_layout.home_unknown_media.home_unknown_media_movie");
  //     },
  //   },
  // ]);

  view.onSubViewsChange((nextSubViews) => {
    setSubViews(nextSubViews);
  });
  // view.onCurViewChange((nextCurView) => {
  //   setCurSubView(nextCurView);
  // });
  const scrollView = new ScrollViewCore({
    // ...
  });
  // const userMenu = new DropdownMenuCore({
  //   align: "end",
  //   side: "right",
  //   items: [
  //     new MenuItemCore({
  //       label: "用户设置",
  //       icon: <Settings class="w-4 h-4" />,
  //     }),
  //     new MenuItemCore({
  //       label: "退出登录",
  //       icon: <LogOut class="w-4 h-4" />,
  //       onClick() {
  //         history.push("root.login");
  //         userMenu.hide();
  //       },
  //     }),
  //   ],
  // });

  onMount(() => {
    console.log("[PAGE]home/layout onMount", containerRef);
    const $container = containerRef;
    if (!$container) {
      return;
    }
    pullToRefresh.$ele = $container;
    pullToRefresh._addEvents();
  });

  return (
    <>
      <div ref={containerRef} class="" style={{ "background-color": "#171717" }}>
        <div
          ref={loadingRef}
          class="pull-to-refresh__loading flex justify-center overflow-hidden w-full h-[0px] text-center text-white"
        >
          Loading
        </div>
        <div class="scroll-view__content" style={{ "background-color": "#4c4c4c" }}>
          <div
            class="space-y-2"
            style={{ "background-color": "#ededed" }}
            // style={{ "background-color": "#ededed", transform: `translateY(${height()}px)` }}
            // onScroll={(e) => {
            //   const scrollTop = e.currentTarget.scrollTop;
            //   scrollingTop = scrollTop;
            //   let curBottom = false;
            //   if (e.currentTarget.clientHeight + e.currentTarget.scrollTop === e.currentTarget.scrollHeight) {
            //     curBottom = true;
            //   }
            //   if (curBottom !== isBottom) {
            //     isBottom = curBottom;
            //     setInBottom(curBottom);
            //   }
            //   setScrolling(scrollingTop);
            //   console.log("scrolling", scrollingTop);
            // }}
          >
            <div class="h-[240px] border">1</div>
            <div class="h-[240px] border">2</div>
            <div class="h-[240px] border">3</div>
            <div class="h-[240px] border">4</div>
            <div class="h-[240px] border">5</div>
            <div class="h-[240px] border">6</div>
            <div class="h-[240px] border">7</div>
          </div>
        </div>
        {/* <div
          ref={bottomPlaceholder}
          class="relative"
          style={{ height: inBottom() ? `${Math.abs(height())}px` : "" }}
        ></div> */}
      </div>
      {/* <div class="absolute p-4 shadow-xl rounded-md bottom-4 right-4">
        <div class="text-xl">Profile</div>
        <div>
          <div class="flex items-center justify-between">
            <div>Scrolling</div>
            <div>({scrolling()})</div>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between">
            <div>Instance</div>
            <div>({height()})</div>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between">
            <div>Start x</div>
            <div>({start().x})</div>
          </div>
          <div class="flex items-center justify-between">
            <div>Start y</div>
            <div>({start().y})</div>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between">
            <div>Cur x</div>
            <div>({cur().x})</div>
          </div>
          <div class="flex items-center justify-between">
            <div>Cur y</div>
            <div>({cur().y})</div>
          </div>
        </div>
      </div> */}
      {/* <div class="flex w-full h-full bg-white">
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
      </div> */}
    </>
  );
};
