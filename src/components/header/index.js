import React, { memo, useEffect, useState } from "react";

import { Button, message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import "./index.less";

import { reqWeather } from "@/api";

import { getUser, removeUser } from "@/utils/storage";

import { formatDate } from "@/utils/formatDate";

import { menuList } from "@/utils/local-data";
import { withRouter } from "react-router-dom";

const LQHeader = memo(function LQHeader(props) {
  // state and props
  const [weatherInfo, setWeatherInfo] = useState({});
  const [currentTime, setCurrentTime] = useState(formatDate(Date.now()));
  const { pathname } = props.location;
  const { replace } = props.history;

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

  function getTitle() {
    let title = "";
    for (const item of menuList) {
      if (item.key === pathname) {
        title = item.title;
        break;
      } else if (item.children) {
        const cItem = item.children.find(
          cItem => pathname.indexOf(cItem.key) === 0
        );
        if (cItem) {
          title = cItem.title;
          break;
        }
      }
    }
    return title;
  }

  function logout() {
    Modal.confirm({
      title: "确认退出吗？",
      icon: <ExclamationCircleOutlined />,
      content: "退出后系统将不在保存您的信息",
      onOk() {
        // 移除用户登录信息
        removeUser();
        // 跳转到登录页面
        replace("/login");
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
        <span>欢迎，{getUser().username}</span>
        <Button type="primary" size="small" onClick={logout}>
          退出
        </Button>
      </div>
      <div className="header-bottom">
        <div className="header-bottom-left">{getTitle()}</div>
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
