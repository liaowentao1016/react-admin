import React, { memo } from "react";

import { renderRoutes } from "react-router-config";

import { Layout } from "antd";

import LeftNav from "@/components/left-nav";
import LQHeader from "@/components/header";

const { Footer, Sider, Content } = Layout;

export default memo(function Admin(props) {
  return (
    <Layout style={{ height: "100%" }}>
      <Sider>
        <LeftNav />
      </Sider>
      <Layout>
        <LQHeader />
        <Content
          style={{
            backgroundColor: "#fff",
            margin: "20px",
            height: 572.8,
            overflowY: "auto"
          }}
        >
          {renderRoutes(props.route.routes)}
        </Content>
        <Footer style={{ textAlign: "center", color: "#ccc" }}>
          推荐使用谷歌浏览器，可以获得更佳页面操作体验
        </Footer>
      </Layout>
    </Layout>
  );
});
