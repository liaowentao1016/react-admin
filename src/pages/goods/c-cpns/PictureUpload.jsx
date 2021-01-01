import React, { memo, useState } from "react";

import { Upload, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { reqDeleteImg } from "@/api";

export default memo(function PictureUpload(props) {
  // state and props
  const { getImgNames, imgs } = props;
  const [previewInfo, setPreviewInfo] = useState({
    previewVisible: false, // 模态框的显示与隐藏
    previewImage: "", // 预览图片的url
    previewTitle: "" // 预览图片的标题
  });
  const [fileList, setFileList] = useState(() => {
    if (imgs && imgs.length > 0) {
      return imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: "done",
        url: "http://localhost:5000/upload/" + img
      }));
    } else {
      return [];
    }
  });
  // handle
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // 点击文件链接或预览图标时的回调
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewInfo({
      ...previewInfo,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    });
  };

  // 上传中、完成、失败都会调用这个函数。
  const handleChange = async ({ file, fileList }) => {
    // 图片上传成功
    if (file.status === "done") {
      const res = file.response;
      if (res.status === 0) {
        message.success("上传成功");
        // 修改上传图片文件的信息以满足提交表单的参数需要
        fileList[fileList.length - 1].name = res.data.name;
        fileList[fileList.length - 1].url = res.data.url;
        getImgNames(fileList.map(img => img.name));
      } else {
        message.error("上传失败");
      }
    }
    setFileList(fileList);
  };

  // 删除图片
  const handleRemoved = async file => {
    console.log(file);
    const res = await reqDeleteImg(file.name);
    if (res.status === 0) {
      message.success("删除成功");
    } else {
      message.error("删除失败");
      return false;
    }
  };
  // 隐藏图片预览的模态框
  const handleCancel = () =>
    setPreviewInfo({ ...previewInfo, previewVisible: false });

  // jsx-template
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  // 返回的jsx
  return (
    <div>
      <Upload
        action="/manage/img/upload" /*上传图片的接口地址*/
        accept="image/*" /*只接收图片*/
        name="image" /*请求参数名*/
        listType="picture-card" /*卡片样式*/
        fileList={fileList} /*已上传文件的列表*/
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemoved}
      >
        {fileList.length >= 6 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewInfo.previewVisible}
        title={previewInfo.previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{ width: "100%" }}
          src={previewInfo.previewImage}
        />
      </Modal>
    </div>
  );
});
