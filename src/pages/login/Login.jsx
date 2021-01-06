import React, { memo } from "react";

import { useDispatch, useSelector } from "react-redux";

import { loginAction } from "@/store/actionCreators";

import "./login.less";

import { Form, Input, Button } from "antd";

export default memo(function Login(props) {
  // 获取表单实例对象
  const [form] = Form.useForm();

  // react-redux hooks
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.currentUser);

  if (currentUser && currentUser._id) {
    props.history.replace("/admin/home");
  }

  // 自定义密码的验证规则
  function validatorPwd(rule, value) {
    if (value === undefined || value.length === 0) {
      return Promise.reject("请输入密码");
    } else if (value.length < 4) {
      return Promise.reject("密码的长度不能小于4位");
    } else if (value.length > 12) {
      return Promise.reject("密码长度不能大于12位");
    } else if (!/^[\w]+$/.test(value)) {
      return Promise.reject("密码必须由英文、字母、下划线组成");
    } else {
      return Promise.resolve();
    }
  }
  // 验证通过 提交表单
  async function onFinish(values) {
    // 派发action 交给redux处理
    dispatch(loginAction(values));
  }

  // 返回的jsx
  return (
    <div className="login">
      <header className="login-header">
        <img src={require("@/assets/img/logo.png").default} alt="login" />
        <h1>购物街后台管理系统</h1>
      </header>
      <section className="login-content">
        <h2>用户登录</h2>
        <Form
          className="login-form "
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={onFinish}
          form={form}
          initialValues={{
            username: "admin",
            password: "admin"
          }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "请输入用户名"
              },
              { min: 4, message: "用户名长度至少为4位" },
              { max: 12, message: "用户名长度最大为12位" },
              {
                pattern: /^[\w]+$/,
                message: "用户名必须由英文、字母、下划线组成"
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            required
            rules={[
              {
                validator: validatorPwd
              }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <div style={{ textAlign: "right" }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: "20px" }}
            >
              登录
            </Button>
            <Button type="primary" onClick={e => form.resetFields()}>
              重置
            </Button>
          </div>
        </Form>
      </section>
    </div>
  );
});
