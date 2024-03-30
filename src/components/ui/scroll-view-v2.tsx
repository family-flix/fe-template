/**
 * @file 可滚动容器，支持下拉刷新、滚动监听等
 */
import { JSX } from "solid-js/jsx-runtime";
import { Show, createSignal, onMount } from "solid-js";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-solid";

import { ScrollViewCoreV2 } from "@/domains/scroll_view_v2";
import { connect } from "@/domains/scroll_view_v2/connect.web";
import { cn } from "@/utils";

export const ScrollViewV2 = (
  props: {
    store: ScrollViewCoreV2;
    contentClass?: string;
  } & JSX.HTMLAttributes<HTMLDivElement>
) => {
  const { store, ...restProps } = props;

  const [state, setState] = createSignal(store.state);

  //   store.onStateChange((nextState) => {
  //     setState(nextState);
  //   });

  //   const options = {
  //     pending: () => null,
  //     pulling: () => (
  //       <div class="flex items-center justify-center space-x-2">
  //         <ArrowDown width={18} height={18} />
  //         <div>下拉刷新</div>
  //       </div>
  //     ),
  //     releasing: () => (
  //       <div class="flex items-center justify-center space-x-2">
  //         <ArrowUp width={18} height={18} />
  //         <div>松手刷新</div>
  //       </div>
  //     ),
  //     refreshing: () => (
  //       <div class="flex items-center justify-center space-x-2">
  //         <Loader2 class="animate animate-spin" width={18} height={18} />
  //         <div>正在刷新</div>
  //       </div>
  //     ),
  //   };
  //   const Component = options[state().step];
  let view: undefined | HTMLDivElement = undefined;
  let wrap: undefined | HTMLDivElement = undefined;

  onMount(() => {
    if (!view) {
      return;
    }
    if (!wrap) {
      return;
    }
    store.scrollDom = view;
    store.downwarp = wrap;
    store.listenPullToRefreshEvents();
  });

  return (
    <div ref={view} id="mescroll" class={cn("mescroll", props.class)}>
      <div ref={wrap} class="mescroll-downwarp" style={{ height: 0 }}>
        <div class="downwarp-content">
          <img class="downwarp-slogan" src="/examples/beibei/mescroll-slogan.jpg" />
          <p class="downwarp-progress"></p>
          <p class="downwarp-loading mescroll-rotate" style={{ display: "none" }}></p>
        </div>
      </div>
      {props.children}
    </div>
  );
};
