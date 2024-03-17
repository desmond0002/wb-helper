import React from "react";
import { Layout, Menu, theme, Input } from "antd";
import { read, utils, WorkSheet, writeFile } from "xlsx";
import { DataTable } from "../../components/table";

const { Header, Content } = Layout;

const items = [
  {
    key: "1",
    label: "Главная",
  },
  {
    key: "2",
    label: "О приложении",
  },
];

const AppLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
        />
      </Header>
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
          <div>
            <DataTable />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export { AppLayout };
