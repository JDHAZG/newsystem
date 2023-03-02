import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Row, List,Avatar,Drawer } from "antd";
import { FundViewOutlined } from '@ant-design/icons';
import axios from "axios";
import * as Echarts from "echarts";
import _ from 'lodash'
const {Meta} =Card;
export default function Home() {
  const [viewList, setViewList] = useState([]);
  const [starList, setStarList] = useState([]);
  const [allList, setAllList] = useState([])
  const [open, setOpen] = useState(false)
  const [pieChart, setPieChart] = useState(null)
  const {username,region,role:{roleName}}=JSON.parse(localStorage.getItem("token"))
  const barRef=useRef();
  const pieRef=useRef(); 
  useEffect(() => { 
    axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then((res) => { 
      // console.log(res.data);
      setViewList(res.data);
     })
   },[]);
  useEffect(() => { 
    axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then((res) => { 
      // console.log(res.data);
      setStarList(res.data);
     })
   },[]);
   useEffect(() => {
      axios.get("/news?publishState=2&_expand=category").then((res) => { 
        renderBarView(_.groupBy(res.data,(item) => { return item.category.title }));
        setAllList(res.data)
       })
      return () => { 
        window.onresize=null;
       }
   }, [])
   //多加个函数是为了防异步   
   const renderBarView = (obj) => {
    var myChart = Echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),//Object.key 将对象key值转为数组
        axisLabel:{
          rotate:"45",
          interval:0
        }
      },
      yAxis: {
        minInterval:1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item=>item.length) //Object.values 将对象values值转为数组
        }
      ]
    };
    
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.onresize=() => { 
      myChart.resize()
     }
   }

   const renderPieView = (obj) => {
    var currentList=allList.filter((item) => { 
      return item.author===username
    })
    var groupObj=_.groupBy(currentList,item=>item.category.title);
    var list=[];
    for(var i in groupObj){
      list.push({
        name:i,
        value:groupObj[i].length
      })
    }
    var myChart 
    // = Echarts.init(pieRef.current);
    if(!pieChart){
      myChart= Echarts.init(pieRef.current);
      setPieChart(myChart);
    }else{
      myChart=pieChart;
    }
    var option;

    option = {
      title: {
        text: '当前用户新闻分类图示',
        // subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }
   
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              // bordered
              dataSource={viewList}
              renderItem={(item) => <List.Item><a href={`/news-manage/preview/${item.id}`}
              >{item.title}</a></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="点赞最多" bordered={true}>
            <List
              // bordered
              dataSource={starList}
              renderItem={(item) => <List.Item><a href={`/news-manage/preview/${item.id}`}
              >{item.title}</a></List.Item>} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://img2.baidu.com/it/u=3335464826,3322284680&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800"
              />
            }
            actions={[
              <FundViewOutlined key="setting" onClick={() => { 
                setOpen(true) 
                 //init初始化
                setTimeout(() => {  renderPieView() },0)
              }}/>,
              // <EditOutlined key="edit" />,
              // <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joesch.moe/api/v1/random" />}
              title={username}
              description={<div>
                <b>{region?region:"全球"}</b>
                <span style={{paddingLeft:"30px"}}>{roleName}</span>
              </div>}
            />
          </Card>
        </Col>
      </Row>
      <Drawer width="500px" title="个人新闻分类" placement="right" closable={true}
      onClose={() => { setOpen(false) }} open={open}>
      <div ref={pieRef} style={{height:"400px",width:"100%",
      marginTop:"30px"}}></div>
      </Drawer>
      <div ref={barRef} style={{height:"400px",width:"100%",
      marginTop:"30px"}}></div>
    </div>
  );
}

