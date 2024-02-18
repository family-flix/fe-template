/**
 * @file 索引后没有找到匹配信息的电视剧（后面称为「未知电视剧」）
 */
import { createSignal, For, onMount, Show } from "solid-js";
import { ArrowLeft, Sparkles } from "lucide-solid";

import { ViewComponent } from "@/store/types";
import { pages } from "@/store/views";
import { PageKeys } from "@/store/routes";
import { ButtonCore, ScrollViewCore } from "@/domains/ui";
import { ScrollView, KeepAliveRouteView } from "@/components/ui";
import { TabHeader } from "@/components/ui/tab-header";
import { TabHeaderCore } from "@/domains/ui/tab-header";
import { cn } from "@/utils";

export const UnknownMediaLayout: ViewComponent = (props) => {
  const { app, history, view } = props;

  const scrollView = new ScrollViewCore({
    _name: "unknown_media/layout",
  });
  const tab = new TabHeaderCore({
    key: "id",
    options: [
      {
        id: "root.home_layout.home_unknown_media.home_unknown_media_season" as PageKeys,
        text: "电视剧",
      },
      {
        id: "root.home_layout.home_unknown_media.home_unknown_media_movie" as PageKeys,
        text: "电影",
      },
    ],
    onChange(opt) {
      history.push(opt.value as PageKeys);
    },
    onMounted() {
      // console.log("[LAYOUT]unknown_media - tab.onMounted", history.$router.name);
      tab.handleChangeById(history.$router.name);
    },
  });

  const [curSubView, setCurSubView] = createSignal(view.curView);
  const [subViews, setSubViews] = createSignal(view.subViews);

  history.onRouteChange((v) => {
    console.log("[LAYOUT]unknown_media - app.history.onRouteChange", v.pathname);
    if (!tab.mounted) {
      return;
    }
    tab.handleChangeById(v.name);
  });
  view.onCurViewChange((nextCurView) => {
    setCurSubView(nextCurView);
  });
  view.onSubViewsChange((nextSubViews) => {
    setSubViews(nextSubViews);
  });

  return (
    <ScrollView store={scrollView} class="flex flex-col box-border h-screen">
      <div class="relative">
        <div class="p-8 pb-0">
          <h1 class="flex items-center space-x-2 text-2xl cursor-pointer">
            <div
              onClick={() => {
                history.back();
              }}
            >
              <Sparkles class="w-6 h-6" />
            </div>
            <div>刮削结果</div>
          </h1>
          <div class="mt-8">
            <TabHeader store={tab} />
          </div>
        </div>
        <div class="flex-1 h-0 rounded-sm">
          <div class="w-full h-full">
            <Show
              when={subViews().length !== 0}
              fallback={
                <div class="flex items-center justify-center">
                  <div class="py-8 text-xl text-slate-800">点击上方未知影视剧类型</div>
                </div>
              }
            >
              <For each={subViews()}>
                {(subView, i) => {
                  const routeName = subView.name;
                  const PageContent = pages[routeName as Exclude<PageKeys, "root">];
                  return (
                    <KeepAliveRouteView
                      class={cn("relative w-full h-full")}
                      store={subView}
                      immediately={true}
                      index={i()}
                    >
                      <PageContent
                        app={app}
                        history={history}
                        parent={{
                          scrollView,
                        }}
                        view={subView}
                      />
                    </KeepAliveRouteView>
                  );
                }}
              </For>
            </Show>
          </div>
        </div>
      </div>
    </ScrollView>
  );
};
