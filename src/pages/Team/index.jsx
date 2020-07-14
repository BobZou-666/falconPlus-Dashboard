import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper, PageLoading } from '@ant-design/pro-layout';
import {
  ReloadOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Input, message, Popconfirm, Row, Typography, Drawer, List, Divider } from 'antd';
import { queryTeam, updateTeam, createTeam } from './service';
import { queryUsers } from '@/pages/user/service'
import TeamCard from '@/pages/Team/components/TeamCard';
import TeamUserList from '@/pages/Team/components/TeamUserList';
import NotAddedUserList  from '@/pages/Team/components/UserList';
import UpdateTeamForm from '@/pages/Team/components/UpdateForm';
import CreateTeamForm from '@/pages/Team/components/CreateForm';


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

const handleEditTeam = async payload => {
  const hide = message.loading('正在更新');
  try {
    await updateTeam(payload);
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error(`更新失败, 请重试：${error.toString()}`);
    return false;
  }
}

const handleCreateTeam = async payload => {
  const hide = message.loading('正在创建');
  try {
    await createTeam(payload);
    hide();
    message.success('创建成功');
    return true;
  } catch (error) {
    hide();
    message.error(`创建失败, 请重试：${error.toString()}`);
    return false;
  }
}

const searchInputStyle = {
  width: "55%",
  marginBottom: 4
}

class Team extends React.Component{
  state={
    selectedTeam: undefined,
    editedTeam: undefined,
    teams: undefined,
    allUsers: [],
    searchText: undefined,
    drawerVisible: false,
    childrenDrawerVisible: false,
    updateFormVisible: false,
    createFormVisible: false,
  }

  componentDidMount() {
    this.loadTeams();
  }

  loadTeams = () => {
    queryTeamList().then(r=>{
      this.setState({teams: r})
    })
  }

  showCreateForm = () => {
    this.setState({createFormVisible: true})
  }

  onCreateFormClose = () => {
    this.setState({createFormVisible: false})
  }

  showUpdateForm = team =>{
    this.setState({
      editedTeam: team,
    }, ()=>{
      this.setState({
        updateFormVisible: true,
      });
    });
  }

  onUpdateFormClose = () =>{
    this.setState({
      updateFormVisible: false,
    }, ()=>{
      this.setState({
        editedTeam: undefined,
      });
    });
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
    this.setState({searchText: e.target.value});
  }

  render() {
    const {
      searchText,
      teams,
      drawerVisible,
      childrenDrawerVisible,
      selectedTeam,
      editedTeam,
      updateFormVisible,
      createFormVisible,
      allUsers
    } = this.state;
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
            <Col span={24}>
              <Button
                type="primary"
                onClick={()=>{this.showCreateForm()}}
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
              <Button
                type="default"
                onClick={this.loadTeams}
                icon={<ReloadOutlined />}
                style={{float: 'right'}}
              >
                刷新
              </Button>
            </Col>
          </Row>
          <Row gutter={[4,4]}>
            {
              filterTeams.map((v, i)=>{
                return (
                  <Col span={6} key={i}>
                    <TeamCard
                      showEditedForm={this.showUpdateForm}
                      showDrawer={this.showDrawer}
                      onDrawerClose={this.onDrawerClose}
                      refresh={this.loadTeams}
                      team={v}
                    />
                  </Col>
                )
              })
            }
          </Row>
          <CreateTeamForm
            onSubmit={async value => {
              const success = await handleCreateTeam(value);
              if (success) {
                this.onCreateFormClose();
                this.loadTeams();
              }
            }}
            onClose={this.onCreateFormClose}
            visible={createFormVisible}
          />s
          {editedTeam ? (
            <UpdateTeamForm
              values={editedTeam}
              onSubmit={async value => {
                const success = await handleEditTeam(value);
                if (success) {
                  this.onUpdateFormClose();
                  this.loadTeams();
                }
              }}
              visible={updateFormVisible}
              onClose={this.onUpdateFormClose}
            />
          ):null}
          {selectedTeam ?
            (
              <Drawer
                title={
                  <span>
                    {selectedTeam.team.name} (<Text type="warning">{selectedTeam.users.length} 个用户)</Text>
                    <Button style={{float: 'right'}} type="primary" size="small" onClick={this.showChildrenDrawer}>添加用户</Button>
                  </span>
                }
                width={480}
                closable={false}
                onClose={this.onDrawerClose}
                visible={drawerVisible}
              >
                <TeamUserList
                  team={selectedTeam}
                  onSubmit={async value => {
                    const success = await handleEditTeam(value);
                    if (success) {
                      queryTeamList().then(r=>{
                        this.setState({teams: r});
                        r.every(v=>{
                          if (v.team.id === value.team_id){
                            this.setState({selectedTeam: v});
                            return false;
                          }
                          return true;
                        })
                      })
                    }
                  }}
                />
                {allUsers?(
                  <Drawer
                    title={<span>未添加用户 (<Text type="warning">{notAddUsers.length} 个用户)</Text></span>}
                    width={380}
                    closable={false}
                    onClose={this.onChildrenDrawerClose}
                    visible={childrenDrawerVisible}
                  >
                    <NotAddedUserList
                      team={selectedTeam}
                      notAddedUsers={notAddUsers}
                      onSubmit={async value => {
                        const success = await handleEditTeam(value);
                        if (success) {
                          queryTeamList().then(r=>{
                            this.setState({teams: r});
                            r.every(v=>{
                              if (v.team.id === value.team_id){
                                this.setState({selectedTeam: v});
                                return false;
                              }
                              return true;
                            })
                          })
                        }
                      }}
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
