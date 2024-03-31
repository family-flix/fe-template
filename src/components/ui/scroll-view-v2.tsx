/**
 * @file 可滚动容器，支持下拉刷新、滚动监听等
 */
import { JSX } from "solid-js/jsx-runtime";
import { createSignal } from "solid-js";

import * as ScrollViewPrimitive from "@/packages/ui/scroll-view";
import { ScrollViewCoreV2 } from "@/domains/scroll_view_v2";
import { cn } from "@/utils";

export const ScrollViewV2 = (
  props: {
    store: ScrollViewCoreV2;
    contentClass?: string;
  } & JSX.HTMLAttributes<HTMLDivElement>
) => {
  const { store, ...restProps } = props;

  const [state, setState] = createSignal(store.state);
  const [rotate, setRotate] = createSignal(false);

  //   store.onStateChange((nextState) => {
  //     setState(nextState);
  //   });

  store.inDownOffset(() => {
    setRotate(false);
  });
  store.outDownOffset(() => {
    setRotate(true);
  });

  return (
    <ScrollViewPrimitive.Root class={cn("w-full h-full overflow-y-auto", props.class)} store={store}>
      <ScrollViewPrimitive.DownIndicator
        class="mescroll-downwarp relative w-full overflow-hidden text-center"
        store={store}
      >
        <div class="absolute left-0 bottom-0 w-full min-h-[30px] py-[10px]">
          <img class="downwarp-slogan" src="/examples/beibei/mescroll-slogan.jpg" />
          <ScrollViewPrimitive.Progress store={store}>
            <p classList={{ "downwarp-progress": true, "rotate-[180deg]": rotate(), "rotate-[0deg]": !rotate() }}></p>
          </ScrollViewPrimitive.Progress>
          <ScrollViewPrimitive.Loading store={store}>
            <p class="downwarp-loading mescroll-rotate"></p>
          </ScrollViewPrimitive.Loading>
        </div>
      </ScrollViewPrimitive.DownIndicator>
      {props.children}
    </ScrollViewPrimitive.Root>
  );
};
