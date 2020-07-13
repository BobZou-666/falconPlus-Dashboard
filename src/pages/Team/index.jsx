import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper, PageLoading } from '@ant-design/pro-layout';
import {
  DeleteTwoTone,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  QuestionCircleTwoTone,
} from '@ant-design/icons';
import { Button, Card, Col, Input, message, Popconfirm, Row, Typography, Drawer, List, Divider } from 'antd';
import { deleteTeam, queryTeam } from './service';
import { queryUsers } from '@/pages/user/service'

const { Text } = Typography;

const queryTeamList = async () =>{
  try {
    return await queryTeam();
  } catch (error) {
    message.error(`加载失败：${error.toString()}`);
    return [];
  }
}

const queryUserList = async () =>{
  try {
    return await queryUsers();
  } catch (error) {
    message.error(`加载失败：${error.toString()}`);
    return [];
  }
}

const handleDeleteTeam = async team => {
  const hide = message.loading(`正在删除 ${team.name}`);
  try {
    await deleteTeam(team.id);
    hide();
    message.success('更新成功');
    return true
  } catch (error) {
    hide();
    message.error(`更新失败, 请重试：${error.toString()}`);
    return false
  }
}

const searchInputStyle = {
  width: "55%",
  marginBottom: 4
}

class Team extends React.Component{
  state={
    selectedTeam: undefined,
    teams: undefined,
    allUsers: [],
    searchText: undefined,
    drawerVisible: false,
    childrenDrawerVisible: false,
  }

  componentDidMount() {
    queryTeamList().then(r=>{
      this.setState({teams: r})
    })
  }

  showDrawer = team => {
    this.setState({
      selectedTeam: team,
    }, ()=>{
      this.setState({
        drawerVisible: true,
      });
    });
  };

  onDrawerClose = () => {
    this.setState({
      drawerVisible: false,
    }, ()=>{
      this.setState({
        selectedTeam: undefined,
      });
    });
  };

  showChildrenDrawer = () => {
    queryUserList().then(r=>{
      this.setState({allUsers:r}, ()=>{
        this.setState({
          childrenDrawerVisible: true,
        });
      })
    })
  };

  onChildrenDrawerClose = () => {
    this.setState({
      childrenDrawerVisible: false,
    }, ()=>{
      this.setState({allUsers:[]})
    });
  };

  setSearchText = e => {
    this.setState({searchText: e.target.value}, ()=>{
      queryTeamList().then(r=>{
        this.setState({teams: r})
      })
    })
  }

  render() {
    const {searchText, teams, drawerVisible, childrenDrawerVisible, selectedTeam, allUsers} = this.state;
    if (!teams){
      return <PageLoading/>
    }

    let filterTeams = [];
    if (!searchText || searchText.trim() === ''){
      filterTeams = teams;
    } else {
      teams.forEach(v=>{
        if (v.team.name.indexOf(searchText) !== -1 || v.team.resume.indexOf(searchText) !== -1){
          filterTeams.push(v)
        }
      })
    }

    let notAddUsers = [];
    let isAdded = false;
    allUsers.forEach(v=>{
      isAdded = false;
      selectedTeam.users.every(v2=>{
        if (v2.id === v.id){
          isAdded = true
          return false
        }
        return true
      })
      if (!isAdded){
        notAddUsers.push(v);
      }
    })

    return(
      <PageHeaderWrapper>
        <Card>
          <Row>
            <Button
              type="primary"
              onClick={()=>{}}
              icon={<PlusOutlined />}
              style={{marginRight: '4px'}}
            >
              新建
            </Button>
            <Input
              placeholder="input to search"
              prefix={<SearchOutlined />}
              onChange={e => this.setSearchText(e)}
              style={searchInputStyle}
            />
          </Row>
          <Row gutter={[4,4]}>
            {
              filterTeams.map((v, i)=>{
                // console.log(v, i)
                return (
                  <Col span={6} key={i}>
                    <Card
                      size={'small'}
                      onClick={()=>{this.showDrawer(v)}}
                      hoverable
                    >
                      <Card.Meta
                        title={
                          <span>
                            {v.team.name}(<Text type="warning">{v.users.length}</Text>)
                            <span style={{float: 'right'}}>
                              <Popconfirm
                                icon={<QuestionCircleTwoTone twoToneColor="red"/>}
                                title={<span>确定删除 <Text strong type="danger">{v.team.name}</Text> 吗?</span>}
                                onConfirm={e=>{
                                  e.stopPropagation();
                                  handleDeleteTeam(v.team).then(r => {
                                    if (r){
                                      queryTeamList().then(r=>{
                                        this.setState({teams: r})
                                      })
                                    }
                                  });
                                }}
                                onCancel={e=>{e.stopPropagation();this.onDrawerClose()}}
                                okText="删除"
                                okButtonProps={{danger: true}}
                                cancelText="取消"
                              >
                              <Button
                                size="small"
                                shape="circle"
                                type="primary"
                                danger
                                icon={ <DeleteOutlined/>}
                                onClick={e=>e.stopPropagation()}
                              />
                            </Popconfirm>
                            <Divider type="vertical"/>
                            <Button
                              size="small"
                              shape="circle"
                              type="primary"
                              icon={ <EditOutlined/>}
                              onClick={e=>e.stopPropagation()}
                            />
                            </span>
                          </span>
                        }
                        description={<Text ellipsis>{v.team.resume}</Text>}
                      />
                    </Card>
                  </Col>
                )
              })
            }
          </Row>
          {selectedTeam ?
            (
              <Drawer
                title={
                  <span>
                    {selectedTeam.team.name}: <Text type="warning">{selectedTeam.users.length} 个用户</Text>
                    <Button style={{float: 'right'}} type="primary" size="small" onClick={this.showChildrenDrawer}>添加用户</Button>
                  </span>
                }
                width={480}
                closable={false}
                onClose={this.onDrawerClose}
                visible={drawerVisible}
              >
                <List
                  size="small"
                  pagination={{
                    size: 'small',
                    defaultPageSize: 10
                  }}
                  itemLayout="horizontal"
                  dataSource={selectedTeam.users}
                  renderItem={item => (
                    <List.Item actions={[
                      <Button type="primary" size="small" danger>
                        移除
                      </Button>
                    ]}>
                      <List.Item.Meta
                        title={<span><Text strong><font color="green">{item.cnname}</font></Text> (<Text type={'secondary'}>{item.name}</Text>)</span>}
                      />
                    </List.Item>
                  )}
                />
                {allUsers?(
                  <Drawer
                    title="用户列表"
                    width={380}
                    closable={false}
                    onClose={this.onChildrenDrawerClose}
                    visible={childrenDrawerVisible}
                  >
                    <List
                      size="small"
                      pagination={{
                        size: 'small',
                        defaultPageSize: 10
                      }}
                      itemLayout="horizontal"
                      dataSource={notAddUsers}
                      renderItem={item => (
                        <List.Item actions={[
                          <Button type="primary" size="small">
                            添加
                          </Button>
                        ]}>
                          <List.Item.Meta
                            title={<span><Text strong><font color="green">{item.cnname}</font></Text> (<Text type={'secondary'}>{item.name}</Text>)</span>}
                          />
                        </List.Item>
                      )}
                    />
                  </Drawer>
                ):null}
              </Drawer>
            ):null
          }
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Team;
