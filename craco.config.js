// 修改主体颜色
const CracoLessPlugin = require("craco-less");

const path = require("path");

module.exports = {
  plugins: [
    // 修改主题颜色
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "#1DA57A" },
            javascriptEnabled: true
          }
        }
      }
    }
  ],
  // 按需引入antd组件
  babel: {
    plugins: [
      [
        "import",
        {
          libraryName: "antd",
          libraryDirectory: "es",
          style: true //设置为true即是less
        }
      ]
    ]
  },

  // 配置别名
  webpack: {
    alias: {
      "@": path.join(__dirname, "src")
    }
  }
};
