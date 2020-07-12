import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React from 'react';
import { Row, Col, Descriptions, Tag, Divider, Card, Timeline, Typography } from 'antd';
import { connect } from 'dva';
import IconFont from '@/components/IconFont';
import moment from 'moment';

const { Text } = Typography;

class AlarmDetail extends React.Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    this.loadEventCaseDetail();
    this.loadEventsDetail();
  }

  loadEventCaseDetail = () =>{
    const { caseId } = this.props.match.params;

    this.setState({loading:true});
    const { dispatch } = this.props;
    dispatch({
      type: 'alarm/queryEventCaseById',
      payload: caseId,
      callback: ()=>{this.setState({loading:false})}
    });
  };

  loadEventsDetail = () =>{
    const { caseId } = this.props.match.params;

    this.setState({loading:true});
    const { dispatch } = this.props;
    dispatch({
      type: 'alarm/queryEventsById',
      payload: caseId,
      callback: ()=>{this.setState({loading:false})}
    });
  };

  renderPriority = text => {
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

  render() {
    const {EventCaseDetail, Events} = this.props;
    Events.sort((a, b) => moment(a.timestamp).isBefore(moment(b.timestamp)) ? -1 : 1);

    return (
      <PageHeaderWrapper
        title="告警详情"
      >
        <Card bordered={false}>
          <Row gutter={8}>
            <Col span={24}>
                <Descriptions column={3} size="small" bordered>
                  <Descriptions.Item label="主机">{EventCaseDetail.endpoint}</Descriptions.Item>
                  <Descriptions.Item label="描述" span={2}>
                    {this.renderPriority(EventCaseDetail.priority)}
                    <Divider type="vertical" />
                    { EventCaseDetail.note }
                    <Divider type="vertical" />
                    当前第 <Text strong style={{color:"#d18b1f"}}>{EventCaseDetail.current_step}</Text> 次 / 最大 <Text strong style={{color:"#d18b1f"}}>{EventCaseDetail.step}</Text> 次
                  </Descriptions.Item>
                  <Descriptions.Item label="模板">
                    {EventCaseDetail.template_id === 0 ? "无" : EventCaseDetail.template_id}
                  </Descriptions.Item>
                  <Descriptions.Item label="策略">
                    {EventCaseDetail.strategy_id === 0 ? "无" : EventCaseDetail.strategy_id}
                  </Descriptions.Item>
                  <Descriptions.Item label="Expression">
                    {EventCaseDetail.expression_id === 0 ? "无" : EventCaseDetail.expression_id}
                  </Descriptions.Item>
                  <Descriptions.Item label="指标">{ EventCaseDetail.metric }</Descriptions.Item>
                  <Descriptions.Item label="表达式" span={2}>{ EventCaseDetail.func }  { EventCaseDetail.cond }</Descriptions.Item>
                  <Descriptions.Item label="状态">
                    {
                      EventCaseDetail.status === 'PROBLEM' ?
                        <Tag color="#FF0000">{EventCaseDetail.status}</Tag> :
                        <Tag color="#87d068">{EventCaseDetail.status}</Tag>
                    }
                  </Descriptions.Item>
                  <Descriptions.Item label="触发时间">{moment(EventCaseDetail.update_at).format("YYYY-MM-DD HH:mm:ss")}</Descriptions.Item>
                  <Descriptions.Item label="更新时间">{moment(EventCaseDetail.timestamp).format("YYYY-MM-DD HH:mm:ss")}</Descriptions.Item>
                </Descriptions>

            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={24}>
            <Card
              size={'small'}
              bordered={false}
            >
              <Timeline
                reverse={true}
                pending={<span> </span>}
              >
                {
                  Events.map(value => {
                    if (value.status === 0) {
                      return <Timeline.Item
                        key={value.id}
                        color="red"
                      >
                        <font style={{ fontWeight: 'bold' }} color="red">[{value.timestamp}] 告警触发（当前第{value.step}次）, 触发值: {value.cond}</font>
                      </Timeline.Item>
                    }

                    return <Timeline.Item
                      key={value.id}
                      color="green"
                    >
                      <font style={{ fontWeight: 'bold' }} color="green">[{value.timestamp}] 告警恢复, 恢复值: {value.cond}</font>
                    </Timeline.Item>
                  })
                }
                </Timeline>
              </Card>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default connect(({ alarm, loading }) => ({
  EventCaseDetail: alarm.EventCaseDetail,
  Events: alarm.Events,
  loading: loading.models.alarm,
}))(AlarmDetail);
