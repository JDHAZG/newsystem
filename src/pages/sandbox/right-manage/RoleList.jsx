import React,{useState,useEffect} from 'react'
import { Table,Button,Modal,Tree } from 'antd'
import axios from 'axios';
import {DeleteOutlined,EditOutlined,ExclamationCircleFilled} from '@ant-design/icons'
const {confirm}=Modal;
export default function RoleList() {
  const [dataSource,setDataSource]=useState([]);
  const [isModalOpen,setIsModalOpen]=useState(false);
  const [rightList,setRightList]=useState([]);
  const [currentRights,setCurrentRights]=useState([]);
  const [currentId,setCurrentId]=useState(0);
  const columns=[
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => { 
        return <b>{id}</b>;
       }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => { 
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined/>} 
            onClick={() => { confirmMethod(item) }}/>
            <Button type="primary" shape="circle" icon={<EditOutlined/>} 
            onClick={() => { setIsModalOpen(true); setCurrentRights(item.rights); setCurrentId(item.id)}}
            />
          </div>
        )
       }
    },
  ];
  
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
      setDataSource(dataSource.filter((data) => { 
        return data.id!==item.id;
       }))
      axios.delete(`/roles/${item.id}`)
  }

  useEffect(() => { 
    axios.get("/roles").then((res) => { 
      // console.log(res.data);
      setDataSource(res.data);
     })
   },[]);
  useEffect(() => { 
    axios.get("/rights?_embed=children").then((res) => { 
      // console.log(res.data);
      setRightList(res.data);
     })
   },[]);
   const handleOk = () => {
     setIsModalOpen(false);
     setDataSource(dataSource.map((item) => { 
       if(item.id===currentId){
         return {
           ...item,//类的...(展开)用法
           rights:currentRights//更新right
         }
       }
       return item;
      }))
      axios.patch(`/roles/${currentId}`,{
        rights:currentRights
      })
   }
   const handleCancel = () => {
     setIsModalOpen(false);
   }

   const onCheck = (checkKeys) => {
    //  console.log(checkKeys);
     setCurrentRights(checkKeys.checked);
   }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
      rowKey={((item) => { return item.id })}></Table>

      <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      <Tree
        checkable
        checkedKeys={currentRights}
        treeData={rightList}
        onCheck={onCheck}
        checkStrictly={true}
      />
      </Modal>
    </div>
  )
}
