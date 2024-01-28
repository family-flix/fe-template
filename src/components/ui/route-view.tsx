/**
 * @file 页面容器
 */
import { Show, createSignal, JSX, onCleanup } from "solid-js";

import { RouteViewCore } from "@/domains/route_view";

export function RouteView(
  props: {
    store: RouteViewCore;
    index: number;
    /** 当隐藏时，是否立刻消失，而不等待动画 */
    immediately?: boolean;
  } & JSX.HTMLAttributes<HTMLDivElement>
) {
  const { store, index } = props;

  const [state, setState] = createSignal(store.state);

  // (async () => {
  //   if (typeof view.component === "function") {
  //     if (view.loaded) {
  //       return;
  //     }
  //     const PageView = await view.component();
  //     setPageContent(<PageView app={app} view={view} />);
  //     view.setLoaded();
  //     return;
  //   }
  // })();

  store.onStateChange((nextState) => {
    setState(nextState);
  });

  return (
    <Show when={state().mounted}>
      <div
        class={props.class}
        // classList={{
        //   "relative w-full h-full": true,
        // }}
        style={{
          "z-index": index,
        }}
        // class={cn(
        //   "animate-in sm:zoom-in-90",
        //   "data-[state=open]:data-[state=open]:slide-in-from-bottom-full",
        //   "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-full"
        // )}
        data-state={state().visible ? "open" : "closed"}
        data-title={store.title}
        // onAnimationEnd={() => {
        //   store.presence.animationEnd();
        // }}
      >
        {props.children}
      </div>
    </Show>
  );
}
