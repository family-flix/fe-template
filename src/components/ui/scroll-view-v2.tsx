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

  const [rotate, setRotate] = createSignal(false);

  store.inDownOffset(() => {
    setRotate(false);
  });
  store.outDownOffset(() => {
    setRotate(true);
  });

  return (
    <ScrollViewPrimitive.Root class={cn("w-full h-full overflow-y-auto", props.class)} store={store}>
      <ScrollViewPrimitive.Indicator class="relative w-full overflow-hidden text-center" store={store}>
        <div class="absolute left-0 bottom-0 w-full min-h-[30px] py-[10px]">
          <img class="block w-[210px] h-[84px] m-auto" src="/examples/beibei/mescroll-slogan.jpg" />
          <ScrollViewPrimitive.Progress store={store}>
            <p
              classList={{
                "w-[20px] h-[20px] border-none m-auto": true,
                "rotate-[180deg]": rotate(),
                "rotate-[0deg]": !rotate(),
              }}
              style={{
                "background-size": "contain",
                "background-repeat": "no-repeat",
                "background-position": "center",
                "background-image": "url('/examples/beibei/mescroll-progress.png')",
                transition: "all 300ms",
              }}
            ></p>
          </ScrollViewPrimitive.Progress>
          <ScrollViewPrimitive.Loading store={store}>
            <p class="w-[20px] h-[20px] rounded-full border border-[#ff8095] border-b-transparent animate animate-spin"></p>
          </ScrollViewPrimitive.Loading>
        </div>
      </ScrollViewPrimitive.Indicator>
      {props.children}
    </ScrollViewPrimitive.Root>
  );
};
