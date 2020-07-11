import {
  Button,
  Tag,
  Col,
  Divider,
  Input,
  Row,
  Table,
  Typography,
  Popconfirm,
  Tabs,
  Badge,
  Select,
  message,
} from 'antd';
import {DeleteOutlined, SearchOutlined} from "@ant-design/icons";
import React, {useState, useEffect} from "react";
import moment from 'moment';
import IconFont from '@/components/IconFont';

const { Text } = Typography;
const { TabPane } = Tabs;

let interval = undefined;

const AlarmTabs = ({alarms, loading, refresh}) =>{
  const [refreshInterval, setRefreshInterval] = useState(30);
  if (!interval){
    interval = setInterval(() => {
      refresh()
    }, refreshInterval * 1000);
  }

  useEffect(() => {
    if (interval) {
      clearInterval(interval)
    }
    interval = setInterval(() => {
      refresh()
    }, refreshInterval * 1000);
  }, [refreshInterval]);

  let cpuAlarms = [];
  let memAlarms = [];
  let diskAlarms = [];
  let netAlarms = [];
  let aliveAlarms = [];
  let otherAlarms = [];

  alarms.forEach(v => {
    if (v.metric.startsWith('cpu.') || v.metric.startsWith('load.')) {
      cpuAlarms.push(v)
    } else if (v.metric.startsWith('mem.')) {
      memAlarms.push(v)
    } else if (v.metric.startsWith('disk.') || v.metric.startsWith('df.')) {
      diskAlarms.push(v)
    } else if (v.metric.startsWith('net.')) {
      netAlarms.push(v)
    } else if (v.metric === 'agent.alive') {
      aliveAlarms.push(v)
    } else {
      otherAlarms.push(v)
    }
  });

  return(
    <Tabs
      defaultActiveKey="1"
      size="small"
      tabBarExtraContent={
        <span>
          <Text strong style={{color:"green"}}>刷新间隔:</Text>
          <Select
            size="small"
            style={{ width: 85, marginRight: 8, marginLeft: 8 }}
            defaultValue={refreshInterval.toString()}
            onChange={setRefreshInterval}
          >
            <Select.Option value="10">10秒</Select.Option>
            <Select.Option value="20">20秒</Select.Option>
            <Select.Option value="30">30秒</Select.Option>
            <Select.Option value="60">1分钟</Select.Option>
            <Select.Option value="120">2分钟</Select.Option>
            <Select.Option value="300">5分钟</Select.Option>
          </Select>
        </span>
      }
    >
      <TabPane
        tab={
          <span>
            <span><IconFont type="icon-All" />全部</span>
            <Badge
              showZero
              count={alarms.length}
              overflowCount={99}
              style={{
                backgroundColor: alarms.length > 99 ? '#FF0000' :
                  alarms.length > 9 ? '#f06038' :
                    alarms.length > 0 ? '#ffc02d' : '#52c41a'
              }}
            >
              {alarms.length > 99 ?
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> : alarms.length > 9 ?
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> :
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;</span> }

            </Badge>
          </span>
        }
        key="1"
      >
        <AlarmList alarms={alarms} loading={loading}/>
      </TabPane>
      <TabPane
        tab={
          <span>
            <span><IconFont type="icon-cpu" />CPU</span>
            <Badge
              showZero
              count={cpuAlarms.length}
              overflowCount={99}
              style={{
                backgroundColor: cpuAlarms.length > 99 ? '#FF0000' :
                  cpuAlarms.length > 9 ? '#f06038' :
                    cpuAlarms.length > 0 ? '#ffc02d' : '#52c41a'
              }}
            >
              {cpuAlarms.length > 99 ?
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> : cpuAlarms.length > 9 ?
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> :
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> }
            </Badge>
          </span>
        }
        key="2"
      >
        <AlarmList alarms={cpuAlarms} loading={loading}/>
      </TabPane>
      <TabPane
        tab={
          <span>
            <span><IconFont type="icon-memory1" />内存</span>
            <Badge
              showZero
              count={memAlarms.length}
              overflowCount={99}
              style={{
                backgroundColor: memAlarms.length > 99 ? '#FF0000' :
                  memAlarms.length > 9 ? '#f06038' :
                    memAlarms.length > 0 ? '#ffc02d' : '#52c41a'
              }}
            >
                  {memAlarms.length > 99 ?
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> : memAlarms.length > 9 ?
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> :
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> }
            </Badge>
                </span>
              }
              key="3"
      >
        <AlarmList alarms={memAlarms} loading={loading}/>
      </TabPane>
      <TabPane
        tab={
          <span>
            <span><IconFont type="icon-disk" />磁盘</span>
            <Badge
              showZero
              count={diskAlarms.length}
              overflowCount={99}
              style={{
                backgroundColor: diskAlarms.length > 99 ? '#FF0000' :
                  diskAlarms.length > 9 ? '#f06038' :
                    diskAlarms.length > 0 ? '#ffc02d' : '#52c41a'
              }}
            >
              {diskAlarms.length > 99 ?
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> : diskAlarms.length > 9 ?
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> :
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> }
            </Badge>
          </span>
        }
        key="4"
      >
        <AlarmList alarms={diskAlarms} loading={loading}/>
      </TabPane>
      <TabPane
        tab={
          <span>
            <span><IconFont type="icon-network" />网络</span>
            <Badge
              showZero
              count={netAlarms.length}
              overflowCount={99}
              style={{
                backgroundColor: netAlarms.length > 99 ? '#FF0000' :
                  netAlarms.length > 9 ? '#f06038' :
                    netAlarms.length > 0 ? '#ffc02d' : '#52c41a'
              }}
            >
              {netAlarms.length > 99 ?
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> : netAlarms.length > 9 ?
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> :
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> }
            </Badge>
          </span>
        }
        key="5"
      >
        <AlarmList alarms={netAlarms} loading={loading}/>
      </TabPane>
      <TabPane
        tab={
          <span>
            <span><IconFont type="icon-offline" />存活</span>
            <Badge
              showZero
              count={aliveAlarms.length}
              overflowCount={99}
              style={{
                backgroundColor: aliveAlarms.length > 99 ? '#FF0000' :
                  aliveAlarms.length > 9 ? '#f06038' :
                    aliveAlarms.length > 0 ? '#ffc02d' : '#52c41a'
              }}
            >
              {aliveAlarms.length > 99 ?
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> : aliveAlarms.length > 9 ?
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> :
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> }
            </Badge>
          </span>
        }
        key="6"
      >
        <AlarmList alarms={aliveAlarms} loading={loading}/>
      </TabPane>
      <TabPane
        tab={
          <span>
            <span><IconFont type="icon-other" />其他</span>
            <Badge
              showZero
              count={otherAlarms.length}
              overflowCount={99}
              style={{
                backgroundColor: otherAlarms.length > 99 ? '#FF0000' :
                  otherAlarms.length > 9 ? '#f06038' :
                    otherAlarms.length > 0 ? '#ffc02d' : '#52c41a'
              }}
            >
              {otherAlarms.length > 99 ?
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> : otherAlarms.length > 9 ?
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> :
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> }
            </Badge>
          </span>
        }
        key="7"
      >
        <AlarmList alarms={otherAlarms} loading={loading}/>
      </TabPane>
    </Tabs>
  )
};

