export const NotFoundPage = () => {
  return (
    <div class="p-4">
      <div class="ml-12 pt-12">
        <div class="ml-2 text-3xl font-bold">使用方法</div>
        <div class="mt-4 flex">
          <img class="mr-2 w-[180px]" src="/app1.png" />
          <div class="mt-4 w-[168px]">
            <div class="flex items-center">
              <div class="flex items-center justify-center mr-2 rounded-full w-[24px] h-[24px] text-white bg-black">
                1
              </div>
              <div class="text-xl font-bold">药量计算</div>
            </div>
            <div class="mt-2">扫码计算出阻垢剂加药量，或按建议投加量1-6mg/L。</div>
          </div>
        </div>
        <div class="mt-4 flex">
          <img class="mr-2 w-[180px]" src="/app2.png" />
          <div class="mt-4 w-[168px]">
            <div class="flex items-center">
              <div class="flex items-center justify-center mr-2 rounded-full w-[24px] h-[24px] text-white bg-black">
                2
              </div>
              <div class="text-xl font-bold">投药方法</div>
            </div>
            <div class="mt-2">现场读取数据，扫码输入计算软件，计算得到阻垢剂添加量（KG）或计量泵刻度(%)。</div>
          </div>
        </div>
      </div>
    </div>
  );
};
