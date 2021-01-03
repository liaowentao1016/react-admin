import React, { memo, useEffect, useState } from "react";

import { reqRoleList, reqAddRole, reqUpdataAuth } from "@/api";
import { formatDate } from "@/utils/formatDate";
import { menuList } from "@/utils/local-data";
import { getUser, removeUser } from "@/utils/storage";

import { Card, Table, Button, Modal, Form, Input, message, Tree } from "antd";

export default memo(function LQRole(props) {
  // state and props
  const [dataSource, setDataSource] = useState([]); // 表格数据源
  const [columns] = useState([
    {
      title: "角色名称",
      dataIndex: "name"
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      render: formatDate
    },
    {
      title: "授权时间",
      dataIndex: "auth_time",
      render: auth_time => {
        if (auth_time) {
          return formatDate(auth_time);
        }
      }
    },
    {
      title: "授权人",
      dataIndex: "auth_name"
    }
  ]);
  const [currentRole, setCurrentRole] = useState({}); // 当前点击的角色信息
  const [isShowAddModal, setIsShowAddModal] = useState(false); // 添加角色对话框的显示与隐藏
  const [isShowAuthModal, setIsShowAuthModal] = useState(false); // 设置角色权限对话框的显示与隐藏
  const [treeCheckedKeys, setTreeCheckedKeys] = useState([]); // 树节点选中的keys数组
  const [addForm] = Form.useForm();

  // hooks
  useEffect(() => {
    getRoleList();
  }, []);

  useEffect(() => {
    if (currentRole._id) {
      setTreeCheckedKeys(currentRole.menus);
    }
  }, [currentRole]);

  // handle
  async function getRoleList() {
    const res = await reqRoleList();
    if (res && res.status === 0) {
      setDataSource(res.data);
    }
  }
  const onRow = record => ({
    onClick: event => {
      // 保存当前点击的角色信息
      setCurrentRole(record);
    } // 点击行
  });

  const addOk = () => {
    // 表单验证
    addForm.validateFields().then(async values => {
      const res = await reqAddRole(values.name);
      if (res && res.status === 0) {
        message.success("添加角色成功");
        // 更新角色列表
        setDataSource((oldstate, props) => [...oldstate, res.data]);
        // 隐藏对话框
        setIsShowAddModal(false);
      } else {
        message.error("添加角色失败");
      }
    });
  };

  const authOk = async () => {
    // 收集数据
    const data = {
      _id: currentRole._id,
      menus: treeCheckedKeys,
      auth_time: Date.now(),
      auth_name: getUser().username
    };
    // 发送请求
    const res = await reqUpdataAuth(data);
    // 判断结果成功与否
    if (res && res.status === 0) {
      // 判断当年登录用户的角色权限 是否被修改 若被修改则强制用户退出重新登录
      if (getUser().role_id === currentRole._id) {
        // 清除当前用户信息
        removeUser();
        // 跳转到登录页面
        props.history.replace("/login");
        // 提示
        message.success("当前登录用户的角色权限被修改，请重新登录");
      } else {
        // 更新角色列表
        getRoleList();
        // 隐藏设置权限对话框
        setIsShowAuthModal(false);
        // 提示
        message.success("设置权限成功");
      }
    } else {
      message.error("设置权限失败");
    }
  };

  const onCheck = checkedKeys => {
    // 更新选中的树节点数组
    setTreeCheckedKeys(checkedKeys);
  };

  // jsx-template
  const title = (
    <div>
      <Button
        type="primary"
        onClick={() => {
          // 重置表单
          addForm.resetFields();
          setIsShowAddModal(true);
        }}
      >
        创建角色
      </Button>
      &nbsp;&nbsp;&nbsp;
      <Button
        disabled={!currentRole._id}
        type="primary"
        onClick={() => {
          setIsShowAuthModal(true);
        }}
      >
        设置角色权限
      </Button>
    </div>
  );
  // 返回的jsx
  return (
    <Card title={title}>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="_id"
        rowSelection={{
          type: "radio",
          selectedRowKeys: [currentRole._id],
          onSelect: record => {
            // 保存当前点击的角色信息
            setCurrentRole(record);
          }
        }}
        bordered
        pagination={{ defaultPageSize: 5 }}
        onRow={onRow}
      />
      {/* 添加角色对话框 */}
      <Modal
        title="添加角色"
        visible={isShowAddModal}
        onOk={addOk}
        onCancel={() => {
          setIsShowAddModal(false);
        }}
      >
        <Form form={addForm}>
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: "角色名称不能为空" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/*设置角色权限对话框*/}
      <Modal
        title="设置角色权限"
        visible={isShowAuthModal}
        onOk={authOk}
        onCancel={() => {
          setTreeCheckedKeys(currentRole.menus);
          setIsShowAuthModal(false);
        }}
      >
        <Form.Item label="角色名称">
          <Input disabled value={currentRole.name} />
        </Form.Item>

        <Tree
          treeData={menuList}
          defaultExpandAll
          checkable
          checkedKeys={treeCheckedKeys}
          onCheck={onCheck}
        />
      </Modal>
    </Card>
  );
});
