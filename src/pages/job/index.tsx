/**
 * @file 任务列表
 */
import { For, JSX, Show, createSignal } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Ban, CheckCircle, Timer } from "lucide-solid";

import { ViewComponent } from "@/store/types";

export const TaskListPage: ViewComponent = (props) => {
  const { app, view } = props;

  return (
    <div class="h-screen p-8">
      <h1 class="page__header text-2xl">任务列表</h1>
      <div class="page__content mt-8 flex space-x-2"></div>
    </div>
  );
};
