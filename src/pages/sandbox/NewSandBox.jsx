import React from "react";
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";
import { Layout } from "antd";
import "./NewSandBox.css";
import NewsRouter from "../../components/sandbox/NewsRouter";
import { Navigate } from "react-router";

const { Content } = Layout;
export default function NewSandBox() {
  return (
    <Layout> 
      <SideMenu />
      <Layout className="site-layout">
        <TopHeader />
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow: "auto"
          }}
        >
        {
          localStorage.getItem("token")?<NewsRouter/>:<Navigate to="/login" replace={true}/>
        }
        </Content>
      </Layout>
    </Layout>
  );
}
