import NewsPublish from '../../../components/publish-manage/NewsPublish';
import usePublish from '../../../components/publish-manage/usePublish';
import { Button } from 'antd';

export default function Published() {
  //2为已发布
  const {dataSource,handleSunset}=usePublish(2);
  return (
    <div><NewsPublish dataSource={dataSource} 
    button={(id)=><Button danger onClick={() => { handleSunset(id) }}>下线</Button>}
    /></div>
  )
}
