import {
  HomeOutlined,
  BarsOutlined,
  AppstoreOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  AreaChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined
} from "@ant-design/icons";

export const menuList = [
  {
    title: "首页", // 菜单标题名称
    key: "/admin/home", // 对应的path
    icon: <HomeOutlined />, // 图标名称
    isPublic: true // 公开的
  },
  {
    title: "商品",
    key: "/good",
    icon: <BarsOutlined />,
    children: [
      // 子菜单列表
      {
        title: "品类管理",
        key: "/admin/category",
        icon: <AppstoreOutlined />
      },
      {
        title: "商品管理",
        key: "/admin/goods",
        icon: <AppstoreOutlined />
      }
    ]
  },

  {
    title: "用户管理",
    key: "/admin/user",
    icon: <TeamOutlined />
  },
  {
    title: "角色管理",
    key: "/admin/role",
    icon: <SafetyCertificateOutlined />
  },

  {
    title: "图形图表",
    key: "/charts",
    icon: <AreaChartOutlined />,
    children: [
      {
        title: "柱形图",
        key: "/admin/bar",
        icon: <BarChartOutlined />
      },
      {
        title: "折线图",
        key: "/admin/line",
        icon: <LineChartOutlined />
      },
      {
        title: "饼图",
        key: "/admin/pie",
        icon: <PieChartOutlined />
      }
    ]
  }
];
