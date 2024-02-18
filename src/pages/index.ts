import { HomeLayout } from "@/pages/home/layout";
import { HomeIndexPage } from "@/pages/home/index";
import { TaskListPage } from "@/pages/job/index";
import { TaskProfilePage } from "@/pages/job/profile";
import { HomeSeasonListPage } from "@/pages/season/index";
import { HomeSeasonProfilePage } from "@/pages/season/profile";
import { UnknownMediaLayout } from "@/pages/unknown_media/layout";
import { UnknownSeasonListPage } from "@/pages/unknown_media/season";
import { UnknownMovieListPage } from "@/pages/unknown_media/movie";
import { TestPage } from "@/pages/test/index";
import { RegisterPage } from "@/pages/register/index";
import { LoginPage } from "@/pages/login/index";
import { NotFoundPage } from "@/pages/notfound/index";

export const pages = {
  HOME_LAYOUT: HomeLayout,
  HOME_INDEX_PAGE: HomeIndexPage,
  HOME_TASK_LIST_PAGE: TaskListPage,
  HOME_TASK_PROFILE_PAGE: TaskProfilePage,
  HOME_SEASON_LIST_PAGE: HomeSeasonListPage,
  HOME_SEASON_PROFILE_PAGE: HomeSeasonProfilePage,
  HOME_UNKNOWN_MEDIA_LAYOUT: UnknownMediaLayout,
  HOME_UNKNOWN_MEDIA_SEASON_PAGE: UnknownSeasonListPage,
  HOME_UNKNOWN_MEDIA_MOVIE_PAGE: UnknownMovieListPage,
  TEST_PAGE: TestPage,
  REGISTER_PAGE: RegisterPage,
  LOGIN_PAGE: LoginPage,
  NOT_FOUND_PAGE: NotFoundPage,
};
