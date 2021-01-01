import React, { memo, useState, useEffect } from "react";

import { Card, List, Breadcrumb } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { reqCategoryById } from "@/api";

export default memo(function LQGoodsDetail(props) {
  // state and props
  const {
    name,
    desc,
    price,
    imgs,
    detail,
    pCategoryId,
    categoryId
  } = props.location.state;

  const [categoryName, setCategoryName] = useState({});
  // hooks
  useEffect(() => {
    async function getCategoryName() {
      if (pCategoryId === "0") {
        const res = await reqCategoryById(categoryId);
        if (res && res.status === 0) {
          setCategoryName({ pName: res.data.name, cName: "" });
        }
      } else {
        const res = await Promise.all([
          reqCategoryById(pCategoryId),
          reqCategoryById(categoryId)
        ]);
        setCategoryName({ pName: res[0].data.name, cName: res[1].data.name });
      }
    }
    getCategoryName();
  }, [pCategoryId, categoryId]);

  // jsx-template
  const header = (
    <div>
      <ArrowLeftOutlined
        style={{
          fontSize: 18,
          color: "#1DA57A",
          cursor: "pointer",
          marginRight: 15
        }}
        onClick={() => props.history.goBack()}
      />
      <span style={{ fontSize: 20, color: "#1da51a" }}>商品详情</span>
    </div>
  );
  const BASR_IMGURL = "http://localhost:5000/upload/";
  // 返回的jsx
  return (
    <Card className="good-detail">
      <List header={header}>
        <List.Item>
          <span style={{ fontSize: 18, fontWeight: "bold" }}>商品名称：</span>
          <span>{name}</span>
        </List.Item>
        <List.Item>
          <span style={{ fontSize: 18, fontWeight: "bold" }}>商品描述：</span>
          <span>{desc}</span>
        </List.Item>
        <List.Item>
          <span style={{ fontSize: 18, fontWeight: "bold" }}>商品价格：</span>
          <span>{price}元</span>
        </List.Item>
        <List.Item>
          <span style={{ fontSize: 18, fontWeight: "bold" }}>所属分类</span>
          <Breadcrumb>
            <Breadcrumb.Item>{categoryName.pName}</Breadcrumb.Item>
            <Breadcrumb.Item>{categoryName.cName}</Breadcrumb.Item>
          </Breadcrumb>
        </List.Item>
        <List.Item>
          <span style={{ fontSize: 18, fontWeight: "bold" }}>商品图片：</span>
          <span>
            {imgs.map(item => (
              <img
                src={BASR_IMGURL + item}
                alt="img"
                key={item}
                style={{ width: 80, height: 80, margin: "0 10px" }}
              />
            ))}
          </span>
        </List.Item>
        <List.Item>
          <span style={{ fontSize: 18, fontWeight: "bold" }}>商品详情：</span>
          <span dangerouslySetInnerHTML={{ __html: detail }}></span>
        </List.Item>
      </List>
    </Card>
  );
});
