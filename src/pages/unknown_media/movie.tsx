/**
 * @file 未识别的电影
 */
import { For, Show, createSignal } from "solid-js";
import { Brush, Edit, RotateCcw, Search, Trash } from "lucide-solid";

import { ViewComponent } from "@/types";

export const UnknownMovieListPage: ViewComponent = (props) => {
  const { app, view, parent } = props;

  return (
    <>
      <div class="px-8 pb-12">
        <div class="flex items-center my-4 space-x-2"></div>
        <div class="flex items-center space-x-2 mt-4"></div>
        <div class="mt-4">
          <div>Movie</div>
        </div>
      </div>
    </>
  );
};
