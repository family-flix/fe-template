/* @refresh reload */
import { createSignal, For, JSX, onMount, Show } from "solid-js";
import { render } from "solid-js/web";
import { Loader2 } from "lucide-solid";

import { app, history } from "./store/index";
import { PageKeys, routesWithPathname } from "./store/routes";
import { pages } from "./store/views";
import { Toast } from "./components/ui/toast";
import { KeepAliveRouteView } from "./components/ui";
import { HistoryPanel } from "./components/history-panel";
import { connect as connectApplication } from "./domains/app/connect.web";
import { connect as connectHistory } from "./domains/history/connect.web";
import { ToastCore } from "./domains/ui/toast";
import { NavigatorCore } from "./domains/navigator";

import "./style.css";

history.onClickLink(({ href, target }) => {
  const { pathname, query } = NavigatorCore.parse(href);
  const route = routesWithPathname[pathname];
  // console.log("[ROOT]history.onClickLink", pathname, query, route);
  if (!route) {
    app.tip({
      text: ["没有匹配的页面"],
    });
    return;
  }
  if (target === "_blank") {
    const u = history.buildURLWithPrefix(route.name, query);
    window.open(u);
    return;
  }
  history.push(route.name, query);
  return;
});
history.$router.onPopState((r) => {
  const { type, pathname, href } = r;
  // console.log("[ROOT]index - app.onPopState", type, pathname, href);
  if (type === "back") {
    history.back();
    return;
  }
  if (type === "forward") {
    history.forward();
    return;
  }
});
history.$router.onPushState(({ from, to, path, pathname }) => {
  console.log("[ROOT]index - before history.pushState", from, to, path, pathname);
  window.history.pushState(
    {
      from,
      to,
    },
    "",
    path
  );
});
history.$router.onReplaceState(({ from, path, pathname }) => {
  console.log("[ROOT]index - before history.replaceState", from, path, pathname);
  window.history.replaceState(
    {
      from,
    },
    "",
    path
  );
});
connectApplication(app);
connectHistory(history);

function Application() {
  const toast = new ToastCore();

  const view = history.$view;
  // console.log("[ROOT]sub views", rootView.subViews);

  const [state, setState] = createSignal(app.state);
  const [subViews, setSubViews] = createSignal(view.subViews);

  app.onStateChange((nextState) => {
    setState(nextState);
  });
  view.onSubViewsChange((nextSubViews) => {
    console.log("[ROOT]rootView.onSubViewsChange", nextSubViews.length);
    setSubViews(nextSubViews);
  });
  history.onRouteChange(({ ignore, reason, view, href }) => {
    console.log("[ROOT]rootView.onRouteChange", href);
    const { title } = view;
    app.setTitle(title);
    if (ignore) {
      return;
    }
    if (reason === "push") {
      history.$router.pushState(href);
    }
    if (reason === "replace") {
      history.$router.replaceState(href);
    }
  });
  app.onTip((msg) => {
    const { text } = msg;
    toast.show({
      texts: text,
    });
  });
  app.onError((error) => {
    // 处理各种错误？
  });
  // app.onReady(() => {
  //   router.start();
  // });
  onMount(async () => {
    const { pathname, query } = history.$router;
    console.log("[ROOT]onMount", pathname);
    const route = routesWithPathname[pathname];
    if (!route) {
      history.push("root.home_layout.home_index");
      return;
    }
    if (route.name === "root") {
      history.push("root.home_layout.home_index", query, { ignore: true });
      return;
    }
    history.push(route.name, query, { ignore: true });
  });
  // console.log("[]Application - before start", window.history);
  const { innerWidth, innerHeight, location } = window;
  history.$router.prepare(location);
  app.start({
    width: innerWidth,
    height: innerHeight,
  });

  return (
    <div class={"screen w-screen h-screen"}>
      <Show when={subViews().length !== 0}>
        <For each={subViews()}>
          {(subView, i) => {
            const routeName = subView.name;
            const PageContent = pages[routeName as Exclude<PageKeys, "root">];
            return (
              <KeepAliveRouteView class="page fixed inset-0 w-full h-full opacity-100 dark:bg-black" store={subView} index={i()}>
                {/* <div class="absolute right-2 bottom-2">{subView.title}</div> */}
                <PageContent app={app} history={history} view={subView} />
              </KeepAliveRouteView>
            );
          }}
        </For>
      </Show>
      {/* <Toast store={toast} />
      <HistoryPanel store={history} /> */}
    </div>
  );
}

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?"
  );
}
render(() => <Application />, root!);
