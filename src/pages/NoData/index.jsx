import React, {useRef, useState} from "react";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import { connect } from 'dva';
import {Card} from "antd";
import NodataList from '@/pages/NoData/components/NoDataList';
import { getCurrentUser } from '@/utils/authority';

class Nodata extends React.Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    this.loadNodatas()
  }

  loadNodatas = () => {
    this.setState({loading:true});
    const { dispatch } = this.props;
    dispatch({
      type: 'nodata/queryNodatas',
      callback: ()=>{this.setState({loading:false})}
    });
  };

  render() {
    const { loading } = this.state;
    const { Nodatas } = this.props;
    const currentUser = getCurrentUser();

    return (
      <PageHeaderWrapper>
        <Card>
          <NodataList
            nodatas={Nodatas}
            loading={loading}
            refresh={this.loadNodatas}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default connect(({ nodata, loading }) => ({
  Nodatas: nodata.Nodatas,
  loading: loading.models.nodata,
}))(Nodata);
