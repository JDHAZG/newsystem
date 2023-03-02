import React,{forwardRef,useEffect,useState} from 'react'
import {Form,Input,Select} from 'antd'
const {Option}=Select
const UserForm=forwardRef((props,ref)=> {//子组件（UserForm）向父组件（UserList）传递参数方法
    const [isDisabled,setIsDisabled]=useState(false);
    const {roleId,region}=JSON.parse(localStorage.getItem("token"))
    // console.log(props);
    useEffect(() => { 
        setIsDisabled(props.isUpdateDisabled)
     },[props.isUpdateDisabled])

     const checkRegionDisabled = (item) => {
      if(props.isUpdate){
        if(roleId===1){
          return false;
        }else{return true}
      }
      else{
        if(roleId===1){
          return false;
        }else{return item.value!==region}
      }
     }
     const checkRoleDisabled = (item) => {
      if(props.isUpdate){
        if(roleId===1){
          return false;
        }else{return true}
      }
      else{
        if(roleId===1){
          return false;
        }else{return item.id!==3}
      }
     }
    return (
    <Form
          layout="vertical"
          ref={ref}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              {
                required: true,
                message: 'Please input the title of collection!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: true,
                message: 'Please input the title of collection!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="region"
            label="区域"
            rules={isDisabled?[]:[
              {
                required: true,
                message: 'Please input the title of collection!',
              },
            ]}
          >
            <Select disabled={isDisabled}>
              {
                props.regionList.map((item) => { 
                  return <Option value={item.value} key={item.id}
                  disabled={checkRegionDisabled(item)}>{item.title}</Option>
                 })
              }
            </Select>
          </Form.Item>
          <Form.Item
            name="roleId"
            label="角色"
            rules={[
                {
                  required: true,
                  message: 'Please input the title of collection!',
                },
              ]}
          >
            <Select onChange={(value) => { 
                if(value===1){
                    console.log(ref,props);
                    setIsDisabled(true);
                    ref.current.setFieldsValue({
                        region:""
                    })
                }
                else{
                    setIsDisabled(false);
                }
             }}>
              {
                props.roleList.map((item) => { 
                  return <Option value={item.id} key={item.id}
                  disabled={checkRoleDisabled(item)}>{item.roleName}</Option>
                 })
              }
            </Select>
          </Form.Item>
        </Form>
  )
})
export default UserForm;
