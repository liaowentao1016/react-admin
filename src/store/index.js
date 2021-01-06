import { createStore, applyMiddleware, compose } from "redux";

// 导入总的reducer
import reducer from "./reducer";

// 导入中间件 用于在redux中做异步操作
import thunk from "redux-thunk";

// 配置redux-dev-tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// 创建store对象
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

// 导出
export default store;
