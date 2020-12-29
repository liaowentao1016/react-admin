import request from "./axios";

// 登录
export const reqLogin = data => {
  return request({
    url: "/login",
    method: "POST",
    data
  });
};

// 请求获取天气状况 (高德提供的接口)
export const reqWeather = code => {
  return request({
    url: `https://restapi.amap.com/v3/weather/weatherInfo?key=90753eb1659034bbdd9b990f1a42e41f&city=${code}&extensions=base&output=json`
  });
};

// 获取一级/二级分类列表
export const reqCategory = parentId => {
  return request({
    url: "/manage/category/list",
    params: { parentId }
  });
};

// 添加分类
export const reqAddCategory = data => {
  return request({
    url: "/manage/category/add",
    method: "POST",
    data
  });
};

// 修改分类名称
export const reqEditCategory = data => {
  return request({
    url: "/manage/category/update",
    method: "POST",
    data
  });
};
