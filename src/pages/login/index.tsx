/**
 * @file 用户登录
 */
import { Button } from "@/components/ui";
import { ButtonCore } from "@/domains/ui";
import { ViewComponent } from "@/store/types";

export const LoginPage: ViewComponent = (props) => {
  const { app, history, view } = props;

  const $btn = new ButtonCore({
    onClick() {
      history.push("root.home_layout.home_index");
    },
  });

  return (
    <div class="flex justify-center items-center h-screen bg-[#f8f9fa]">
      <div class="p-12 rounded-xl w-[480px] bg-white">
        <h1 class="text-4xl text-center">管理后台登录</h1>
        <Button store={$btn}>登录</Button>
      </div>
    </div>
  );
};
