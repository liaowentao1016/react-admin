import React, { memo, useState, useEffect, useRef } from "react";

import {
  Card,
  Button,
  Table,
  message,
  Tooltip,
  Breadcrumb,
  Modal,
  Form,
  Select,
  Input
} from "antd";
import { PlusOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

import { reqCategory, reqAddCategory, reqEditCategory } from "@/api";

export default memo(function LQCategory() {
  // 定义分类数据源
  const [dataSource, setDataSource] = useState([]);
  // 根据parentId判断当前获取的是一级分类还是二级分类 默认获取一级分类数据
  const [parentId, setParentId] = useState("0");
  // 保存二级分类对应的一级分类的名称
  const [categoryName, setCategoryName] = useState("");
  // 标识loading状态的显示与隐藏
  const [isLoading, setIsLoading] = useState(false);
  // 标识添加/修改分类对话框的显示与隐藏 0:全部隐藏 1：添加对话框显示 2：修改对话框显示
  const [isShowModal, setIsShowModal] = useState(0);
  // 点击修改分类时 保存对应的分类对象
  const categoryObj = useRef({});
  // 修改分类的表单实例对象
  const [updataForm] = Form.useForm();
  // 添加分类表单实例对象
  const [addForm] = Form.useForm();
  // 保存一级分类数据作为添加分类是下拉选择框的数据
  const firstCategorys = useRef([]);

  // hooks
  useEffect(() => {
    getCategoryList();
  }, [parentId]);

  // handle
  async function getCategoryList() {
    setIsLoading(true);
    const res = await reqCategory(parentId);
    setIsLoading(false);
    if (res.status === 0 && res.data) {
      setDataSource(res.data);
      if (parentId === "0") {
        firstCategorys.current = res.data;
      }
    } else {
      message.error("获取分类列表失败");
    }
  }
  // 展示子分类数据
  function showSubCategorys(category) {
    // 根据当前行的数据 获取当前行对应的_id也就是展示二级分类需要的id
    setParentId(category._id); //异步执行
    setCategoryName(category.name);
  }

  // 点击修改分类名称
  function showUpdataModal(category) {
    // 保存分类对象
    categoryObj.current = category;
    // 设置修改表单的初始值
    updataForm.setFieldsValue({
      newCategoryName: categoryObj.current.name
    });
    // 显示修改分类对话框
    setIsShowModal(2);
  }

  // 点击添加分类按钮
  function showAddModal() {
    // 设置添加表单下拉框的初始值
    addForm.setFieldsValue({
      parentId: parentId
    });
    // 显示添加分类对话框
    setIsShowModal(1);
  }

  // 确认添加
  function addOk() {
    // 表单验证
    addForm
      .validateFields()
      .then(async values => {
        // 表单验证通过 获取发送网络请求所需的参数 这里就为values对象
        const res = await reqAddCategory(values);
        if (res && res.status === 0) {
          message.success("添加分类成功");
          // 隐藏对话框
          setIsShowModal(0);
          // 重置表单
          addForm.resetFields();
          //
          if (values.parentId === parentId) {
            // 重新显示列表
            getCategoryList();
          }
        }
      })
      .catch(err => console.log(err));
  }

  // 确认修改
  function updataOk() {
    // 表单验证
    updataForm
      .validateFields()
      .then(async values => {
        // 表单验证通过 获取发送网络请求所需的参数
        const data = {
          categoryId: categoryObj.current._id,
          categoryName: values.newCategoryName
        };
        const res = await reqEditCategory(data);
        if (res && res.status === 0) {
          message.success("修改成功");
          // 隐藏对话框
          setIsShowModal(0);
          // 重新显示列表
          getCategoryList();
        }
      })
      .catch(err => console.log(err));
  }

  // 表格列数据
  const columns = [
    {
      title: "分类名称",
      dataIndex: "name",
      key: "name",
      width: 800
    },
    {
      title: "操作",
      render: category => (
        <div>
          <Tooltip placement="top" title="修改分类名称">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              style={{ margin: "0 10px" }}
              onClick={() => showUpdataModal(category)}
            />
          </Tooltip>
          {parentId === "0" ? (
            <Tooltip placement="top" title="查看二级分类">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                size="small"
                style={{ margin: "0 10px" }}
                onClick={() => showSubCategorys(category)}
              />
            </Tooltip>
          ) : null}
        </div>
      )
    }
  ];

  // 展示的title
  let title = (
    <Breadcrumb>
      <Breadcrumb.Item
        onClick={() => {
          setParentId("0");
          setCategoryName("");
        }}
      >
        <span style={{ cursor: "pointer", color: "#1DA57A", fontSize: "18px" }}>
          一级分类列表
        </span>
      </Breadcrumb.Item>
      {parentId !== "0" ? (
        <Breadcrumb.Item>{categoryName}</Breadcrumb.Item>
      ) : null}
    </Breadcrumb>
  );

  // 返回的jsx
  return (
    <Card
      title={title}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          添加
        </Button>
      }
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        bordered
        rowKey="_id"
        pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        loading={isLoading}
      />
      {/* 添加分类对话框 */}
      <Modal
        forceRender
        title="添加分类"
        visible={isShowModal === 1}
        onOk={addOk}
        onCancel={() => {
          addForm.resetFields();
          setIsShowModal(0);
        }}
      >
        <Form form={addForm}>
          <Form.Item name="parentId">
            <Select>
              <Select.Option value="0">一级分类</Select.Option>
              {firstCategorys.current.map(item => {
                return (
                  <Select.Option value={item._id} key={item._id}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="categoryName"
            rules={[{ required: true, message: "分类名称不能为空" }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
        </Form>
      </Modal>
      {/* 修改分类对话框 */}
      <Modal
        forceRender
        title="修改分类"
        visible={isShowModal === 2}
        onOk={updataOk}
        onCancel={() => {
          setIsShowModal(0);
        }}
      >
        <Form form={updataForm}>
          <Form.Item
            name="newCategoryName"
            rules={[{ required: true, message: "分类名称不能为空" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
});
