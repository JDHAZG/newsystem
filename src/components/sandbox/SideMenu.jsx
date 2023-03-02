import React, { useState ,useEffect} from 'react'
import {useNavigate,useLocation} from 'react-router-dom'
// import {useNavigate} from '_react-router@6.4.3@react-router'
import axios from 'axios'
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
} from '@ant-design/icons';
import './index.css'
import { connect } from "react-redux";
const {Sider} = Layout;
const { SubMenu } = Menu;
const iconList ={
   "/home":<UserOutlined/>,
   "/user-manage":<UserOutlined/>,
   "/user-manage/list":<UserOutlined/>,
   "/right-manage":<UserOutlined/>,
   "/right-manage/role/list":<UserOutlined/>,
   "/right-manage/right/list":<UserOutlined/>,
 }
function SideMenu(props) {
  const navigate=useNavigate();
  const onClick = (e) => {
    navigate(e.key);
  }
  const [menu,setMenu]=useState([]);
  useEffect(() => { 
    axios.get("/rights?_embed=children").then((res) => { 
      // console.log(res.data); 
      setMenu(res.data);
    })
   },[]);
   const {role:{rights}}=JSON.parse(localStorage.getItem("token"))?JSON.parse(localStorage.getItem("token")):{role:{rights:""}};//解构
   const checkPagePermission =(item) => { 
     return item.pagepermisson&&rights.includes(item.key)
    }
  const renderMenu = (menuList) => {
    return menuList.map((item) => { 
      if(item.children?.length>0 &&checkPagePermission(item)){
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>{renderMenu(item.children)}</SubMenu>
      }

      return  checkPagePermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={onClick}>{item.title}</Menu.Item>
     })
  }
  const location=useLocation();
  // console.log(location.pathname);
  const selectKeys=[location.pathname];
  const openKeys=["/"+location.pathname.split("/")[1]]
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
        <div style={{display:"flex",height:"100%",flexDirection:"column"}}>
          <div className="logo">全球新闻发布管理系统</div>
          <div style={{flex:1,overflow:"auto"}}>
            <Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={openKeys}>
              {renderMenu(menu)}
            </Menu>
          </div>
        </div>
      </Sider>
  )
}

const mapStateToProps = ({CollApsedReducer:{isCollapsed}}) => {
  return {
    isCollapsed
  }
}

export default connect(mapStateToProps)(SideMenu)
