/**
 * @file
 */
import { createSignal, For, Show } from "solid-js";

import { ViewComponent } from "@/types";

export const HomeSeasonProfilePage: ViewComponent = (props) => {
  const { app, view } = props;

  // const [driveResponse, setDriveResponse] = createSignal(driveList.response);

  return (
    <>
      <div class="h-screen p-8 whitespace-nowrap">
        <div class="page__header flex items-center space-x-4">
          <h1 class="text-2xl">
            <div>电视剧详情</div>
          </h1>
          <div class="flex items-center space-x-2"></div>
        </div>
        <div class="page__content mt-8">
          <div>
            <div class="text-2xl">{view.query.title}</div>
          </div>
          <div
            onClick={() => {
              app.push("/home/season_profile", { id: "2", title: "JavaScript 权威指南" });
            }}
          >
            下一个
          </div>
        </div>
      </div>
    </>
  );
};
