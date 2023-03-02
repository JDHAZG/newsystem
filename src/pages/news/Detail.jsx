import React, { useEffect,useState } from "react";
import { Descriptions } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import {  HeartTwoTone } from '@ant-design/icons';
import axios from "axios";
import { useParams } from "react-router";
import moment from "moment";
export default function Detail() {
    const {id}=useParams();
    const [newsInfo, setNewsInfo] = useState(null)
    useEffect(() => { 
        axios.get(`/news/${id}?_expand=category&_expand=role`).then((res) => { 
            setNewsInfo({
                ...res.data,
                view:res.data.view+1
            });
            return res.data;
         }).then((res) => { 
             axios.patch(`/news/${id}`,{
                 view:res.view+1
             })
          })
     },[id])
     const handleStar = (params) => {
         setNewsInfo({
             ...newsInfo,
             star:newsInfo.star+1
         })
         axios.patch(`/news/${id}`,{
            star:newsInfo.star+1
        })
     }
  return (
    <div>
      {
        newsInfo && <div>
            <PageHeader
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={
                <div>
                    {newsInfo.category.title}
                    <HeartTwoTone twoToneColor="#eb2f96" onClick={() => { handleStar() }}/>
                </div>
            }
        >
            <Descriptions size="small" column={3}>
            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
            <Descriptions.Item label="发布时间">
                {newsInfo.publishTime?moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss"):"-"}
            </Descriptions.Item>
            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
            <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
            <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
            <Descriptions.Item label="评论数量">{0}</Descriptions.Item>
            </Descriptions>
        </PageHeader>
        <div dangerouslySetInnerHTML={{__html:newsInfo.content}}
        style={{margin:"0 24px", border:"1px solid gray"}}></div>
        </div>
      }
    </div>
  );
}
