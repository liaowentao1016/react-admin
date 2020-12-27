// 导入store模块 用于将数据保存在LocalStorage中
// 与原生相比 它会解决浏览器的兼容问题 以及对数据的处理会更好
import store from "store";

const USER_KEY = "user_key";

// 保存用户信息
export const saveUser = data => {
  //   localStorage.setItem(USER_KEY, JSON.stringify(data));
  store.set(USER_KEY, data);
};

// 获取用户信息
export const getUser = () => {
  //   JSON.parse(localStorage.getItem(USER_KEY) || "{}");
  return store.get(USER_KEY) || {};
};

// 移除用户信息
export const removeUser = () => {
  //   localStorage.removeItem(USER_KEY);
  store.remove(USER_KEY);
};
