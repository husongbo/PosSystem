import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

// 登录
const router = new Router({
  routes: [
    // 首先是登录页的路由
    {
      path: "/signin",
      name: "Signin",
      meta: {
        title: "Auto Vue"
      },
      component: () => import ("@/views/signin")
    },
    {
      path: "/",
      component: resolve => require(['@/layout'], resolve),
      meta: {
        title: '首页',
        keepAlive: false,
      },
      // redirect: '/notes', // 重定向到第一个子路由，否则只渲染Layout组件，这块儿使用时解除注释
      // redirect: "/signin", // 这里重定向到登录页面，是为了展示使用，实际用这个项目开发时，需要注释这行，解除上一行的注释
      children: [
        //用户管理
        {
          path: "/Jurisdiction_manger",
          meta: {
            title: "用户管理"
          },
          component: () => import("@/views/User_manager/Jurisdiction")
        },
        {
          path: "/Users_manger",
          meta: {
            title: "角色管理"
          },
          component: () => import("@/views/User_manager/User")
        },
        //商户管理
        {
          path: "/Merchant_mangers",
          meta: {
            title: "商户新增"
          },
          component: () => import("@/views/Merchant_manager/Merchants_Manager")
        },
        {
          path: "/Merchant_Infos",
          meta: {
            title: "商户信息查询"
          },
          component: () => import("@/views/Merchant_manager/Merchant_Info")
        },
        //备付金管理
        {
          path: "/Reserve_adds",
          meta: {
            title: "备付金信息"
          },
          component: () => import("@/views/Reserve_manager/Reserve_Add")
        },
        {
          path: "/Reserve_examines",
          meta: {
            title: "备付金新增审核"
          },
          component: () => import("@/views/Reserve_manager/Reserve_examine")
        },
        //流水管理
        {
          path: "/Flow_managers",
          meta: {
            title: "流水管理"
          },
          component: () => import("@/views/Flow_manager/FlowManager")
        },
        //油卡管理
        {
          path: "/Card_managers",
          meta: {
            title: "油卡管理"
          },
          component: () => import("@/views/Card_manager/CardManager")
        },
        //POS管理
        {
          path: "/Pos_managers",
          meta: {
            title: "POS管理"
          },
          component: () => import("@/views/POS_manager/PosManager")
        },
      ]
    }
  ]
});

// 当一个导航触发时，全局的 before 钩子按照创建顺序调用。钩子是异步解析执行，此时导航在所有钩子 resolve 完之前一直处于等待中。
router.beforeEach((to, from, next) => {
  // 自动化修改页面标签的 title
  document.title = to.meta.title;
  next()
    // 如果已经登录，并且要去登录页，就不让TA去登录页，重定向到首页【目前有点问题】
    // if (to.path === "/signin" && localStorage.token) {
    //   next("/notes");
    // } else {
    //   next();
    // }
});

export default router;
