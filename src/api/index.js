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

// 获取商品列表
export const reqGoods = params => {
  return request({
    url: "/manage/product/list",
    params
  });
};

// 获取搜索后的商品列表
export const reqSearchList = params => {
  return request({
    url: "/manage/product/search",
    params
  });
};

// 更新商品状态
export const reqGoodsStatus = data => {
  return request({
    url: "/manage/product/updateStatus",
    method: "POST",
    data
  });
};

// 根据ID查询商品分类
export const reqCategoryById = categoryId => {
  return request({
    url: "/manage/category/info",
    params: {
      categoryId
    }
  });
};

// 删除图片
export const reqDeleteImg = name => {
  return request({
    url: "/manage/img/delete",
    method: "POST",
    data: { name }
  });
};

// 添加 或者 修改 商品
export const reqAddOrEditGood = data => {
  const name = data._id ? "update" : "add";
  return request({
    url: "/manage/product/" + name,
    method: "POST",
    data
  });
};
