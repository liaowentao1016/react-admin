import React from "react";
import { Redirect } from "react-router-dom";

// 路由懒加载 引入组件
const LQLogin = React.lazy(() => import("@/pages/login/Login.jsx"));
const LQAdmin = React.lazy(() => import("@/pages/admin/Admin.jsx"));

// 导入二级路由组件
const LQHome = React.lazy(() => import("@/pages/home/Home.jsx"));
const LQCategory = React.lazy(() => import("@/pages/category/Category.jsx"));
const LQGoods = React.lazy(() => import("@/pages/goods/Goods.jsx"));
const LQRole = React.lazy(() => import("@/pages/role/Role.jsx"));
const LQUser = React.lazy(() => import("@/pages/user/User.jsx"));
const LQBar = React.lazy(() => import("@/pages/charts/Bar.jsx"));
const LQLine = React.lazy(() => import("@/pages/charts/Line.jsx"));
const LQPie = React.lazy(() => import("@/pages/charts/Pie.jsx"));

// 导入三级路由组件
const LQGoodsHome = React.lazy(() => import("@/pages/goods/c-cpns/Home.jsx"));
const LQGoodsAddUpdata = React.lazy(() =>
  import("@/pages/goods/c-cpns/AddUpdata.jsx")
);
const LQGoodsDetail = React.lazy(() =>
  import("@/pages/goods/c-cpns/Detail.jsx")
);

// 导入404组件
const LQNotFound = React.lazy(() => import("@/pages/not-found/NotFound.jsx"));

// 创建路由规则
const routes = [
  {
    path: "/",
    exact: true,
    render: () => <Redirect to="/login" />
  },
  {
    path: "/login",
    component: LQLogin
  },
  {
    path: "/admin",
    component: LQAdmin,
    routes: [
      {
        path: "/admin",
        exact: true,
        render: () => <Redirect to="/admin/home" />
      },
      {
        path: "/admin/home",
        component: LQHome
      },
      {
        path: "/admin/category",
        component: LQCategory
      },
      {
        path: "/admin/goods",
        component: LQGoods,
        routes: [
          {
            path: "/admin/goods",
            exact: true,
            component: LQGoodsHome
          },
          {
            path: "/admin/goods/addupdata",
            component: LQGoodsAddUpdata
          },
          {
            path: "/admin/goods/detail",
            component: LQGoodsDetail
          }
        ]
      },
      {
        path: "/admin/role",
        component: LQRole
      },
      {
        path: "/admin/user",
        component: LQUser
      },
      {
        path: "/admin/bar",
        component: LQBar
      },
      {
        path: "/admin/line",
        component: LQLine
      },
      {
        path: "/admin/pie",
        component: LQPie
      },
      {
        component: LQNotFound
      }
    ]
  },
  {
    component: LQNotFound
  }
];

// 导出路由规则
export default routes;
