import React, { useState } from 'react';
import { Button, Col, Input, message, Row, Table, Typography, Checkbox, Tag, Divider } from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const { Text } = Typography;


const NodataList = ({nodatas, loading}) => {
  const [mine, setMine] = useState(true);
  const [searchText, setSearchText] = useState(undefined);

  let userNodatas = [];
  if (mine) {
    nodatas.forEach(v => {
      userNodatas.push(v);
    })
  } else {
    userNodatas = nodatas
  }

  let FilterSearchNodatas = [];
  if (searchText && searchText !== ''){
    let searchTexts = searchText.toLowerCase().split(' ');
    userNodatas.forEach(v => {
      let find = true;
      searchTexts.every(text=>{
        if (v.name.toLowerCase().indexOf(text) === -1 &&
          v.metric.toLowerCase().indexOf(text) === -1 &&
          v.tags.toLowerCase().indexOf(text) === -1){
          find = false;
          return false
        }
        return true
      });

      if (find){
        FilterSearchNodatas.push(v)
      }
    });
  } else {
    FilterSearchNodatas = nodatas;
  }

  const renderObjType = objType =>{
    if (objType === 'group'){
      return <Tag color="blue">机器分组</Tag>
    }
    if (objType === 'host'){
      return <Tag color="orange">主机</Tag>
    }
    return <Tag color="gray">其他</Tag>
  };

  const renderObj = obj =>{
    if (obj){
      const objs = obj.split(",")
      return (
        <span>
          {
            objs.map((v, i)=>{
              return <Tag color="green" key={i}>{v}</Tag>
            })
          }
        </span>
      )
    }
    return <span></span>
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      render: (text, record) => {
        return <span><Text strong>{text}</Text></span>
      }
    },
    {
      title: '对象类型',
      dataIndex: 'obj_type',
      render: text => renderObjType(text)
    },
    {
      title: '对象',
      dataIndex: 'obj',
      render: text => renderObj(text)
    },
    {
      title: '指标',
      dataIndex: 'metric',
      render: (text, record) => {
        if (record.tags) {
          return <span><Text strong>{text}</Text>/<Text strong style={{color:"green"}}>{record.tags}</Text></span>
        }
        return <span><Text strong>{text}</Text></span>
      }
    },
    // 因为现在只有GAUGE的数据类型，所有就不展示了
    // {
    //   title: '数据类型',
    //   dataIndex: 'dstype',
    // },
    {
      title: '间隔',
      dataIndex: 'step',
    },
    {
      title: '填补数据',
      dataIndex: 'mock',
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 220,
      render: (text, record)=>{
        return (
          <span>
            <Button type="primary" size="small" href="#">修改</Button>
            <Divider type={'vertical'}/>
            <Button type="primary" size="small" href="#">克隆</Button>
            <Divider type={'vertical'}/>
            <Button type="primary" danger size="small" href="#">删除</Button>
          </span>
        )
      }
    },
  ];

  return (
    <span>
      <Row gutter={[4, 4]}>
        <Col span={24}>
          <Input
            placeholder="Input endpoint to search"
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            style={{width: "55%"}}
          />
          <Checkbox onChange={e => setMine(e.target.checked)} style={{ float: 'right' }} checked={mine}>只显示我的</Checkbox>
        </Col>
      </Row>
      <Row gutter={[4, 4]}>
        <Col span={24}>
          <Table
            loading={loading}
            rowKey={record => record.id}
            size="small"
            pagination={{
              showSizeChanger: true,
              size: 'middle',
              defaultPageSize: 10,
              pageSizeOptions: ['10', '30', '50'],
            }}
            dataSource={FilterSearchNodatas}
            columns={columns}
          />
        </Col>
      </Row>
    </span>
  )
};
export default NodataList;
