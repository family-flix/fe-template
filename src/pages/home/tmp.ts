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
