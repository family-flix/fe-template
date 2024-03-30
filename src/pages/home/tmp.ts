// @ts-nocheck
import React, { Component } from 'react';

import { PullRefresh } from './core';

/**
 *
 * @export
 * @class PullToRefresh
 * @extends {React.Component}
 */
export default class PullToRefresh extends Component {
    static defaultProps = {
        onRefresh: () => undefined,
        text: '下拉加载更多',
        refreshTime: 500,
        className: '',
    };

    state = {
        showStyle: {},
    };

    componentDidMount() {
        this.pullToRefresh = new PullRefresh({
            $ele: WPT.$curPage[0],
            onStart: () => {
                this.resetLoading();
            },
            onEnd: this.handlePullEnd,
            onChange: (h) =>
                $(this.$loadingBg)
                    .css({
                        height: `${Math.floor(h)}px`,
                        'align-items': 'flex-end',
                        'padding-bottom': '10px',
                    })
                    ?.text(this?.props?.text),
        });
        this.props.ref?.(this);
        this.autoGenerateColor();
    }

    componentWillUnmount() {
        this.onPageHide();
    }

    onPageShow() {
        this.pullToRefresh.enable();
    }

    onPageHide() {
        this.pullToRefresh.disable(); // 关闭下拉刷新
        this.clearTimeout();
        this.resetLoading();
    }

    handleDisableRefresh = () => this.pullToRefresh?.disable();

    handleEnableRefresh = () => this.pullToRefresh?.enable();

    // 自动配置color
    autoGenerateColor = () => {
        try {
            if (!this.props.className) {
                let bg = WPT.allPage[WPT.curRouter]?.pageConfig?.domBackgroundColor;
                if (bg) {
                    bg = typeof bg === 'function' ? bg() : bg;
                    this.setState({
                        showStyle: {
                            backgroundColor: bg,
                            color: WPT?.Util?.isLight(bg) ? '#333' : '#fff',
                        },
                    });
                }
            }
        } catch (e) {
            console.warn(`unknown PullToRefresh color error:${e}！！！`);
        }
    };

    triggerPageRefresh = () => {
        if (!this.$rootElement) return;

        this.$rootElement.showHideList.forEach((instance) => {
            instance.onPageRefresh &&
                instance.onPageRefresh({
                    endRefresh: () => {
                        // 可以在合适时机，手动关闭refresh，目前默认500ms关闭
                        // 接口手动触发endRefresh，可能会导致refresh动画没有执行结束，就被隐藏了
                        // 如果要做的话，需要一些特殊处理，暂时先不考虑
                    },
                });
        });
    };

    handlePullEnd = (h) => {
        if (h > 40) {
            $(this.$loadingBg).css({ 'align-items': 'center', 'padding-bottom': 0 });
            $(this.$loadingBg).text(this.props.text).addClass(S.loadingIcon).addClass(S.showLoading);

            this.triggerPageRefresh();
            this.props.onRefresh && this.props.onRefresh();

            // todo 通过ref更改显示文案
            this.setTimeout(() => {
                this.closeLoading();
            }, this.props.refreshTime);
        } else {
            $(this.$loadingBg).css({ 'padding-bottom': 0 });
            $(this.$loadingBg).addClass(S.cancelLoading).text('');
        }
    };

    /**
     * 手动触发刷新动画
     */
    refresh = () => {
        this.resetLoading();
        this.handlePullEnd(50);
    };

    setTimeout = (...args) => {
        const id = setTimeout(...args);
        this._timeoutCache = this._timeoutCache || [];
        this._timeoutCache.push(id);
        return id;
    };

    clearTimeout = (...ids) => {
        this._timeoutCache = this._timeoutCache || [];
        if (ids.length) {
            ids.forEach(window.clearTimeout);
            this._timeoutCache.filter((i) => !ids.includes(i));
        } else {
            this._timeoutCache.forEach(window.clearTimeout);
            this._timeoutCache = [];
        }
    };

    /**
     * [closeLoading 关闭下拉刷新]
     */
    closeLoading = () => {
        $(this.$loadingBg).addClass(S.closeLoading).text('').removeClass(S.loadingIcon);
    };

    /**
     * [resetLoading 重置下拉刷新]
     */
    resetLoading() {
        $(this.$loadingBg)
            .css('height', 0)
            .removeClass(`${S.showLoading} ${S.loadingIcon} ${S.closeLoading} ${S.cancelLoading}`);
    }

    ref2Loading = ($dom) => {
        this.$loadingBg = $dom;
    };

//     render() {
//         return (
//             <>
//                 <div
//                     style={this.state.showStyle}
//                     className={`${S.loadingBg} ${this.props.className}`}
//                     ref={this.ref2Loading}
//                 />
//                 {this.props.children}
//             </>
//         );
//     }
}


const PHONE = !!window.navigator.userAgent.match(/phone|iphone|android|ipad|ios|ipad/gi);
/**
 */
// console.log(config);
type PullRefreshOptions = Partial<{
  $ele: HTMLDivElement;
  onStart: () => void;
  onEnd: (v: number) => void;
  onChange: (v: number) => void;
}>;
export class PullRefreshWPTVersion {
  $ele: HTMLElement;
  options: PullRefreshOptions;

