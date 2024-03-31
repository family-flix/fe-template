import { onMount } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

import { ScrollViewCoreV2 } from "@/domains/scroll_view_v2";
import { connectScroll, connectDownIndicator, connectUpIndicator } from "@/domains/scroll_view_v2/connect.web";

export const Root = (props: { store: ScrollViewCoreV2 } & JSX.HTMLAttributes<HTMLDivElement>) => {
  const { store } = props;

  let elm: undefined | HTMLDivElement;

  onMount(() => {
    if (!elm) {
      return;
    }
    connectScroll(store, elm);
  });

  return (
    <div
      class={props.class}
      ref={(e) => {
        elm = e;
        if (typeof props.ref === "function") {
          props.ref(e);
          return;
        }
        props.ref = e;
      }}
    >
      {props.children}
    </div>
  );
};
export const DownIndicator = (props: { store: ScrollViewCoreV2 } & JSX.HTMLAttributes<HTMLDivElement>) => {
  const { store, ...rest } = props;

  let elm: undefined | HTMLDivElement;

  onMount(() => {
    if (!elm) {
      return;
    }
    connectDownIndicator(store, elm);
  });

  return (
    <div
      ref={(e) => {
        elm = e;
        if (typeof props.ref === "function") {
          props.ref(e);
          return;
        }
        props.ref = e;
      }}
      class={props.class}
      style={{ height: 0 }}
    >
      {props.children}
    </div>
  );
};
export const UpIndicator = (props: { store: ScrollViewCoreV2 } & JSX.HTMLAttributes<HTMLDivElement>) => {
  const { store, ...rest } = props;

  let elm: undefined | HTMLDivElement;

  onMount(() => {
    if (!elm) {
      return;
    }
    connectUpIndicator(store, elm);
  });

  return (
    <div
      ref={(e) => {
        elm = e;
        if (typeof props.ref === "function") {
          props.ref(e);
          return;
        }
        props.ref = e;
      }}
      class={props.class}
      style={{ height: 0 }}
    >
      {props.children}
    </div>
  );
};
export const Progress = (props: { store: ScrollViewCoreV2 } & JSX.HTMLAttributes<HTMLDivElement>) => {
  const { store, children } = props;

  let ref: undefined | HTMLDivElement;

  store.inDownOffset(() => {
    // console.log("[]Progress - store.onInOffset", ref);
    if (!ref) {
      return;
    }
    ref.style.display = "block";
  });
  store.onPullToRefresh(() => {
    // console.log("[]Progress - store.onPullToRefresh");
    if (!ref) {
      return;
    }
    ref.style.display = "none";
  });

  return <div ref={ref}>{children}</div>;
};

export const Loading = (props: { store: ScrollViewCoreV2 } & JSX.HTMLAttributes<HTMLDivElement>) => {
  const { store, children } = props;

  let ref: undefined | HTMLDivElement;

  store.inDownOffset(() => {
    // console.log("[]Loading - store.onInOffset", ref);
    if (!ref) {
      return;
    }
    ref.style.display = "none";
  });
  store.onPullToRefresh(() => {
    // console.log("[]Loading - store.onPullToRefresh", ref);
    if (!ref) {
      return;
    }
    ref.style.display = "inline-block";
  });
  return (
    <div ref={ref} style={{ display: "none" }}>
      {children}
    </div>
  );
};
