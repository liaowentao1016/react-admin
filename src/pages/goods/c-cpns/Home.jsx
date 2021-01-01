import React, { memo, useEffect, useRef, useState } from "react";

import {
  Card,
  Select,
  Input,
  Button,
  Table,
  Switch,
  Tooltip,
  message
} from "antd";

import {
  PlusOutlined,
  EditOutlined,
  ApartmentOutlined
} from "@ant-design/icons";

import { reqGoods, reqSearchList, reqGoodsStatus } from "@/api";

export default memo(function LQGoodsHome(props) {
  // state and props
  // 表格的数据源
  const [dataSource, setDataSource] = useState([]);
  // 表格列的数据
  const [columns] = useState([
    {
      title: "商品名称",
      dataIndex: "name",
      ellipsis: true
    },
    {
      title: "商品描述",
      dataIndex: "desc",
      ellipsis: true
    },
    {
      title: "价格",
      dataIndex: "price",
      render: price => "￥" + price
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (status, product) => (
        <Switch
          checkedChildren="在售"
          unCheckedChildren="下架"
          defaultChecked={status === 1}
          onChange={checked => statusChange(checked, product)}
          loading={statusLoading}
        />
      )
    },
    {
      title: "操作",
      render: good => (
        <div>
          <Tooltip placement="top" title="详情">
            <Button
              type="primary"
              icon={<ApartmentOutlined />}
              size="small"
              onClick={() => props.history.push("/admin/goods/detail", good)}
            />
          </Tooltip>
          <Tooltip placement="top" title="修改">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              style={{ margin: "0 10px" }}
              onClick={() => props.history.push("/admin/goods/addupdata", good)}
            />
          </Tooltip>
        </div>
      )
    }
  ]);
  // 商品列表的参数对象
  const [params, setParams] = useState({ pageNum: 1, pageSize: 5 });
  // 搜索商品列表的参数类型
  const [searchType, setSearchType] = useState("productName");
  // 搜索商品列表参数
  const searchParams = useRef({});
  // 总的记录条数
  const [total, setTotal] = useState(0);
  // 加载数据时的loading状态
  const [isLoading, setIsLoading] = useState(false);
  // 更新状态的loading状态
  const [statusLoading, setStatusLoading] = useState(false);

  // hooks
  useEffect(() => {
    getGoodList();
  }, [params, total]);

  // handle
  // 获取商品列表
  async function getGoodList() {
    setIsLoading(true);
    let res;
    if (searchParams.current.productName || searchParams.current.productDesc) {
      res = await reqSearchList(searchParams.current);
    } else {
      res = await reqGoods(params);
    }

    if (res && res.status === 0) {
      setDataSource(res.data.list);
      setTotal(res.data.total);
      setIsLoading(false);
    } else {
      message.error("获取商品列表失败");
    }
  }
  // 确认搜索
  const onSearch = async value => {
    setParams({ ...params, pageNum: 1 });
    // 设置最新的搜索参数对象
    searchParams.current = { ...params, pageNum: 1, [searchType]: value };
    getGoodList();
  };
  // 下拉框发生改变
  const onSelect = value => {
    // 改变搜素商品列表的参数类型
    setSearchType(value);
  };
  // 页码改变的回调
  const pageNumChange = pageNum => {
    setParams({ ...params, pageNum });
  };
  // 状态变化时的回调 (更新状态)
  const statusChange = async (checked, product) => {
    setStatusLoading(true);
    const res = await reqGoodsStatus({
      productId: product._id,
      status: checked
    });
    if (res && res.status === 0) {
      message.success("更新状态成功");
    } else {
      message.error("更新状态失败");
    }
    setStatusLoading(false);
  };
  // jsx-template
  const title = (
    <div>
      <Select defaultValue={searchType} onSelect={onSelect}>
        <Select.Option value="productName">按名称搜索</Select.Option>
        <Select.Option value="productDesc">按描述搜索</Select.Option>
      </Select>
      <Input.Search
        placeholder="请输入关键字"
        style={{ width: 200, marginLeft: 20 }}
        allowClear
        enterButton
        onSearch={onSearch}
      />
    </div>
  );

  const extra = (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={() => props.history.push("/admin/goods/addupdata")}
    >
      添加
    </Button>
  );
  // 返回的jsx
  return (
    <Card title={title} extra={extra}>
      <Table
        dataSource={dataSource}
        columns={columns}
        bordered
        rowKey="_id"
        loading={isLoading}
        pagination={{
          showQuickJumper: true,
          total,
          current: params.pageNum,
          pageSize: params.pageSize,
          onChange: pageNumChange
        }}
      />
    </Card>
  );
});
