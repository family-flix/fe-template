/**
 * @file 应用，包含一些全局相关的事件、状态
 */

import { BaseDomain, Handler } from "@/domains/base";
import { UserCore } from "@/domains/user";
import { HistoryCore } from "@/domains/history";
import { JSONObject, Result } from "@/types";

export enum OrientationTypes {
  Horizontal = "horizontal",
  Vertical = "vertical",
}
type ThemeTypes = "dark" | "light" | "system";
const mediaSizes = {
  sm: 0,
  md: 768, // 中等设备宽度阈值
  lg: 992, // 大设备宽度阈值
  xl: 1200, // 特大设备宽度阈值
  "2xl": 1536, // 特大设备宽度阈值
};
type DeviceSizeTypes = keyof typeof mediaSizes;
function getCurrentDeviceSize(width: number) {
  if (width >= mediaSizes["2xl"]) {
    return "2xl";
  }
  if (width >= mediaSizes.xl) {
    return "xl";
  }
  if (width >= mediaSizes.lg) {
    return "lg";
  }
  if (width >= mediaSizes.md) {
    return "md";
  }
  return "sm";
}
export const MEDIA = "(prefers-color-scheme: dark)";
enum Events {
  Ready,
  Tip,
  Error,
  Login,
  Logout,
  ForceUpdate,
  Resize,
  DeviceSizeChange,
  Blur,
  Keydown,
  EscapeKeyDown,
  ClickLink,
  Show,
  Hidden,
  OrientationChange,
}
type TheTypesOfEvents = {
  [Events.Ready]: void;
  // [EventsUserCore{ icon?: string; text: string[] };
  [Events.Error]: Error;
  [Events.Login]: {};
  [Events.Logout]: void;
  [Events.Resize]: {
    width: number;
    height: number;
  };
  [Events.Keydown]: {
    key: string;
  };
  [Events.EscapeKeyDown]: void;
  [Events.Blur]: void;
  [Events.Show]: void;
  [Events.Hidden]: void;
  [Events.StateChange]: ApplicationState;
};
type ApplicationState = {
  ready: boolean;
  env: JSONObject;
  theme: ThemeTypes;
  deviceSize: DeviceSizeTypes;
};
type ApplicationProps = {
  user: UserCore;
  // history: HistoryCore;
  /**
   * 应用加载前的声明周期，只有返回 Result.Ok() 页面才会展示内容
   */
  beforeReady?: () => Promise<Result<null>>;
  onReady?: () => void;
};

export class Application extends BaseDomain<TheTypesOfEvents> {
  /** 用户 */
  $user: UserCore;
  // $history: HistoryCore;

  lifetimes: Pick<ApplicationProps, "beforeReady" | "onReady">;

  screen: {
    width: number;
    height: number;
  } = {
    width: 0,
    height: 0,
  };

  env: {
    wechat: boolean;
    ios: boolean;
    android: boolean;
  } = {
    wechat: false,
    ios: false,
    android: false,
  };
  curDeviceSize: DeviceSizeTypes = "md";
  theme: ThemeTypes = "system";
  safeArea = false;
  Events = Events;

  // @todo 怎么才能更方便地拓展 Application 类，给其添加许多的额外属性还能有类型提示呢？

  _ready: boolean = false;

  get state(): ApplicationState {
    return {
      ready: this._ready,
    };
  }

