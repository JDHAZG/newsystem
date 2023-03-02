import React from "react";
import { useNavigate } from 'react-router-dom';
import { Layout, Dropdown, Avatar } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons"; 
import { connect } from "react-redux";
const { Header } = Layout;
function TopHeader(props) {
  // console.log(props);
  const navigate=useNavigate();
  const {role:{roleName},username}=JSON.parse(localStorage.getItem("token"))?JSON.parse(localStorage.getItem("token")):{role:{roleName:""}}//解构 role里的rolename
  const items=[
    {
      key: "1",
      label: roleName
    },
    {
      key: "4",
      danger: true,
      label: "退出",
      onClick:() => { 
        localStorage.removeItem("token");
        setTimeout(() => { navigate("/login") },0);
       }
    },
  ]
  
  const changeCollapsed = () => {
    // console.log(props);
    props.changeCollapsed();
  }
  return (
    <Header
      className="site-layout-background"
      style={{
        // padding: '0,8px',
        paddingLeft: "16px",
      }}
    >
      {React.createElement( props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: "trigger",
        onClick: changeCollapsed,
      })}
      <div style={{ float: "right" }}>
        <span>欢迎<span style={{color:"#1890ff"}}>{username}</span>回来</span>
        <Dropdown menu={{items}}>
        <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}
const mapStateToProps = ({CollApsedReducer:{isCollapsed}}) => {
  return {
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed(){
    return {
      type:"change_collapsed"
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(TopHeader)
