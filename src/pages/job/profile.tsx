/**
 * @file 转存任务详情页面
 */
import { Show, createSignal, onMount } from "solid-js";
import { ArrowLeft, Calendar } from "lucide-solid";

import { ViewComponent } from "@/types";

export const TaskProfilePage: ViewComponent = (props) => {
  const { app, view } = props;

  return (
    <div class="h-screen p-8">
      <div
        class="mb-2 cursor-pointer"
        onClick={() => {
          // app.back();
          // homeLayout.showPrevView({ destroy: true });
        }}
      >
        <ArrowLeft class="w-6 h-6" />
      </div>
      <div class="mt-8"></div>
    </div>
  );
};
