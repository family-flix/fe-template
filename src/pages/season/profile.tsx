/**
 * @file
 */
import { createSignal, For, onCleanup, Show } from "solid-js";
import { ArrowLeft } from "lucide-solid";

import { ViewComponent } from "@/store/types";

export const HomeSeasonProfilePage: ViewComponent = (props) => {
  const { app, history, view } = props;
  let title: undefined | HTMLDivElement;

  view.onMounted(() => {
    console.log("[PAGE]season/profile - view.onMounted", view.query.title);
    console.log(title);
  });
  view.onShow(() => {
    console.log("[PAGE]season/profile - view.onShow", view.query.title);
  });
  view.onHidden(() => {
    console.log("[PAGE]season/profile - view.onHidden", view.query.title);
  });
  view.onUnmounted(() => {
    console.log("[PAGE]season/profile - view.onUnmounted", view.query.title);
  });

  onCleanup(() => {
    console.log("[PAGE]season/profile - onCleanup", view.query.title);
  });

  return (
    <>
      <div class="h-screen p-8 whitespace-nowrap">
        <div class="page__header flex items-center space-x-4">
          <h1 class="flex items-center space-x-2 text-2xl cursor-pointer">
            <div
              onClick={() => {
                history.back();
              }}
            >
              <ArrowLeft class="w-6 h-6" />
            </div>
            <div>电视剧详情</div>
          </h1>
          <div class="flex items-center space-x-2"></div>
        </div>
        <div class="page__content mt-8">
          <div>
            <div ref={title} class="text-2xl">
              {view.query.title}
            </div>
          </div>
          <div class="mt-4">
            <div
              onClick={() => {
                history.replace("root.home_layout.home_season_profile", { id: "1", title: "精通 JavaScript" });
              }}
            >
              精通 JavaScript
            </div>
            <div
              onClick={() => {
                history.replace("root.home_layout.home_season_profile", { id: "2", title: "JavaScript 权威指南" });
              }}
            >
              JavaScript 权威指南
            </div>
            <div
              onClick={() => {
                history.replace("root.home_layout.home_season_profile", { id: "3", title: "精通 React" });
              }}
            >
              精通 React
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
