import React, { memo, useRef, useState } from "react";
// 引入编辑器组件
import BraftEditor from "braft-editor";
// 引入编辑器样式
import "braft-editor/dist/index.css";

export default memo(function RichText(props) {
  // state and props
  const { detail, getDetailHtml } = props;
  const [EditorState] = useState(() => {
    if (detail) {
      return BraftEditor.createEditorState(detail);
    }
  });
  const BraftEditorRef = useRef();
  // hooks

  // handle
  const handleEditorChange = editorState => {
    getDetailHtml(editorState.toHTML());
  };
  // 返回的jsx
  return (
    <BraftEditor
      ref={BraftEditorRef}
      defaultValue={EditorState}
      contentStyle={{ border: "1px solid #000", height: 300 }}
      onChange={handleEditorChange}
    />
  );
});
