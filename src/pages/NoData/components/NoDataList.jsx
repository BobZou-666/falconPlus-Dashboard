import React, { useRef, useState } from 'react';
import { Button, Col, Input, message, Row, Table, Typography, Checkbox, Tag, Divider } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { deleteNodata, createNodata, updateNodata } from '@/pages/NoData/service';
import UpdateForm from '@/pages/NoData/components/UpdateForm';
import CreateForm from '@/pages/NoData/components/CreateForm';

const { Text } = Typography;

const handleUpdate = async (fields) => {
  const hide = message.loading('正在更新');
  try {
    await updateNodata(fields);
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error(`更新失败, 请重试：${error.toString()}`);
    return false;
  }
};

const handleCreate = async payload =>{
  const hide = message.loading(`正在创建 ${payload.name}`);
  try {
    await createNodata(payload);
    hide();
    message.success('创建成功');
    return true;
  } catch (error) {
    hide();
    message.error(`创建失败，请重试：${error.toString()}`);
    return false;
  }
}

const NodataList = ({nodatas, loading, refresh}) => {
  const [mine, setMine] = useState(true);
  const [searchText, setSearchText] = useState(undefined);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [cloneModalVisible, handleCloneModalVisible] = useState(false);
  const [createModalVisible, handleCreateModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [cloneFormValues, setCloneFormValues] = useState({});

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

  const handleDeleteNodata = async record => {
    const hide = message.loading(`正在删除 ${record.name}`);
    try {
      await deleteNodata(record.id);
      hide();
      message.success('删除成功');
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  }

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
            <Button type="primary" size="small" onClick={()=>{
              setFormValues(record);
              handleUpdateModalVisible(true)
            }}>修改</Button>
            <Divider type={'vertical'}/>
            <Button type="primary" size="small" onClick={()=>{
              setCloneFormValues(record);
              handleCloneModalVisible(true)
            }}>克隆</Button>
            <Divider type={'vertical'}/>
            <Button type="primary" danger size="small" onClick={
              async ()=>{
                await handleDeleteNodata(record);
                refresh();
              }}>
              删除
            </Button>
          </span>
        )
      }
    },
  ];

  return (
    <span>
      <Row gutter={[4, 4]}>
        <Col span={24}>
          <Button
            type="primary"
            onClick={()=>{
              handleCreateModalVisible(true)
            }}
            icon={<PlusOutlined />}
            style={{marginRight: '4px'}}
          >
            新建
          </Button>
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
      {createModalVisible ? (
        <CreateForm
          onSubmit={async value => {
            const success = await handleCreate(value);

            if (success) {
              handleCreateModalVisible(false);
              refresh();
            }
          }}

          onCancel={() => {
            handleCreateModalVisible(false);
          }}
          modalVisible={createModalVisible}
          values={{}}
        />
      ): null }

      {cloneFormValues && Object.keys(cloneFormValues).length ? (
        <CreateForm
          onSubmit={async value => {
            const success = await handleCreate(value);

            if (success) {
              handleCloneModalVisible(false);
              setCloneFormValues({})
              refresh();
            }
          }}

          onCancel={() => {
            handleCloneModalVisible(false);
            setCloneFormValues({})
          }}
          modalVisible={cloneModalVisible}
          values={cloneFormValues}
        />
      ) : null}
      {formValues && Object.keys(formValues).length ? (
        <UpdateForm
          onSubmit={async value => {
            const success = await handleUpdate(value);

            if (success) {
              handleUpdateModalVisible(false);
              setFormValues({});
              refresh();
            }
          }}

          onCancel={() => {
            handleUpdateModalVisible(false);
            setFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={formValues}
        />
      ) : null}
    </span>
  )
};
export default NodataList;