  state = {
    disable: false,
    isStart: false,
    scrollTop: 100,
    start: {
      x: 0,
      y: 0,
    },
    move: {
      x: 0,
      y: 0,
    },
    H: 0,
    innerHeight: 0,
    preventDefault: false,
    swipeDir: "ud" as "ud" | "up" | "lr" | "ll",
    canStart: false,
  };

  constructor(options: PullRefreshOptions) {
    this.$ele = options.$ele || document.body;
    this.options = options;
    // this.init();
  }

  _touchstart = (event: TouchEvent) => {
    const state = this.state;
    this.reset();
    const scrollTop = this.$ele.scrollTop;
    // console.log(document.body.scrollTop);
    if (!state.disable && scrollTop == 0) {
      state.scrollTop = scrollTop;
      state.isStart = true;
      state.start = {
        x: event.touches ? event.touches[0].clientX : 0,
        y: event.touches ? event.touches[0].clientY : 0,
      };
      // 缓存高度
      state.innerHeight = window.innerHeight;
    }
  };

  _touchmove = (event: TouchEvent) => {
    const { state } = this;
    console.log(state.isStart);
    if (state.isStart && !state.disable) {
      state.move = {
        x: event.touches ? event.touches[0].clientX : 0,
        y: event.touches ? event.touches[0].clientY : 0,
      };
      const { move, start } = state;
      state.H = ((move.y - start.y) / state.innerHeight) * 180;

      if (state.preventDefault || (!state.swipeDir && state.scrollTop == 0 && state.H > 0)) {
        // 获取滑动方向
        if (!state.swipeDir) {
          state.swipeDir = Math.abs(move.x - start.x) <= Math.abs(move.y - start.y) ? "ud" : "lr";
        }

        if (state.swipeDir === "ud") {
          state.preventDefault = true;
          event.preventDefault();
          // 触发start回调
          if (state.canStart) {
            this.options.onStart && this.options.onStart();
            state.canStart = false;
          }
          // 触发change回调
          const { H } = state;
          requestAnimationFrame(() => {
            this.options.onChange && this.options.onChange(H);
          });
        }
      }

      if (!state.preventDefault && !state.swipeDir && state.H < 0) {
        state.swipeDir = "up";
      }
    }
  };

  _touchend = (event: TouchEvent) => {
    const { state } = this;
    const { H, preventDefault, isStart } = state;
    this.reset();
    if (isStart && !state.disable) {
      event.preventDefault();
      // 因为touchmove使用了 requestAnimationFrame 因此在touchend的时候也要使用
      // 不然有可能导致touchend之后touchmove又执行
      console.log("before options.onEnd");
      requestAnimationFrame(() => {
        this.options.onEnd && this.options.onEnd(H);
      });
    }
  };

  _removeEvents() {
    const { $ele } = this;
    $ele.removeEventListener("touchstart", this._touchstart);
    $ele.removeEventListener("touchmove", this._touchmove);
    $ele.removeEventListener("touchend", this._touchend);
    // $ele.removeEventListener("touchend", (e) => {
    //   const { target, } = e;
    // })
    // !PHONE && $ele.removeEventListener(touchleave, this._touchend);
  }

  _addEvents() {
    const { $ele } = this;
    $ele.addEventListener("touchstart", this._touchstart, { passive: false });
    $ele.addEventListener("touchmove", this._touchmove, { passive: false });
    $ele.addEventListener("touchend", this._touchend, { passive: false });
    // $ele.addEventListener('touchleave', this._touchend, { passive: false });
  }

  reset() {
    this.state = Object.assign(this.state, {
      start: { x: 0, y: 0 },
      move: { x: 0, y: 0 },
      preventDefault: false,
      swipeDir: "",
      canStart: true,
      scrollTop: 100,
      isStart: false,
    });
  }

  disable() {
    !this.state.disable && this._removeEvents();
    this.state.disable = true;
  }

  enable() {
    this.state.disable && this._addEvents();
    this.state.disable = false;
  }

  // init() {
  //   this.reset();
  //   this._addEvents();
  // }
}

function damping(x: number, max: number) {
  let y = Math.abs(x);
  y = (0.82231 * max) / (1 + 4338.47 / Math.pow(y, 1.14791));
  return Math.round(x < 0 ? -y : y);
}
function smoothDampToZero(options: {
  currentValue: number;
  duration?: number;
  dampingRatio?: number;
  onChange: (v: number) => void;
}) {
  const { currentValue, duration = 200, dampingRatio = 0.9, onChange } = options;
  const startTime = Date.now();
  let v = currentValue;

  let needStop = false;

  function animate() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    // 这里简化了阻尼算法，真实物理阻尼可能需要用到更复杂的公式
    const progress = elapsedTime / duration;
    v *= dampingRatio ** progress;
    // currentValue = damping(progress, 100);
    // 继续动画直到接近0（这里设定一个较小的阈值）
    if (Math.abs(v) > 0.01 && !needStop) {
      requestAnimationFrame(animate);
    }
    // 更新DOM或者其他需要同步数值的地方
    // setHeight(currentValue);
    onChange(v);
  }

  animate();
  return () => {
    needStop = true;
  };
}
