/**
 * 生成action对象的工厂函数
 */

import { CHANGE_HEADER_TITLE, CHANGE_CURRENT_USER } from "./constants";

import { reqLogin } from "@/api";
import { message } from "antd";

import { saveUser, removeUser } from "@/utils/storage";

export const changeHeaderTitleAction = title => ({
  type: CHANGE_HEADER_TITLE,
  title
});

// 定义一个同步的action用户保存当前登录用户信息
const changeUserAction = user => ({ type: CHANGE_CURRENT_USER, user });

// 异步action 用于登录时 将登录用户信息保存到redux中
export const loginAction = data => {
  return async dispatch => {
    // 发送网络请求
    const res = await reqLogin(data);
    if (res && res.status === 0) {
      // 登录成功
      // 保存到local中
      saveUser(res.data);
      // 保存到redux中 派发同步action
      dispatch(changeUserAction(res.data));
      // 提示
      message.success("登录成功");
    } else {
      // 登录失败
      message.error("用户名或密码错误");
    }
  };
};

// 退出登录
export const logoutAction = () => {
  // 清除local中的数据
  removeUser();
  return { type: CHANGE_CURRENT_USER, user: {} };
};
