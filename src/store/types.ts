import { JSX } from "solid-js/jsx-runtime";

import { Application } from "@/domains/app";
import { HistoryCore } from "@/domains/history";
import { RouteViewCore } from "@/domains/route_view";
import { ScrollViewCore } from "@/domains/ui";

import { PageKeys, RouteConfig } from "./routes";

export type ViewComponentProps = {
  app: Application;
  // router: NavigatorCore;
  history: HistoryCore<PageKeys, RouteConfig>;
  // request: HttpClientCore;
  view: RouteViewCore;
  parent?: { scrollView?: ScrollViewCore };
};
export type ViewComponent = (props: ViewComponentProps) => JSX.Element;
