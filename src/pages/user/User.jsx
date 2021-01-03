import React, { memo, useEffect, useRef, useState } from "react";

import {
  Card,
  Button,
  Table,
  Tooltip,
  message,
  Modal,
  Form,
  Select,
  Input
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";

import { reqUsers, reqDeleteUser, reqAddUser, reqEditUser } from "@/api";

import { formatDate } from "@/utils/formatDate";

export default memo(function LQUser() {
  // state and props
  const [users, setUsers] = useState([]); // 用户列表
  const [roles, setRoles] = useState([]); // 角色列表
  const [columns] = useState([
    { title: "用户名", dataIndex: "username" },
    { title: "邮箱", dataIndex: "email" },
    { title: "电话", dataIndex: "phone" },
    { title: "邮箱", dataIndex: "email" },
    { title: "注册时间", dataIndex: "create_time", render: formatDate },
    {
      title: "所属角色",
      dataIndex: "role_id",
      render: role_id => roleNames.current[role_id]
    },
    {
      title: "操作",
      render: user => (
        <div>
          <Tooltip placement="top" title="修改">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              style={{ margin: "0 10px" }}
              onClick={() => {
                currentUser.current = user;
                userForm.setFieldsValue({
                  username: user.username,
                  password: user.password,
                  phone: user.phone,
                  email: user.email,
                  role_id: user.role_id
                });
                setIsShowModal(true);
              }}
            />
          </Tooltip>

          <Tooltip placement="top" title="删除">
            <Button
              type="primary"
              icon={<DeleteOutlined />}
              size="small"
              style={{ margin: "0 10px" }}
              onClick={() => {
                Modal.confirm({
                  title: `确认删除${user.username}吗？`,
                  icon: <ExclamationCircleOutlined />,
                  content: "删除将无法恢复",
                  onOk() {
                    deleteUser(user);
                  }
                });
              }}
            />
          </Tooltip>
        </div>
      )
    }
  ]);
  const [isShowModal, setIsShowModal] = useState(false); // 控制模态的显示与隐藏
  const roleNames = useRef({}); // 所有角色名对象
  const [userForm] = Form.useForm(); // 表单实例对象
  const currentUser = useRef({}); // 当前用户对象
  // hooks
  useEffect(() => {
    getUsers();
  }, []);
  // handle
  async function getUsers() {
    const res = await reqUsers();
    if (res && res.status === 0) {
      const { users, roles } = res.data;
      initRoleNames(roles);
      setUsers(users);
      setRoles(roles);
    }
  }

  const initRoleNames = roles => {
    roleNames.current = roles.reduce((pre, role) => {
      pre[role._id] = role.name;
      return pre;
    }, {});
  };

  const deleteUser = async user => {
    const res = await reqDeleteUser(user._id);
    if (res && res.status === 0) {
      setUsers(oldUsers => oldUsers.filter(item => item._id !== user._id));
      message.success("删除成功");
    } else {
      message.error("删除失败");
    }
  };

  const handleOk = () => {
    // 表单验证
    userForm
      .validateFields()
      .then(async values => {
        let res;
        if (currentUser.current._id) {
          // 修改操作
          delete values.password;
          values._id = currentUser.current._id;
          res = await reqEditUser(values);
        } else {
          // 添加操作
          res = await reqAddUser(values);
        }
        if (res && res.status === 0) {
          // 重新获取最新的用户列表
          getUsers();
          // 隐藏对话框
          setIsShowModal(false);
          // 重置表单
          userForm.resetFields();
          // 提示
          message.success(currentUser.current._id ? "修改成功" : "添加成功");
          // 清空保存的当前user
          currentUser.current = {};
        } else {
          message.error(res.msg);
        }
      })
      .catch(error => console.log(error));
  };
  // jsx-template
  const title = (
    <Button type="primary" onClick={() => setIsShowModal(true)}>
      创建用户
    </Button>
  );
  // 返回的jsx
  return (
    <Card title={title}>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="_id"
        pagination={{ defaultPageSize: 3 }}
      />

      {/*添加/修改用户模态框*/}
      <Modal
        forceRender
        title={currentUser.current._id ? "修改用户" : "添加用户"}
        visible={isShowModal}
        onOk={handleOk}
        onCancel={() => {
          setIsShowModal(false);
          userForm.resetFields();
          currentUser.current = {};
        }}
      >
        <Form form={userForm} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              {
                required: true,
                message: "用户名不能为空"
              },
              { min: 4, message: "用户名长度至少为4位" },
              { max: 12, message: "用户名长度最大为12位" },
              {
                pattern: /^[\w]+$/,
                message: "用户名必须由英文、字母、下划线组成"
              }
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          {currentUser.current._id ? null : (
            <Form.Item
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  message: "密码不能为空"
                },
                { min: 4, message: "密码长度至少为4位" },
                { max: 12, message: "密码长度最大为12位" },
                {
                  pattern: /^[\w]+$/,
                  message: "密码必须由英文、字母、下划线组成"
                }
              ]}
            >
              <Input placeholder="请输入密码" type="password" />
            </Form.Item>
          )}
          <Form.Item
            label="手机"
            name="phone"
            rules={[
              {
                pattern: /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/,
                message: "手机号码不合法"
              }
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              {
                pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                message: "邮箱不合法"
              }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item label="角色" name="role_id">
            <Select placeholder="请选择角色">
              {roles.map(role => (
                <Select.Option value={role._id} key={role._id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
});
