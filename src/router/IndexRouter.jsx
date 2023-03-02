import { Routes,Route} from "react-router-dom";
import React  from 'react'
import NewSandBox from "../pages/sandbox/NewSandBox";
import Login from "../pages/login/Login";
import News from "../pages/news/News";
import Detail from "../pages/news/Detail";
export default function IndexRouter(props) {//这种情况初始登录进不了，必须刷新一次再登录
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/news" element={<News/>} />
      <Route path="/detail/:id" element={<Detail/>} />
      <Route path="/*" element={<NewSandBox/>}/>
    </Routes>
  )
}
