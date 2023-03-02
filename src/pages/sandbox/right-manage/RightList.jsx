import React,{useState,useEffect} from 'react'
import { Table,Tag,Button,Modal,Popover, Switch } from 'antd'
import axios from 'axios'
import {DeleteOutlined,EditOutlined,ExclamationCircleFilled} from '@ant-design/icons'
const {confirm}=Modal;
export default function RightList() {
  const [dataSource,setDataSource]=useState([])
  useEffect(() => { 
    axios.get("/rights?_embed=children").then((res) => { 
      const list =res.data;
      list.forEach((item) => { 
        if(item.children.length===0){
          item.children="";
        }
       })
      setDataSource(list);
     })
   },[]);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => { 
        return <b>{id}</b>;
       }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => { 
        return <Tag color="blue">{key}</Tag>
       }
    },
    {
      title: '操作',
      render: (item) => { 
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined/>} 
            onClick={() => { confirmMethod(item) }}/>
            <Popover content={<div style={{textAlign:"center"}}><Switch checked={item.pagepermisson} 
            onChange={() => {return switchMethod(item);}}></Switch></div>} 
            title="页面配置项" trigger={item.pagepermisson===undefined?'':'click'}>
            <Button type="primary" shape="circle" icon={<EditOutlined/>} disabled={item.pagepermisson===undefined}/>
            </Popover>
          </div>
        )
       }
    },
  ];
  const switchMethod = (item) => {
    console.log(item);
    item.pagepermisson=!item.pagepermisson;
    setDataSource([...dataSource]); 
    if(item.grade===1){
      axios.patch(`/rights/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
    else{
      axios.patch(`/children/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
  }
  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除吗',
      icon: <ExclamationCircleFilled />,
      // content: 'Some descriptions',
      onOk() {
        deleteMethod(item);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const deleteMethod = (item) => {
    console.log(item);    
    //前后端要同步状态！
    if(item.grade===1){
      setDataSource(dataSource.filter((data) => { 
        return data.id!==item.id;
       }))
      axios.delete(`/rights/${item.id}`)
    }
    else{
      let list=dataSource.filter((data) => { 
        return data.id===item.rightId;
       })
      list[0].children=list[0].children.filter((data) => { //filter返回的是数组
        return data.id!==item.id;
       })//此操作已导致dataSource的children改变
      setDataSource([...dataSource]);//setDataSource(dataSource)无法导致react渲染，因为没有二级（children）的新老状态对比
      axios.delete(`/children/${item.id}`)
    }
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}}/>
    </div>
  )
}
