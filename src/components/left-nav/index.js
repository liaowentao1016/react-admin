import React, { memo } from "react";
import { Link, withRouter } from "react-router-dom";
import "./index.less";

import { Menu } from "antd";

import { menuList } from "@/utils/local-data";

const { SubMenu } = Menu;

const LeftNav = memo(function LeftNav(props) {
  // state and props
  let { pathname } = props.location; // 获取当前路由
  // 判断pathname是否以'/admin/goods'开头
  if (pathname.indexOf("/admin/goods") === 0) {
    // 此时说明当前路由是商品管理 或者 商品管理的子路由
    pathname = "/admin/goods";
  }
  let openKeys = []; // 当前展开的SubMenu菜单项key数组
  // hooks

  // handle
  // 定义根据menuList获取对应的ReactNode的方法
  const getMenuListNode = menuList => {
    return menuList.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.key}>
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        );
      } else {
        const index = item.children.findIndex(
          iten => pathname.indexOf(iten.key) === 0
        );
        if (index !== -1) {
          openKeys.push(item.key);
        }
        return (
          <SubMenu key={item.key} title={item.title} icon={item.icon}>
            {getMenuListNode(item.children)}
          </SubMenu>
        );
      }
    });
  };

  // 返回的jsx
  return (
    <div className="left-nav">
      <Link to="/admin" className="left-nav-header">
        <img src={require("@/assets/img/logo.png").default} alt="logo" />
        <h2>购物街后台</h2>
      </Link>
      <div className="left-nav-menu">
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[pathname]}
          defaultOpenKeys={openKeys}
        >
          {getMenuListNode(menuList)}
        </Menu>
      </div>
    </div>
  );
});

// 因为需要在该组件内获取当前路由信息，而该组件又不是路由组件，
// 所以要使用高阶组件增强其props
export default withRouter(LeftNav);
