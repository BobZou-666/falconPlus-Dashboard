import React, {useRef, useState} from "react";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Button, Popover, Divider, message, Table, Typography, Row, Col, Input, Card, Popconfirm} from "antd";
import { queryUsers } from '@/pages/user/service';
import UserList from '@/pages/user/components/UserList'

const queryUserList = async () =>{
  try {
    return await queryUsers();
  } catch (error) {
    message.error(`加载失败：${error.toString()}`);
    return [];
  }
}

class User extends React.Component {
  state={
    users: undefined,
  }

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers = () => {
    queryUserList().then(r=>{
      this.setState({users: r})
    })
  }

  render() {
    const {users} = this.state;

    return (
      <PageHeaderWrapper>
        <Card>
          <UserList
            users={users}
            refresh={this.loadUsers}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default User