  constructor(props: ApplicationProps) {
    super();

    const { user: user, beforeReady, onReady } = props;

    this.$user = user;
    // this.$history = history;

    this.lifetimes = {
      beforeReady,
      onReady,
    };
    // const { availHeight, availWidth } = window.screen;
    // if (window.navigator.userAgent.match(/iphone/i)) {
    //   const matched = [
    //     // iphonex iphonexs iphone12mini
    //     "375-812",
    //     // iPhone XS Max iPhone XR
    //     "414-896",
    //     // iPhone pro max iPhone14Plus
    //     "428-926",
    //     // iPhone 12/pro 13/14  753
    //     "390-844",
    //     // iPhone 14Pro
    //     "393-852",
    //     // iPhone 14ProMax
    //     "430-932",
    //   ].includes(`${availWidth}-${availHeight}`);
    // }
  }
  /** 启动应用 */
  async start(size: { width: number; height: number }) {
    // console.log('[Application]start');
    const { beforeReady } = this.lifetimes;
    if (beforeReady) {
      const r = await beforeReady();
      // console.log("[]Application - ready result", r);
      if (r.error) {
        return Result.Err(r.error);
      }
    }
    this._ready = true;
    this.emit(Events.Ready);
    this.emit(Events.StateChange, { ...this.state });
    // console.log("[]Application - before start");
    return Result.Ok(null);
  }
  // push(...args: Parameters<HistoryCore["push"]>) {
  //   return this.$history.push(...args);
  // }
  // replace(...args: Parameters<HistoryCore["replace"]>) {
  //   return this.$history.replace(...args);
  // }
  // back(...args: Parameters<HistoryCore["back"]>) {
  //   return this.$history.back(...args);
  // }
  setTheme(theme?: string) {
    let resolved = theme;
    if (!resolved) {
      return;
    }
    // If theme is system, resolve it before setting theme
    if (theme === "system") {
      resolved = this.getSystemTheme();
    }
  }
  applyTheme() {
    throw new Error("请在 connect.web 中实现 applyTheme 方法");
  }
  setEnv(env: JSONObject) {
    this.env = {
      ...this.env,
      ...env,
    };
  }
  /** 设置页面 title */
  setTitle(title: string): void {
    throw new Error("请实现 setTitle 方法");
  }

  /** 手机震动 */
  vibrate() {}
  setSize(size: { width: number; height: number }) {
    this.screen = size;
  }
  /** 复制文本到粘贴板 */
  copy(text: string) {
    throw new Error("请实现 copy 方法");
  }
  getComputedStyle(el: HTMLElement): CSSStyleDeclaration {
    throw new Error("请实现 getComputedStyle 方法");
  }
  /** 发送推送 */
  notify(msg: { title: string; body: string }) {
    console.log("请实现 notify 方法");
  }
  disablePointer() {
    throw new Error("请实现 disablePointer 方法");
  }
  enablePointer() {
    throw new Error("请实现 enablePointer 方法");
  }
  /** 平台相关的全局事件 */
  keydown({ key }: { key: string }) {
    if (key === "Escape") {
      this.escape();
    }
    this.emit(Events.Keydown, { key });
  }
  escape() {
    this.emit(Events.EscapeKeyDown);
  }
  resize(size: { width: number; height: number }) {
    this.screen = size;
    this.emit(Events.Resize, size);
  }
  blur() {
    this.emit(Events.Blur);
  }
  /* ----------------
   * Lifetime
   * ----------------
   */
  onReady(handler: Handler<TheTypesOfEvents[Events.Ready]>) {
    return this.on(Events.Ready, handler);
  }
  onDeviceSizeChange(handler: Handler<TheTypesOfEvents[Events.DeviceSizeChange]>) {
    return this.on(Events.DeviceSizeChange, handler);
  }
  onUpdate(handler: Handler<TheTypesOfEvents[Events.ForceUpdate]>) {
    return this.on(Events.ForceUpdate, handler);
  }
  /** 平台相关全局事件 */
  onOrientationChange(handler: Handler<TheTypesOfEvents[Events.OrientationChange]>) {
    return this.on(Events.OrientationChange, handler);
  }
  /** 平台相关全局事件 */
  onResize(handler: Handler<TheTypesOfEvents[Events.Resize]>) {
    return this.on(Events.Resize, handler);
  }
  onBlur(handler: Handler<TheTypesOfEvents[Events.Blur]>) {
    return this.on(Events.Blur, handler);
  }
  onShow(handler: Handler<TheTypesOfEvents[Events.Show]>) {
    return this.on(Events.Show, handler);
  }
  onHidden(handler: Handler<TheTypesOfEvents[Events.Hidden]>) {
    return this.on(Events.Hidden, handler);
  }
  onKeydown(handler: Handler<TheTypesOfEvents[Events.Keydown]>) {
    return this.on(Events.Keydown, handler);
  }
  onEscapeKeyDown(handler: Handler<TheTypesOfEvents[Events.EscapeKeyDown]>) {
    return this.on(Events.EscapeKeyDown, handler);
  }
  onStateChange(handler: Handler<TheTypesOfEvents[Events.StateChange]>) {
    return this.on(Events.StateChange, handler);
  }
  /**
   * ----------------
   * Event
   * ----------------
   */
  onError(handler: Handler<TheTypesOfEvents[Events.Error]>) {
    return this.on(Events.Error, handler);
  }
}
