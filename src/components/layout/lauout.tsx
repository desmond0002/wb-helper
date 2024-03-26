import React from "react";
import { Alert, Layout, Menu, MenuProps, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getFile } from "../../features/file/fileSelector";

const { Header, Content } = Layout;

const items: MenuProps["items"] = [
  {
    label: "Главная",
    key: "/",
  },
  {
    label: "Телеграм",
    key: "/telegram",
  },
  {
    label: "Создание поставки",
    key: "/income",
  },
  {
    label: "Продажи",
    key: "/sales",
  },
  {
    label: "О приложении",
    key: "/about",
  },
];

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const onClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);
  };
  const fileData = useSelector(getFile);

  return (
    <Layout
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
          onClick={onClick}
        />
      </Header>
      {fileData.length === 0 && (
        <Alert
          message="Файл с данными не выбран. Выберите файл."
          type="info"
          style={{ marginTop: "16px" }}
        />
      )}
      <Content style={{ display: "flex", padding: "48px", flex: "1 1 auto" }}>
        {/* <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb> */}
        <div
          style={{
            display: "flex",
            flex: "1 1 auto",
            background: colorBgContainer,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <div style={{ width: "100%" }}>
            <Outlet />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export { AppLayout };
