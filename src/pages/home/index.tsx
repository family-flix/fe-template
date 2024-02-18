/**
 * @file
 */
import { RequestCore } from "@/domains/request_v2";
import { ping } from "@/services";
import { client } from "@/store/request";
import { PageKeys } from "@/store/routes";
import { ViewComponent } from "@/store/types";
import { createSignal } from "solid-js";

export const HomeIndexPage: ViewComponent = (props) => {
  const { app, view } = props;

  const r = new RequestCore("/api/ping", {
    client,
    method: "POST",
    onSuccess() {
      console.log("request success");
    },
    onFailed(error) {
      console.log("request failed, because", error.message);
    },
    onCanceled() {
      console.log("request canceled");
    },
  });

  const [state, setState] = createSignal(r.state);

  r.onStateChange((v) => {
    // console.log("[]r.onStateChange", v.loading);
    setState(v);
  });

  r.run();

  return (
    <>
      <div class="h-screen p-8 whitespace-nowrap">
        <div class="page__header flex items-center space-x-4">
          <h1 class="text-2xl">
            <div>数据统计</div>
          </h1>
          <div class="flex items-center space-x-2"></div>
        </div>
        <div class="page__content mt-8">
          <div>
            {(() => {
              const e = state().error;
              if (e) {
                return e.message;
              }
              if (state().response) {
                return "已完成";
              }
              if (state().loading) {
                return (
                  <div
                    onClick={() => {
                      r.cancel();
                    }}
                  >
                    取消请求
                  </div>
                );
              }
              return (
                <div
                  onClick={() => {
                    r.run();
                  }}
                >
                  重新请求
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </>
  );
};
