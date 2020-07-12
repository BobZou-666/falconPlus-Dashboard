import React from 'react';
import { connect } from 'dva';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { message } from 'antd';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
    isErr: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      }).then(success =>{
        if (success){
          this.setState({
            isReady: true,
          })
        } else {
          this.setState({
            isErr: true,
            isReady: true,
          })
        }
      })
    }
  }

  render() {
    const { isReady, isErr } = this.state;
    const { children, currentUser } = this.props; // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）

    const queryString = stringify({
      redirect: window.location.href,
    });

    if (isReady && isErr){
      return <Redirect to={`/login?${queryString}`} />;
    }

    if (!isReady || !currentUser.id) {
      return <PageLoading />;
    }

    if (!currentUser.id && window.location.pathname !== '/login') {
      return <Redirect to={`/login?${queryString}`} />;
    }

    return children;
  }
}

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
