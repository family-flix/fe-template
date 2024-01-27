/**
 * @file
 */
import { ViewComponent } from "@/types";

export const HomeIndexPage: ViewComponent = (props) => {
  const { app, view } = props;

  return (
    <>
      <div class="h-screen p-8 whitespace-nowrap">
        <div class="page__header flex items-center space-x-4">
          <h1 class="text-2xl">
            <div>数据统计</div>
          </h1>
          <div class="flex items-center space-x-2"></div>
        </div>
        <div class="page__content mt-8"></div>
      </div>
    </>
  );
};
