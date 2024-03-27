/**
 * @file 后台/首页布局
 */
import { For, JSX, createSignal, onMount } from "solid-js";
import { Home, EyeOff, Tv, LogOut, Settings, Sparkles } from "lucide-solid";
// import Hammer from "hammerjs";
import PhyTouch from "phy-touch";

import { pages } from "@/store/views";
import { PageKeys } from "@/store/routes";
import { DropdownMenu, KeepAliveRouteView, ScrollView } from "@/components/ui";
import { DropdownMenuCore, MenuItemCore, ScrollViewCore } from "@/domains/ui";
// import { RouteViewCore } from "@/domains/route_view";
// import { Application } from "@/domains/app";
// import { Show } from "@/packages/ui/show";
import { ViewComponent, ViewComponentProps } from "@/store/types";
import { cn } from "@/utils";

const PHONE = !!window.navigator.userAgent.match(/phone|iphone|android|ipad|ios|ipad/gi);
/**
 */
// console.log(config);
type PullRefreshOptions = Partial<{
  $ele: HTMLDivElement;
  onStart: () => void;
  onEnd: (v: number) => void;
  onChange: (v: number) => void;
}>;
export class PullRefresh {
  $ele: HTMLElement;
  options: PullRefreshOptions;

  state = {
    disable: false,
    isStart: false,
    scrollTop: 100,
    start: {
      x: 0,
      y: 0,
    },
    move: {
      x: 0,
      y: 0,
    },
    H: 0,
    innerHeight: 0,
    preventDefault: false,
    swipeDir: "ud" as "ud" | "up" | "lr" | "ll",
    canStart: false,
  };

  constructor(options: Partial<{ $ele: HTMLDivElement }>) {
    this.$ele = options.$ele || document.body;
    this.options = options;
    this.init();
  }

  _touchstart = (event: TouchEvent) => {
    const state = this.state;
    this.reset();
    const scrollTop = document.body.scrollTop;
    if (!state.disable && scrollTop == 0) {
      state.scrollTop = scrollTop;
      state.isStart = true;
      state.start = {
        x: event.touches ? event.touches[0].clientX : 0,
        y: event.touches ? event.touches[0].clientY : 0,
      };
      // 缓存高度
      state.innerHeight = window.innerHeight;
    }
  };

  _touchmove = (event: TouchEvent) => {
    const { state } = this;
    if (state.isStart && !state.disable) {
      state.move = {
        x: event.touches ? event.touches[0].clientX : 0,
        y: event.touches ? event.touches[0].clientY : 0,
      };
      const { move, start } = state;
      state.H = ((move.y - start.y) / state.innerHeight) * 180;

      if (state.preventDefault || (!state.swipeDir && state.scrollTop == 0 && state.H > 0)) {
        // 获取滑动方向
        if (!state.swipeDir) {
          state.swipeDir = Math.abs(move.x - start.x) <= Math.abs(move.y - start.y) ? "ud" : "lr";
        }

        if (state.swipeDir === "ud") {
          state.preventDefault = true;
          event.preventDefault();
          // 触发start回调
          if (state.canStart) {
            this.options.onStart && this.options.onStart();
            state.canStart = false;
          }
          // 触发change回调
          const { H } = state;
          requestAnimationFrame(() => {
            this.options.onChange && this.options.onChange(H);
          });
        }
      }

      if (!state.preventDefault && !state.swipeDir && state.H < 0) {
        state.swipeDir = "up";
      }
    }
  };

  _touchend = (event: TouchEvent) => {
    const { state } = this;
    const { H, preventDefault, isStart } = state;
    this.reset();
    if (isStart && !state.disable && preventDefault) {
      event.preventDefault();
      // 因为touchmove使用了 requestAnimationFrame 因此在touchend的时候也要使用
      // 不然有可能导致touchend之后touchmove又执行
      requestAnimationFrame(() => {
        this.options.onEnd && this.options.onEnd(H);
      });
    }
  };

  _removeEvents() {
    const { $ele } = this;
    $ele.removeEventListener("touchstart", this._touchstart);
    $ele.removeEventListener("touchmove", this._touchmove);
    $ele.removeEventListener("touchend", this._touchend);
    // $ele.removeEventListener("touchend", (e) => {
    //   const { target, } = e;
    // })
    // !PHONE && $ele.removeEventListener(touchleave, this._touchend);
  }

  _addEvents() {
    const { $ele } = this;
    $ele.addEventListener("touchstart", this._touchstart, { passive: false });
    $ele.addEventListener("touchmove", this._touchmove, { passive: false });
    $ele.addEventListener("touchend", this._touchend, { passive: false });
    // !PHONE && $ele.addEventListener(touchleave, this._touchend, { passive: false });
  }

  reset() {
    this.state = Object.assign(this.state || {}, {
      start: { x: 0, y: 0 },
      move: { x: 0, y: 0 },
      preventDefault: false,
      swipeDir: "",
      canStart: true,
      scrollTop: 100,
      isStart: false,
    });
  }

  disable() {
    !this.state.disable && this._removeEvents();
    this.state.disable = true;
  }

