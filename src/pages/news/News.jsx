import axios from "axios";
import React, { useState } from "react";
import _ from "lodash"
import { PageHeader } from "@ant-design/pro-layout";
import { Card, Col, Row,List } from "antd";
export default function News() {
  const [list, setList] = useState([])
  axios.get("/news?publishState=2&_expand=category").then((res) => {
    setList(Object.entries(_.groupBy(res.data,item=>item.category.title)));
  });
  return (
    <div style={{ width: "95%", margin: "0 auto" }}>
      <PageHeader
        onBack={() => window.history.back()}
        className="site-page-header"
        title="全球大新闻"
        subTitle="查看新闻"
      />
      <Row gutter={[16,16]}>
        {
            list.map((item) => { 
                return (
                    <Col span={8} key={item[0]}>
                        <Card title={item[0]} bordered={true} hoverable={true}>
                            <List
                            size="small"
                            dataSource={item[1]}
                            pagination={{
                                pageSize:3
                            }}
                            renderItem={(data) => <List.Item><a href={`/detail/${data.id}`}>{data.title}</a></List.Item>}
                            />
                        </Card>
                    </Col>
                )
             })
        }
      </Row>
    </div>
  );
}
