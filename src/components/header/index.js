import React, { memo, useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import { logoutAction } from "@/store/actionCreators";

import { Button, message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import "./index.less";

import { reqWeather } from "@/api";

import { formatDate } from "@/utils/formatDate";

import { withRouter } from "react-router-dom";

const LQHeader = memo(function LQHeader(props) {
  // state and props
  const [weatherInfo, setWeatherInfo] = useState({});
  const [currentTime, setCurrentTime] = useState(formatDate(Date.now()));

  // 获取天气情况
  useEffect(() => {
    getWeather(430723);
    const timer = setInterval(() => {
      setCurrentTime(formatDate(Date.now()));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  // react-redux hooks
  // 从redux中读取headerTitle数据
  const headerTitle = useSelector(state => state.headerTitle);
  const currentUser = useSelector(state => state.currentUser);
  const dispatch = useDispatch();

  // handle
  async function getWeather(code) {
    try {
      const res = await reqWeather(code);
      if (res.status === "1") {
        const { city, weather, temperature } = res.lives[0];
        setWeatherInfo({ city, weather, temperature });
      }
    } catch (error) {
      message.error("获取天气信息失败");
    }
  }

  function logout() {
    Modal.confirm({
      title: "确认退出吗？",
      icon: <ExclamationCircleOutlined />,
      content: "退出后系统将不在保存您的信息",
      onOk() {
        // 派发退出登录的action
        dispatch(logoutAction());
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  }

  // 返回的jsx
  return (
    <div className="header">
      <div className="header-top">
        <span>欢迎，{currentUser.username}</span>
        <Button type="primary" size="small" onClick={logout}>
          退出
        </Button>
      </div>
      <div className="header-bottom">
        <div className="header-bottom-left">{headerTitle}</div>
        <div className="header-bottom-right">
          <span>{currentTime}</span>
          <span className="city">{weatherInfo.city}</span>
          <span>{weatherInfo.weather}</span>
          <span>{weatherInfo.temperature}℃</span>
        </div>
      </div>
    </div>
  );
});

export default withRouter(LQHeader);
