/**
 * @file 页面容器
 */
import { createSignal, JSX, onCleanup } from "solid-js";

import { RouteViewCore } from "@/domains/route_view";

export function KeepAliveRouteView(
  props: {
    store: RouteViewCore;
    index: number;
    /** 当隐藏时，是否立刻消失，而不等待动画 */
    immediately?: boolean;
  } & JSX.HTMLAttributes<HTMLDivElement>
) {
  const { store, index, immediately = false } = props;

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
  onCleanup(() => {
    store.setUnload();
    // setPageContent(loading);
  });

  return (
    <div
      class={props.class}
      style={{
        display: (() => {
          if (immediately) {
            if (state().visible) {
              return "block";
            }
            return "none";
          }
          return state().mounted ? "block" : "none";
        })(),
        "z-index": index,
      }}
      data-state={state().visible ? "open" : "closed"}
      data-title={store.title}
    >
      {props.children}
    </div>
  );
}
