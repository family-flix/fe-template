/**
 * @file
 */
import { createSignal } from "solid-js";

import { ping } from "@/services";
import { client } from "@/store/request";
import { ViewComponent } from "@/store/types";
import { RequestCoreV2 } from "@/domains/request/v2";
import { request } from "@/domains/request/utils";
import { cn } from "@/utils/index";

export enum Sites {
  Zhihu,
}

export enum SiteAction {
  ZhihuRecommendCardInViewport,
  ZhihuClickRecommendedCardMore,
  ZhihuClickRecommendedCardComment,
  ZhihuCommentInViewport,
  ZhihuLikeRecommendedCard,
  ZhihuViewArticleProfile,
  ZhihuLikeArticle,
  ZhihuArticleCommentInViewport,
  Click,
  DoubleClick,
  InViewport,
  Hover,
}
export type SiteLogPayload = {
  author_name: string;
  id: string | number;
  order: string;
  title: string;
  type: string;
  url: string;
  action: SiteAction;
};
function log(values: { site: Sites; items: SiteLogPayload[] }) {
  return request.post("https://sitelog.f1x.fun/api/site_log/create", values);
}
const logRequest = new RequestCoreV2({
  fetch: log,
  client,
});

const payload: { site: number; items: SiteLogPayload[] } = {
  site: 0,
  items: [
    {
      id: "3467027974",
      order: "1/1",
      title: "真的有细枝挂硕果类型的女生吗？",
      author_name: "黄亮",
      type: "Answer",
      url: "https://www.zhihu.com/question/652633646/answer/3467027974",
      action: 0,
    },
    {
      id: "3465488453",
      order: "1/2",
      title: "博物馆中令你最震惊的一件文物是什么？",
      author_name: "Bears",
      type: "Answer",
      url: "https://www.zhihu.com/question/495456125/answer/3465488453",
      action: 0,
    },
    {
      id: "2989765513",
      order: "1/3",
      title: "国产操作系统为什么要这么重复开发，既然是Linux为什么不走社区路线?",
      author_name: "万物皆可debug",
      type: "Answer",
      url: "https://www.zhihu.com/question/540743117/answer/2989765513",
      action: 0,
    },
    {
      id: "2784542993",
      order: "1/4",
      title: "为什么蓝鲸不会得癌症？",
      author_name: "全部丧",
      type: "Answer",
      url: "https://www.zhihu.com/question/562979980/answer/2784542993",
      action: 0,
    },
  ],
};

export const HomeIndexPage: ViewComponent = (props) => {
  const { app, view } = props;

  const r = new RequestCoreV2({
    fetch: ping,
    client,
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
  console.log(r.id);
  const [state, setState] = createSignal(r.state);
  const [popup, setPopup] = createSignal({
    mounted: false,
    enter: false,
    exit: false,
  });

  r.onStateChange((v) => {
    // console.log("[]r.onStateChange", v.loading);
    setState(v);
  });

  const showWithdrawConfirmDialog = () => {
    setPopup({
      mounted: true,
      enter: true,
      exit: false,
    });
  };
  const hideWithdrawConfirmDialog = () => {
    setPopup({
      mounted: true,
      exit: true,
      enter: false,
    });
    setTimeout(() => {
      setPopup({
        mounted: false,
        exit: true,
        enter: false,
      });
    }, 200);
  };

  r.run({ t: new Date().valueOf() });
  logRequest.run(payload);

  return (
    <>
      <div class="h-screen p-8 whitespace-nowrap">
        <div class="page__header flex items-center space-x-4">
          {[1].indexOf(1) > -1 ? '1' : '2'}
          <h1 class="text-2xl">
            <div
              onClick={() => {
                showWithdrawConfirmDialog();
              }}
            >
              数据统计
            </div>
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
                    r.run({ t: new Date().valueOf() });
                  }}
                >
                  重新请求
                </div>
              );
            })()}
          </div>
        </div>
      </div>
      {popup().mounted ? (
        <div class={cn("popup", {})}>
          <div
            class={cn(
              "popup__mask",
              popup().enter ? "popup__mask--enter" : "",
              popup().exit ? "popup__mask--exit" : ""
            )}
            onClick={() => {
              hideWithdrawConfirmDialog();
            }}
          ></div>
          <div
            class={cn(
              "popup__container",
              popup().enter ? "popup__container--enter" : "",
              popup().exit ? "popup__container--exit" : ""
            )}
          >
            <div class="popup__header">
              <div class="popup__extra-left"></div>
              <div class="popup__title">提现</div>
              <div
                class="popup__extra-right"
                onClick={() => {
                  hideWithdrawConfirmDialog();
                }}
              >
                X
              </div>
            </div>
            <div class="popup__content">
              <div class="profile">
                <div class="profile__field">
                  <div class="profile__label">贷款余额</div>
                  <div class="profile__value money">
                    <div class="money__unit">￥</div>
                    <div class="money__value">123</div>
                  </div>
                </div>
                <div class="profile__field">
                  <div class="profile__label">支付手续费（0.6%）</div>
                  <div class="profile__value money">
                    <div class="money__unit">￥</div>
                    <div class="money__value">123</div>
                  </div>
                </div>
                <div class="profile__field">
                  <div class="profile__label">提现手续费</div>
                  <div class="profile__value money">
                    <div class="money__unit">￥</div>
                    <div class="money__value">123</div>
                  </div>
                </div>
                <div class="profile__divider" />
                <div class="profile__field">
                  <div class="profile__label">总计应得</div>
                  <div class="profile__value money">
                    <div class="money__unit money__unit--red">￥</div>
                    <div class="money__value money__value--red">123</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="popup__footer">
              <div
                class="popup__btn"
                onClick={() => {
                  setPopup({
                    mounted: false,
                    exit: true,
                    enter: false,
                  });
                }}
              >
                2<div class="popup__btn-text">确认提现</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
