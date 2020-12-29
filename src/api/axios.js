// 导入axios
import axios from "axios";

// 创建axios实例
const request = axios.create({
  baseURL: "",
  timeout: 5000
});

// 请求拦截器

// 响应拦截器
request.interceptors.response.use(
  config => config.data,
  error => {
    // 对错误信息进行统一处理
    console.log(error);
  }
);

// 导出axios实例
export default request;
