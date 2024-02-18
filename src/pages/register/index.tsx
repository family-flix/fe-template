/**
 * @file 用户注册
 */
import { Button, Input } from "@/components/ui";
import { InputCore, ButtonCore } from "@/domains/ui";
import { ViewComponent } from "@/store/types";

export const RegisterPage: ViewComponent = (props) => {
  const { app } = props;

  return (
    <div class="flex justify-center items-center h-screen bg-[#f8f9fa]">
      <div class="p-12 rounded-xl w-[480px] bg-white"></div>
    </div>
  );
};