  enable() {
    this.state.disable && this._addEvents();
    this.state.disable = false;
  }

  init() {
    this.reset();
    this._addEvents();
  }
}

function damping(x: number, max: number) {
  let y = Math.abs(x);
  y = (0.82231 * max) / (1 + 4338.47 / Math.pow(y, 1.14791));
  return Math.round(x < 0 ? -y : y);
}
function smoothDampToZero(options: {
  currentValue: number;
  duration?: number;
  dampingRatio?: number;
  onChange: (v: number) => void;
}) {
  const { currentValue, duration = 200, dampingRatio = 0.9, onChange } = options;
  const startTime = Date.now();
  let v = currentValue;

  let needStop = false;

  function animate() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    // 这里简化了阻尼算法，真实物理阻尼可能需要用到更复杂的公式
    const progress = elapsedTime / duration;
    v *= dampingRatio ** progress;
    // currentValue = damping(progress, 100);
    // 继续动画直到接近0（这里设定一个较小的阈值）
    if (Math.abs(v) > 0.01 && !needStop) {
      requestAnimationFrame(animate);
    }
    // 更新DOM或者其他需要同步数值的地方
    // setHeight(currentValue);
    onChange(v);
  }

  animate();
  return () => {
    needStop = true;
  };
}

export const HomeLayout: ViewComponent = (props) => {
  const { app, history, view } = props;

  let containerRef: undefined | HTMLDivElement;
  let start = { x: 0, y: 0 };
  let cur = { x: 0, y: 0 };
  const [subViews, setSubViews] = createSignal(view.subViews);
  const [pressCount, setPressCount] = createSignal(0);
  const [height, setHeight] = createSignal(0);
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
    // const hammer = new Hammer(containerRef);
    // hammer.on("press", function (e) {
    //   setPressCount((prev) => prev + 1);
    // });
    // const phyTouch = new PhyTouch({
    //   touch: "#container", //反馈触摸的dom
    //   vertical: true, //不必需，默认是true代表监听竖直方向touch
    //   // target: { y: 0 }, //运动的对象
    //   property: "y", //被运动的属性
    //   min: 100, //不必需,运动属性的最小值
    //   max: 2000, //不必需,滚动属性的最大值
    //   sensitivity: 1, //不必需,触摸区域的灵敏度，默认值为1，可以为负数
    //   /** 不必需,表示触摸位移运动位移与被运动属性映射关系，默认值是1 */
    //   factor: 1,
    //   /** 不必需,表示touchmove位移与被运动属性映射关系，默认值是1 */
    //   moveFactor: 1,
    //   /** 用于校正到step的整数倍 */
    //   step: 45,
    //   bindSelf: false,
    //   /** 不必需，触摸反馈的最大速度限制 */
    //   maxSpeed: 2, //
    //   value: 0,
    //   change: function (value) {
    //     if (!containerRef) {
    //       return;
    //     }
    //     containerRef.style.transform = "translate(0," + value + "px)";
    //     containerRef.style.webkitTransform = "translate(0," + value + "px)";
    //   },
    //   touchMove(value) {
    //     console.log("[PAGE]home/layout onMount - touchMove", value);
    //   },
    //   animationEnd: function (value) {}, //运动结束
    // });
  });

  return (
    <>
      <div
        ref={containerRef}
        id="container"
        class="fixed inset-0"
        style={{ "background-color": "red" }}
        onTouchStart={(event) => {
          event.stopPropagation();
          const { clientX, clientY } = event.touches[0];
          start.x = clientX;
          start.y = clientY;
        }}
        onTouchMove={(event) => {
          event.stopPropagation();
          const { clientX, clientY } = event.touches[0];
          cur.x = clientX;
          const distance = clientY - start.y;
          const r = damping(distance, 800);
          cur.y = r;
          requestAnimationFrame(() => {
            setHeight(r);
          });
        }}
        onTouchEnd={(event) => {
          event.stopPropagation();
          start = {
            x: 0,
            y: 0,
          };
          smoothDampToZero({
            currentValue: cur.y,
            onChange(v) {
              setHeight(v);
            },
          });
        }}
        onTouchCancel={(event) => {
          event.stopPropagation();
          start = {
            x: 0,
            y: 0,
          };
          smoothDampToZero({
            currentValue: cur.y,
            onChange(v) {
              setHeight(v);
            },
          });
        }}
        onContextMenu={(event) => {
          event.preventDefault();
        }}
      >
        <div class="absolute top-0 w-full p-4 text-center">Loading</div>
        {/* <div style={{ height: height() + "px" }}></div> */}
        <div class="" style={{ "background-color": "#333", height: `${240 * 8}px`, transform: `translateY(${height()}px)` }}>
          <div>Press Count</div>
          <div>{height()}</div>
          {/* <div class="h-[240px] border"></div>
          <div class="h-[240px] border"></div>
          <div class="h-[240px] border"></div>
          <div class="h-[240px] border"></div>
          <div class="h-[240px] border"></div>
          <div class="h-[240px] border"></div>
          <div class="h-[240px] border"></div> */}
        </div>
      </div>
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
