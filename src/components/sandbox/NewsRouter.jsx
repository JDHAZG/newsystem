import { Navigate,Route,Routes } from "react-router-dom";

import React ,{useEffect, useState} from 'react'

import Home from "../../pages/sandbox/home/Home";
import UserList from "../../pages/sandbox/user-manage/UserList";
import RoleList from "../../pages/sandbox/right-manage/RoleList";
import RightList from "../../pages/sandbox/right-manage/RightList";
import NoPermission from "../../pages/sandbox/nopermission/NoPermission";
import NewsAdd from "../../pages/sandbox/news-manage/NewsAdd";
import NewsDraft from "../../pages/sandbox/news-manage/NewsDraft"
import NewsCategory from "../../pages/sandbox/news-manage/NewsCategory"
import Audit from "../../pages/sandbox/audit-manage/Audit"
import AuditList from "../../pages/sandbox/audit-manage/AuditList"
import Published from "../../pages/sandbox/publish-manage/Published"
import Sunset from "../../pages/sandbox/publish-manage/Sunset"
import Unpublished from "../../pages/sandbox/publish-manage/Unpublished"
import axios from "axios"
import NewsPreview from "../../pages/sandbox/news-manage/NewsPreview";
import NewsUpdate from "../../pages/sandbox/news-manage/NewsUpdate";
import { Spin } from "antd";
import { connect } from "react-redux";
const LocalRouterMap={
  "/home":<Home/>,
  "/user-manage/list":<UserList/>,
  "/right-manage/role/list":<RoleList/>,
  "/right-manage/right/list":<RightList/>,
  "/news-manage/add":<NewsAdd/>,
  "/news-manage/draft":<NewsDraft/>,
  "/news-manage/category":<NewsCategory/>,
  "/news-manage/preview/:id":<NewsPreview/>,
  "/news-manage/update/:id":<NewsUpdate/>,
  "/audit-manage/audit":<Audit/>,
  "/audit-manage/list":<AuditList/>,
  "/publish-manage/unpublished":<Unpublished/>,
  "/publish-manage/published":<Published/>,
  "/publish-manage/sunset":<Sunset/>,
}

function NewsRouter(props) {
  const [BackRouteList,setBackRouteList]=useState([]);
  useEffect(() => { 
    Promise.all([
      axios.get("/rights"),
      axios.get("/children"),
    ]).then((res) => { 
      // console.log(res);
      setBackRouteList([...res[0].data,...res[1].data])
     })
   },[])
   const {role:{rights}}=JSON.parse(localStorage.getItem("token"))?JSON.parse(localStorage.getItem("token")):{role:{rights:[]}};
   const checkRoute = (item) => {
     return LocalRouterMap[item.key]&&(item.pagepermisson||item.routepermisson);
   }
   const checkUserPerMission = (item) => {
     return rights.includes(item.key);
   }
  return (
    <Spin size="large" spinning={props.isLoading}>
    <Routes>
      {
        BackRouteList.map((item) => {
          if(checkRoute(item)&&checkUserPerMission(item))
          return <Route path={item.key} key={item.key} element={LocalRouterMap[item.key]} exact/>
          return null;
        })
      }
      <Route path="/" element={<Navigate to="/home"/>}/>
      {
        BackRouteList.length>0 && <Route path="*" element={<NoPermission/>}/>
      }
    </Routes>
    </Spin>
  )
}

const mapStateToProps = ({LoadingReducer:{isLoading}}) => {
  return {
    isLoading
  }
}

export default connect(mapStateToProps)(NewsRouter)
