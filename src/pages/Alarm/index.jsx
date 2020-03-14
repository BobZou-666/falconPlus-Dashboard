import React from "react";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import { connect } from 'dva';
import {Collapse} from "antd";
import AlarmTabs from '@/pages/Alarm/components/AlarmList';

const { Panel } = Collapse;

class Alarm extends React.Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    this.loadEventCases()
  }

  loadEventCases = () =>{
    this.setState({loading:true});
    const { dispatch } = this.props;
    dispatch({
      type: 'alarm/queryEventCases',
    }).then(()=>{
      this.setState({loading:false});
    });
  };

  render() {
    const {EventCases} = this.props;
    const {loading, refreshInterval} = this.state;

    let recoveredEventCases = [];
    let notRecoveredEventCases = [];

    EventCases.forEach(v=>{
      if (v.status === 'PROBLEM'){
        notRecoveredEventCases.push(v)
      } else {
        recoveredEventCases.push(v)
      }
    });

    return (
      <PageHeaderWrapper>
        <Collapse defaultActiveKey={['1']} border={false} accordion={false} destroyInactivePanel>
          <Panel
            header={<font color="red"><strong>未恢复告警({notRecoveredEventCases.length})</strong></font>}
            key="1"
          >
            <AlarmTabs
              alarms={notRecoveredEventCases}
              loading={loading}
              refresh={this.loadEventCases}
            />
          </Panel>
          <Panel header={<font color="green"><strong>已恢复告警({recoveredEventCases.length})</strong></font>} key="2">
            <AlarmTabs
              alarms={recoveredEventCases}
              loading={loading}
              refresh={this.loadEventCases}
            />
          </Panel>
        </Collapse>
      </PageHeaderWrapper>
    )
  }
}

export default connect(({ alarm, loading }) => ({
  EventCases: alarm.EventCases,
  loading: loading.models.alarm,
}))(Alarm);
