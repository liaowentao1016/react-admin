import { combineReducers } from "redux";

import { CHANGE_HEADER_TITLE, CHANGE_CURRENT_USER } from "./constants";

import { getUser } from "@/utils/storage";

// 保存头部标题的reducer
function headerTitleReducer(state = "", action) {
  switch (action.type) {
    case CHANGE_HEADER_TITLE:
      return action.title;
    default:
      return state;
  }
}

// 保存当前登录用户的reducer
function currentUserReducer(state = getUser(), action) {
  switch (action.type) {
    case CHANGE_CURRENT_USER:
      return action.user;
    default:
      return state;
  }
}

// 导出合并的reducer
export default combineReducers({
  headerTitle: headerTitleReducer,
  currentUser: currentUserReducer
});