const AlarmList = ({ alarms, loading }) => {
  const [searchText, setSearchText] = useState(undefined);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  let FilterSearchHosts = [];
  if (searchText && searchText !== ''){
    let searchTexts = searchText.toLowerCase().split(' ');

    alarms.forEach(alarm => {
      let find = true;
      searchTexts.every(text=>{
        if (alarm.endpoint.toLowerCase().indexOf(text) === -1 &&
          alarm.metric.toLowerCase().indexOf(text) === -1 &&
          alarm.note.toLowerCase().indexOf(text) === -1){
          find = false;
          return false
        }
        return true
      });

      if (find){
        FilterSearchHosts.push(alarm)
      }
    });
  } else {
    FilterSearchHosts = alarms;
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => setSelectedRowKeys(selectedRowKeys),
  };
  const hasSelected = selectedRowKeys.length > 0;

  const renderPriority = text => {
    let color = 'red';
    if (text === 6) {
      color = '#eac028'
    } else if (text === 5) {
      color = '#ea9b1f'
    } else if (text === 4) {
      color = '#EA841E'
    } else if (text === 3) {
      color = '#EA591E'
    } else if (text === 2) {
      color = '#f36038'
    } else if (text === 1) {
      color = '#F30909'
    } else if (text === 0) {
      color = '#FF0000'
    } else {
      color = '#C5EA1E'
    }
    return (
      <Tag color={color}>
        <font size="+0">P{ text }</font>
      </Tag>
    )
  };

  const columns=[
    {
      title: '主机',
      dataIndex: 'endpoint',
      render: (text, record) => {
        return <span><Text strong>{text}</Text></span>
      }
    },
    {
      title: '指标',
      dataIndex: 'metric',
    },
    {
      title: '描述',
      dataIndex: 'note',
      render: (text, record) => <span>{renderPriority(record.priority)}{text}</span>,
    },
    {
      title: '表达式',
      dataIndex: 'cond',
      render: (text, record) => {
        const index = text.indexOf('=');
        let leftValue = text.slice(0, index-1);
        const op = text.slice(index-1, index+1);
        const rightValue = text.slice(index+1, text.length);
        leftValue = Math.round(leftValue * 100)/100;
        return (
          <span>
            <Text strong>{record.func}</Text>
            <span> </span>
            ({leftValue} <Text strong style={{color:"#ea9b1f"}}>{op}</Text> {rightValue})
          </span>
        )
      }
    },
    {
      title: '告警次数',
      dataIndex: 'current_step',
      render: (text, record) =>
        <span>第<Text strong style={{color:"#d18b1f"}}> {text} </Text>次/最大<Text strong style={{color:"#d18b1f"}}> {record.step} </Text>次</span>,
    },
    {
      title: '触发时间',
      dataIndex: 'update_at',
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'descend',
      sorter: (a, b) => moment(a.update_at).isBefore(moment(b.update_at)) ? -1 : 1,
      render(text) {
        return <span>{moment(text).format("YYYY-MM-DD HH:mm:ss")}</span>
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          <span>
            <Button type="primary" size="small" href={`/alarm/${record.id}`}>详情</Button>
            <Divider type="vertical"/>
            <Popconfirm
              title={<span><Text type="danger">确定删除吗?</Text><br/><Text type="warning">因为后端没有相关接口所以删除不了</Text></span>}
              onConfirm={()=>{}}
              onCancel={() => message.info('您取消了操作')}
              okText="删除"
              cancelText="取消"
            >
              <Button type="primary" danger size="small">删除</Button>
            </Popconfirm>
          </span>
        )
      }
    },
  ];

  return (
    <span>
      <Row gutter={[4, 4]}>
        <Col span={24}>
          <span>
            <Button
              type="danger"
              onClick={()=>{
                setDeleteLoading(true);
                setTimeout(()=>{
                  setSelectedRowKeys([]);
                  setDeleteLoading(false);
                  message.warning("因为后端没有相关接口所以删除不了")
                }, 1000)
              }}
              icon={<DeleteOutlined />}
              disabled={!hasSelected}
              loading={deleteLoading}
              style={{marginRight: '4px'}}
            >
              Batch Delete
            </Button>
            <Input
              placeholder="Input endpoint to search"
              prefix={<SearchOutlined />}
              onChange={e => setSearchText(e.target.value)}
              style={{width: "55%"}}
            />
          </span>
        </Col>
      </Row>
      <Row gutter={[4, 4]}>
        <Col span={24}>
          <Table
            loading={loading}
            rowKey={record => record.id}
            size="small"
            rowSelection={rowSelection}
            pagination={{
              size: 'small',
              hideOnSinglePage: true,
              defaultPageSize: 15,
            }}
            dataSource={FilterSearchHosts}
            columns={columns}
          />
        </Col>
      </Row>
    </span>
  )
};



export default AlarmTabs
