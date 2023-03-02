import React,{useState,useEffect,useRef} from 'react'
import { Table,Button,Modal,Switch } from 'antd'
import axios from 'axios'
import {DeleteOutlined,EditOutlined,ExclamationCircleFilled} from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm';
const {confirm}=Modal;
export default function UserList() {
  const [dataSource,setDataSource]=useState([])
  const [open,setOpen]=useState(false)
  const [isUpdateVisible,setIsUpdateVisible]=useState(false)
  const [roleList,setRoleList]=useState([])
  const [regionList,setRegionList]=useState([]) 
  const [isUpdateDisabled,setIsUpdateDisabled]=useState(false)
  const [current,setCurrent]=useState(null)
  const addForm =useRef(null);
  const updateForm =useRef(null);
  useEffect(() => { 
    axios.get("/users?_expand=role").then((res) => { 
      const {roleId,region,username}=JSON.parse(localStorage.getItem("token"))
      const list =res.data;
      setDataSource(roleId===1?list:[...list.filter((item) => { 
        return item.username===username
       }),
       ...list.filter((item) => {
          return item.region===region&&item.roleId===3
        })
      ])
     })
   },[]);
  useEffect(() => { 
    axios.get("/regions").then((res) => { 
      const list =res.data;
      setRegionList(list);
     })
   },[]);
  useEffect(() => { 
    axios.get("/roles").then((res) => { 
      const list =res.data;
      setRoleList(list);
     })
   },[]);
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map((item) => { 
          return {
            text:item.title,
            value:item.value,
          }
         }),
         {
           text:"全球",
           value:"全球"
         }
      ],
      onFilter: (value,item) => { 
        if(value==="全球")
        return item.region==="";
        return item.region===value
       },
      render: (region) => { 
        return <b>{region===""?'全球':region}</b>;
       }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => { 
        return role?.roleName;
       }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState,item) => { 
        return <Switch checked={roleState} disabled={item.default}
        onChange={() => { handleChange(item) }}
        ></Switch>
       }
    },
    {
      title: '操作',
      render: (item) => { 
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined/>} 
            onClick={() => { confirmMethod(item) }} disabled={item.default}/>
            <Button type="primary" shape="circle" icon={<EditOutlined/>} disabled={item.default}
            onClick={() => { handleUpdate(item) }}/>
          </div>
        )
       }
    },
  ];

  const handleUpdate = (item) => {
    // setIsUpdateVisible(true);  与下面语句未能同步，未设置为true就取updateForm（ref）
    // updateForm.current.setFieldsValue(item); 
    setIsUpdateVisible(true);
    if(item.roleId===1){
      setIsUpdateDisabled(true);
    }
    else{
      setIsUpdateDisabled(false);
    }
    console.log(item);
    setTimeout(() => { //setTimeout专治不同步！
      updateForm.current.setFieldsValue(item); //被动赋值，无法赋给Form value值
     },0)
     setCurrent(item);
  }
  const handleChange = (item) => {
    console.log(item);
    item.roleState=!item.roleState;
    setDataSource([...dataSource]);
    axios.patch(`/users/${item.id}`,{
      roleState:item.roleState
    })
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
    setDataSource(dataSource.filter((data) => { 
      return data.id!==item.id
     }));
     axios.delete(`/users/${item.id}`);
  }

  const addFormOk=() => { 
    addForm.current.validateFields().then((value) => { 
      setOpen(false);
      addForm.current.resetFields();
      // setDataSource([...dataSource,{}])
      //先post到后端，生成id，再设置 datasource以方便
      //后面的删除和更新
      axios.post(`/users`,{
        ...value,
        "roleState":true,
        "default":false,
      }).then((res) => { 
        console.log(res.data);
        setDataSource([...dataSource,{
          ...res.data,
          role:roleList.filter((item) => { 
            return item.id===value.roleId
           })[0]
        }]);
       })
     }).catch((err) => { 
       console.log(err);
      })
  }

  const updateFormOk = () => {
    updateForm.current.validateFields().then((value) => { 
      // console.log(value);
      setIsUpdateDisabled(!isUpdateDisabled);
      setTimeout(() => { setIsUpdateVisible(false); },0) 
      setDataSource(dataSource.map((item) => { 
        if(item.id===current.id){
          return {
            ...item,
            ...value,
            role:roleList.filter((data) => { 
              return data.id===value.roleId
             })[0]
          }
        }
        return item;
       }))
       axios.patch(`/users/${current.id}`,value)
     }) 
  }
  return (
    <div>
      <Button type="primary" onClick={() => { 
        setOpen(true);
       }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} 
      pagination={{pageSize:5}}
      rowKey={(item) => { return item.id }}
      />;
      <Modal
        open={open}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => { 
          setOpen(false);
         }}
        onOk={() => {
          addFormOk();
          }
        }
      >
        <UserForm ref={addForm} regionList={regionList} roleList={roleList}/>
      </Modal>
      <Modal
        open={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => { 
          setIsUpdateDisabled(!isUpdateDisabled);//这里卡了很久，useState一定要注意异步问题
          setTimeout(() => { setIsUpdateVisible(false); },0)
         }}
        onOk={() => {
          updateFormOk();
          }
        }
      >
        <UserForm ref={updateForm} regionList={regionList} 
        roleList={roleList} isUpdateDisabled={isUpdateDisabled} isUpdate={true}/>
      </Modal>
    </div>
  )
}
