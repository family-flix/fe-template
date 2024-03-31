import { onMount } from "solid-js";

import { ScrollViewCoreV2 } from "@/domains/scroll_view_v2";
import { ScrollViewV2 } from "@/components/ui/scroll-view-v2";

import "./index.css";

export const PullToRefreshExampleBeibeiPage = () => {
  onMount(() => {
    /*下拉刷新的回调 */
    // function downCallback() {
    //   //加载列表数据
    //   getListDataFromNet(
    //     0,
    //     1,
    //     (data) => {
    //       //联网成功的回调,隐藏下拉刷新的状态
    //       mescroll.endSuccess();
    //       //设置列表数据
    //       setListData(data, false);
    //     },
    //     function () {
    //       //联网失败的回调,隐藏下拉刷新的状态
    //       mescroll.endErr();
    //     }
    //   );
    // }

    /*上拉加载的回调 page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
    function upCallback(page: { num: number; size: number }) {
      //联网加载数据
      getListDataFromNet(page.num, page.size, (curPageData: any) => {
        //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        //mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
        console.log("page.num=" + page.num + ", page.size=" + page.size + ", curPageData.length=" + curPageData.length);
        //方法一(推荐): 后台接口有返回列表的总页数 totalPage
        //mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)

        //方法二(推荐): 后台接口有返回列表的总数据量 totalSize
        //mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)

        //方法三(推荐): 您有其他方式知道是否有下一页 hasNext
        //mescroll.endSuccess(curPageData.length, hasNext); //必传参数(当前页的数据个数, 是否有下一页true/false)

        //方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据,如果传了hasNext,则翻到第二页即可显示无更多数据.
        // mescroll.endSuccess(curPageData.length);

        //提示:curPageData.length必传的原因:
        // 1.判断是否有下一页的首要依据: 当传的值小于page.size时,则一定会认为无更多数据.
        // 2.比传入的totalPage, totalSize, hasNext具有更高的判断优先级
        // 3.使配置的noMoreSize生效

        //设置列表数据
        setListData(curPageData, true);
      });
    }
    /* 设置列表数据 */
    // @ts-ignore
    function setListData(curPageData, isAppend) {
      var listDom = document.getElementById("dataList");
      for (var i = 0; i < curPageData.length; i++) {
        var pd = curPageData[i];

        var str = '<img class="pd-img" src="/examples/loading-sq.png" imgurl="' + pd.pdImg + '"/>';
        str += '<p class="pd-name">' + pd.pdName + "</p>";
        str += '<p class="pd-price">' + pd.pdPrice + " 元</p>";
        str += '<p class="pd-sold">已售' + pd.pdSold + "件</p>";

        var liDom = document.createElement("li");
        liDom.innerHTML = str;

        if (isAppend) {
          // @ts-ignore
          listDom.appendChild(liDom); //加在列表的后面,上拉加载
        } else {
          // @ts-ignore
          listDom.insertBefore(liDom, listDom.firstChild); //加在列表的前面,下拉刷新
        }
      }
    }
    const data = [
      {
        pdImg: "/examples/pd1.jpg",
        pdName: "【1】  六罐装荷兰美素佳儿金装2段900g",
        pdPrice: 1149.0,
        pdSold: 648,
      },
      {
        pdImg: "/examples/pd2.jpg",
        pdName: "【2】  韩国Amore爱茉莉红吕洗发水套装修复受损发质",
        pdPrice: 89.0,
        pdSold: 128,
      },
      {
        pdImg: "/examples/pd3.jpg",
        pdName: "【3】  Friso美素佳儿 金装婴儿配方奶粉3段900g",
        pdPrice: 195.0,
        pdSold: 968,
      },
      {
        pdImg: "/examples/pd4.jpg",
        pdName: "【4】  Fisher pdPrice费雪 费雪三轮儿童滑行车",
        pdPrice: 299.0,
        pdSold: 85,
      },
      {
        pdImg: "/examples/pd5.jpg",
        pdName: "【5】  Babylee巴布力 实木婴儿床 雷卡拉130*70cm",
        pdPrice: 1889.0,
        pdSold: 18,
      },
      {
        pdImg: "/examples/pd6.jpg",
        pdName: "【6】  Pigeon贝亲 独立三层奶粉盒 送小罐奶粉1段200g",
        pdPrice: 70.0,
        pdSold: 658,
      },
      {
        pdImg: "/examples/pd7.jpg",
        pdName: "【7】 TTBOO兔兔小布 肩纽扣套装",
        pdPrice: 268.0,
        pdSold: 128,
      },
      {
        pdImg: "/examples/pd8.jpg",
        pdName: "【8】  Nuna璐拉 婴儿布里奇果精纯嫩肤沐浴露婴儿精纯芦荟胶",
        pdPrice: 140.0,
        pdSold: 366,
      },
      {
        pdImg: "/examples/pd9.jpg",
        pdName: "【9】  illuma启赋 奶粉3段900g",
        pdPrice: 252.0,
        pdSold: 98,
      },
      {
        pdImg: "/examples/pd10.jpg",
        pdName: "【10】  Abbott雅培乳蛋白部分水解婴儿配方奶粉3段820g",
        pdPrice: 89.0,
        pdSold: 128,
      },
      {
        pdImg: "/examples/pd11.jpg",
        pdName: "【11】  韩蜜 酷炫唇蜜（礼盒套装）2.8g*4",
        pdPrice: 179.0,
        pdSold: 35,
      },
      {
        pdImg: "/examples/pd12.jpg",
        pdName: "【12】  保税区直发【3包装】日本Merries花王纸尿裤NB90",
        pdPrice: 289.0,
        pdSold: 1928,
      },
      {
        pdImg: "/examples/pd13.jpg",
        pdName: "【13】  Comotomo可么多么 硅胶奶瓶（0-3月奶嘴）150ml绿色",
        pdPrice: 203.0,
        pdSold: 87,
      },
      {
        pdImg: "/examples/pd14.jpg",
        pdName: "【14】  香港直邮德国瑞德露Rival de Loop芦荟精华安瓶",
        pdPrice: 152.0,
        pdSold: 61,
      },
      {
        pdImg: "/examples/pd15.jpg",
        pdName: "【15】  保税区直发药师堂尊马油香草味温和保湿无刺激面霜",
        pdPrice: 269.0,
        pdSold: 73,
      },
      {
        pdImg: "/examples/pd16.jpg",
        pdName: "【16】  香港直邮日本Spatreatment眼膜保湿去细纹法令纹",
        pdPrice: 219.0,
        pdSold: 13,
      },
      {
        pdImg: "/examples/pd17.jpg",
        pdName: "【17】  韩国MEDIHEALNMF可莱丝针剂睡眠面膜",
        pdPrice: 81.0,
        pdSold: 128,
      },
      {
        pdImg: "/examples/pd18.jpg",
        pdName: "【18】  DHC蝶翠诗橄榄蜂蜜滋养洗脸手工皂90g",
        pdPrice: 123.0,
        pdSold: 77,
      },
      {
        pdImg: "/examples/pd19.jpg",
        pdName: "【19】  日本资生堂CPB肌肤之钥新版隔离霜 清爽型 30ml",
        pdPrice: 429.0,
        pdSold: 36,
      },
      {
        pdImg: "/examples/pd20.jpg",
        pdName: "【20】 Heinz亨氏 婴儿面条优加面条全素套餐组合3口味3盒",
        pdPrice: 39.0,
        pdSold: 61,
      },
      {
        pdImg: "/examples/pd21.jpg",
        pdName: "【21】  Heinz亨氏 乐维滋果汁泥组合5口味15袋",
        pdPrice: 69.0,
        pdSold: 55,
      },
      {
        pdImg: "/examples/pd22.jpg",
        pdName: "【22】  保税区直发澳大利亚Swisse高浓度蔓越莓胶囊30粒",
        pdPrice: 271.0,
        pdSold: 19,
      },
      {
        pdImg: "/examples/pd23.jpg",
        pdName: "【23】  挪威Nordic Naturals小鱼婴幼儿鱼油DHA滴剂",
        pdPrice: 102.0,
        pdSold: 125,
      },
      {
        pdImg: "/examples/pd24.jpg",
        pdName: "【24】  澳大利亚Bio island DHA for Pregnancy海藻油DHA",
        pdPrice: 289.0,
        pdSold: 28,
      },
      {
        pdImg: "/examples/pd25.jpg",
        pdName: "【25】  澳大利亚Fatblaster Coconut Detox椰子水",
        pdPrice: 152.0,
        pdSold: 17,
      },
      {
        pdImg: "/examples/pd26.jpg",
        pdName: "【26】  Suitsky舒比奇 高护极薄舒爽纸尿片尿不湿XL60",
        pdPrice: 99.0,
        pdSold: 181,
      },
      {
        pdImg: "/examples/pd27.jpg",
        pdName: "【27】  英国JUST SOAP手工皂 玫瑰天竺葵蛋糕皂",
        pdPrice: 72.0,
        pdSold: 66,
      },
      {
        pdImg: "/examples/pd28.jpg",
        pdName: "【28】  德国NUK 多色婴幼儿带盖学饮杯",
        pdPrice: 92.0,
        pdSold: 138,
      },
    ];
    // @ts-ignore
    function getListDataFromNet(pageNum, pageSize, successCallback) {
      setTimeout(function () {
        var listData = [];
        if (pageNum == 0) {
          //此处模拟下拉刷新返回的数据
          var i = Math.floor(Math.random() * data.length); //随机取一个商品返回
          data[i].pdName = "【新增商品】 商品标题";
          listData.push(data[i]);
        } else {
          //此处模拟上拉加载返回的数据 (模拟分页数据)
          for (var i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {
            if (i == data.length) break;
            listData.push(data[i]);
          }
        }
        // 回调
        successCallback(listData);
      }, 2000);
    }
    // const elements: {
    //   downLoadingDom: HTMLElement;
    //   downProgressDom: HTMLElement;
    // } = {};
    // const mescroll = new MeScroll({
    //   selector: "mescroll",
    //   down: {
    //     offset: 1000,
    //     // 下拉刷新的布局内容
    //     htmlContent: [
    //       '<img class="downwarp-slogan" src="/examples/beibei/mescroll-slogan.jpg"/>',
    //       '<p class="downwarp-progress"></p>',
    //       '<p class="downwarp-loading mescroll-rotate"></p>',
    //     ].join(""),
    //     auto: false, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
    //     inited(_, downwarp) {
    //       elements.downLoadingDom = downwarp.getElementsByClassName("downwarp-loading")[0] as HTMLElement;
    //       elements.downProgressDom = downwarp.getElementsByClassName("downwarp-progress")[0] as HTMLElement;
    //     },
    //     inOffset() {
    //       // 进入指定距离范围内那一刻的回调
    //       elements.downLoadingDom.style.display = "none";
    //       elements.downProgressDom.style.display = "inline-block";
    //       elements.downProgressDom.style.webkitTransform = "rotate(0deg)";
    //       elements.downProgressDom.style.transform = "rotate(0deg)";
    //     },
    //     outOffset() {
    //       // 下拉超过指定距离那一刻的回调
    //       elements.downProgressDom.style.webkitTransform = "rotate(180deg)";
    //       elements.downProgressDom.style.transform = "rotate(180deg)";
    //     },
    //     onMoving(mescroll, rate, downHight) {
    //       // 下拉过程中的回调，滑动过程一直在执行；
    //       // rate 下拉区域当前高度与指定距离的比值(inOffset: rate<1; outOffset: rate>=1);
    //       // downHight当前下拉区域的高度
    //       // 配置空方法,表示移动过程不做处理 (不可写onMoving:null,否则会执行mescroll默认配置的onMoving方法)
    //     },
    //     showLoading(mescroll: MeScroll) {
    //       elements.downProgressDom.style.display = "none";
    //       elements.downLoadingDom.style.display = "inline-block";
    //     },
    //     callback: () => {
    //       downCallback();
    //     },
    //   },
    //   up: {
    //     auto: true,
    //     isBoth: true,
    //     isBounce: false,
    //     callback: () => {},
    //   },
    // });
  });

  const u = navigator.userAgent;
  const os = {
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    pc: typeof window.orientation === "undefined",
    android: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1,
    wx: u.toLowerCase().match(/MicroMessenger/i)?.[0] === "micromessenger",
  };
  const scroll = new ScrollViewCoreV2({
    os,
    down: {
      offset: 80,
    },
  });

  scroll.onPullToRefresh(() => {
    setTimeout(() => {
      scroll.finishPullToRefresh();
    }, 800);
  });

  onMount(() => {
    // setTimeout(() => {
    //   scroll.startPullToRefresh();
    // }, 3000);
  });

  return (
    <div>
      <div class="header"></div>
      <ScrollViewV2 store={scroll} class="fixed top-[84px] bottom-0 h-auto">
        <img src="/examples/beibei/beibei1.jpg" />
        <img src="/examples/beibei/beibei2.jpg" />
        <ul id="dataList" class="data-list h-[1200px]"></ul>
      </ScrollViewV2>
      {/* <div class="footer"></div> */}
    </div>
  );
};
