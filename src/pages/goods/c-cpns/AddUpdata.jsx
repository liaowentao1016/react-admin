import React, { memo, useState, useEffect, useRef } from "react";

import { Card, Form, Input, Cascader, Button, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import PictureUpload from "./PictureUpload";
import RichText from "./RichText";

import { reqCategory, reqAddOrEditGood } from "@/api";

export default memo(function LQGoodsAddUpdata(props) {
  // state and props
  const [options, setOptions] = useState([]); // 分类列表
  const [firstCategorys, setFirstCategorys] = useState([]); // 一级分类列表
  //  商品图片与商品详情参数信息
  const imgsRef = useRef();
  const detailRef = useRef();
  // 因为添加商品和修改商品共用一个组件 所以要根据good来判断当前是哪个(修改商品会带一个good对象过来)
  // 从props中取出当前选择的商品信息
  const good = props.location.state || {};
  const {
    pCategoryId,
    categoryId,
    name,
    desc,
    price,
    imgs,
    detail,
    _id
  } = good;
  // 创建 form表单实例对象
  const [form] = Form.useForm();
  // 级联选择框的初始值
  const categoryValues = [];

  // hooks
  useEffect(() => {
    getCategorys("0");
  }, []);

  useEffect(() => {
    if (firstCategorys.length > 0) {
      getCategoryValues();
    }
  }, [firstCategorys]);

  // handle
  async function getCategorys(parentId) {
    const res = await reqCategory(parentId);
    if (res && res.status === 0) {
      if (parentId === "0") {
        // 渲染一级分类
        const options = res.data.map(item => ({
          value: item._id,
          label: item.name,
          isLeaf: false
        }));
        setOptions(options);
        setFirstCategorys(options);
      } else {
        // 将二级分类的数组返回出去
        const options = res.data.map(item => ({
          value: item._id,
          label: item.name,
          isLeaf: true
        }));
        return options;
      }
    }
  }

  const loadData = async selectedOptions => {
    // 获取当前点击的option对象
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // 开启loading状态
    targetOption.loading = true;
    // 拿到返回的二级分类数组
    const subCategorys = await getCategorys(targetOption.value);
    // 关闭loading状态
    targetOption.loading = false;
    if (subCategorys && subCategorys.length > 0) {
      // 将二级分类数组追加到当前点击的option对象上
      targetOption.children = subCategorys;
    } else {
      targetOption.isLeaf = true;
    }
    // 更新状态
    setOptions([...options]);
  };
  // 获取级联分类的初始值
  async function getCategoryValues() {
    if (name) {
      // 如果为修改商品
      if (pCategoryId === "0") {
        categoryValues.push(categoryId);
        form.setFieldsValue({ goodCategory: categoryValues });
      } else if (pCategoryId !== "0") {
        // 加载对应的二级分类以便显示出来
        const subCategorys = await getCategorys(pCategoryId);
        // 查找该二级分类对应的一级分类
        const targetCategory = firstCategorys.find(
          item => item.value === pCategoryId
        );
        // 将二级分类添加至对应的一级分类中
        targetCategory.children = subCategorys;
        // 添加对应的初始值
        categoryValues.push(pCategoryId, categoryId);
        form.setFieldsValue({ goodCategory: categoryValues });
      }
    }
  }
  // 表单验证通过且提交
  const onFinish = async values => {
    // 收集数据
    let pCategoryId, categoryId;
    const {
      goodName: name,
      goodDesc: desc,
      goodPrice: price,
      goodCategory
    } = values;

    if (goodCategory.length === 1) {
      pCategoryId = "0";
      categoryId = goodCategory[0];
    } else {
      pCategoryId = goodCategory[0];
      categoryId = goodCategory[1];
    }
    const imgs = imgsRef.current;
    const detail = detailRef.current;

    const data = { name, desc, price, pCategoryId, categoryId, imgs, detail };
    if (_id) {
      // 如果是修改操作还需一个_id参数
      data._id = _id;
    }
    // 调用接口
    const res = await reqAddOrEditGood(data);
    // 提示用户
    if (res && res.status === 0) {
      message.success(`${_id ? "修改" : "添加"}商品成功`);
      props.history.goBack();
    } else {
      message.success(`${_id ? "修改" : "添加"}商品失败`);
    }
  };
  // 获取商品图片的name数组 作为提交表单的数据
  const getImgNames = imgs => {
    imgsRef.current = imgs;
  };
  // 获取商品详情的html字符串 作为提交表单的数据
  const getDetailHtml = html => {
    detailRef.current = html;
  };

  // jsx-template
  const title = (
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
      {!good.name ? "添加商品" : "修改商品"}
    </div>
  );
  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 8 }
  };
  // 自定义商品价格验证规则
  const validatorPrice = (rule, value) => {
    if (value * 1 <= 0) {
      return Promise.reject("商品价格必须大于0");
    } else {
      return Promise.resolve();
    }
  };
  // 返回的jsx
  return (
    <Card title={title}>
      <Form {...layout} form={form} onFinish={onFinish}>
        <Form.Item
          name="goodName"
          label="商品名称"
          rules={[{ required: true, message: "商品名称为必填项" }]}
          initialValue={name}
        >
          <Input placeholder="请输入商品名称" />
        </Form.Item>
        <Form.Item
          name="goodDesc"
          label="商品描述"
          rules={[{ required: true, message: "商品描述为必填项" }]}
          initialValue={desc}
        >
          <Input.TextArea
            placeholder="请输入商品描述"
            rows={2}
            autoSize={{ minRows: 2, maxRows: 8 }}
          />
        </Form.Item>
        <Form.Item
          name="goodPrice"
          label="商品价格"
          rules={[
            { required: true, message: "商品价格为必填项" },
            { validator: validatorPrice }
          ]}
          initialValue={price}
        >
          <Input placeholder="请输入商品价格" addonAfter="元" type="number" />
        </Form.Item>
        <Form.Item
          name="goodCategory"
          label="商品分类"
          rules={[{ required: true, message: "商品分类为必选项" }]}
        >
          <Cascader
            options={options}
            changeOnSelect
            placeholder="请选择商品分类"
            loadData={loadData}
          />
        </Form.Item>
        <Form.Item label="商品图片" wrapperCol={{ span: 15 }}>
          <PictureUpload getImgNames={getImgNames} imgs={imgs} />
        </Form.Item>
        <Form.Item label="商品详情" wrapperCol={{ span: 20 }}>
          <RichText detail={detail} getDetailHtml={getDetailHtml} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            style={{ marginLeft: 20 }}
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
});
