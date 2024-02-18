/**
 * @file
 */
import { createSignal, For, Show } from "solid-js";
import { ArrowLeft } from "lucide-solid";

import { ViewComponent } from "@/store/types";
import { Button, Input } from "@/components/ui";
import { ButtonCore, InputCore } from "@/domains/ui";

export const HomeSeasonListPage: ViewComponent = (props) => {
  const { app, history, view } = props;

  // const [driveResponse, setDriveResponse] = createSignal(driveList.response);
  const $input = new InputCore({
    defaultValue: "",
  });
  const $btn = new ButtonCore({
    onClick() {
      const v = $input.value;
      if (!v) {
        return;
      }
      console.log(v);
    },
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
            <div>电视剧列表</div>
          </h1>
          <div class="flex items-center space-x-2"></div>
        </div>
        <div class="page__content mt-8">
          <div class="flex items-center space-x-2">
            <Input store={$input} />
            <Button store={$btn}>搜索</Button>
          </div>
          <div class="mt-4 space-y-2">
            <div
              class="p-4 rounded-md border bg-white cursor-pointer"
              // onClick={() => {
              //   history.push("root.home_layout.home_season_profile", { id: "1", title: "精通 JavaScript" });
              // }}
            >
              <div>
                <a
                  href={history.buildURLWithPrefix("root.home_layout.home_season_profile", {
                    id: "1",
                    title: "精通 JavaScript",
                  })}
                >
                  精通 JavaScript
                </a>
              </div>
            </div>
            <div
              class="p-4 rounded-md border bg-white cursor-pointer"
              // onClick={() => {
              //   history.push("root.home_layout.home_season_profile", { id: "2", title: "JavaScript 权威指南" });
              // }}
            >
              <div>
                <a
                  href={history.buildURLWithPrefix("root.home_layout.home_season_profile", {
                    id: "2",
                    title: "JavaScript 权威指南",
                  })}
                >
                  JavaScript 权威指南
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
