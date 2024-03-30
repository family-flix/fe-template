import { lazy } from "solid-js";

import { ViewComponent } from "@/store/types";
import { HomeLayout } from "@/pages/home/layout";
import { HomeIndexPage } from "@/pages/home";
// import { HomeSeasonListPage } from "@/pages/season";
// import { HomeSeasonProfilePage } from "@/pages/season/profile";
// import { UnknownMediaLayout } from "@/pages/unknown_media/layout";
// import { UnknownMovieListPage } from "@/pages/unknown_media/movie";
// import { UnknownSeasonListPage } from "@/pages/unknown_media/season";
// import { LoginPage } from "@/pages/login";
// import { RegisterPage } from "@/pages/register";
import { NotFoundPage } from "@/pages/notfound";
import { PullToRefreshExampleBeibeiPage } from "@/pages/beibei";

import { PageKeys } from "./routes";

export const pages: Omit<Record<PageKeys, ViewComponent>, "root"> = {
  "root.home_layout": PullToRefreshExampleBeibeiPage,
  "root.home_layout.home_index": HomeIndexPage,
  // "root.home_layout.home_season": HomeSeasonListPage,
  "root.home_layout.home_season": lazy(async () => ({ default: (await import("@/pages/season")).HomeSeasonListPage })),
  // "root.home_layout.home_season_profile": HomeSeasonProfilePage,
  "root.home_layout.home_season_profile": lazy(async () => ({
    default: (await import("@/pages/season/profile")).HomeSeasonProfilePage,
  })),
  // "root.home_layout.home_unknown_media": UnknownMediaLayout,
  "root.home_layout.home_unknown_media": lazy(async () => ({
    default: (await import("@/pages/unknown_media/layout")).UnknownMediaLayout,
  })),
  // "root.home_layout.home_unknown_media.home_unknown_media_movie": UnknownMovieListPage,
  "root.home_layout.home_unknown_media.home_unknown_media_movie": lazy(async () => ({
    default: (await import("@/pages/unknown_media/movie")).UnknownMovieListPage,
  })),
  // "root.home_layout.home_unknown_media.home_unknown_media_season": UnknownSeasonListPage,
  // "root.home_layout.home_unknown_media.home_unknown_media_season": UnknownSeasonListPage,
  "root.home_layout.home_unknown_media.home_unknown_media_season": lazy(async () => ({
    default: (await import("@/pages/unknown_media/season")).UnknownSeasonListPage,
  })),
  // "root.login": LoginPage,
  "root.login": lazy(async () => ({ default: (await import("@/pages/login")).LoginPage })),
  // "root.register": RegisterPage,
  "root.register": lazy(async () => ({ default: (await import("@/pages/register")).RegisterPage })),
  // "root.notfound": NotFoundPage,
  "root.notfound": NotFoundPage,
};
