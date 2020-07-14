import { Button, Card, Divider, message, Popconfirm, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, QuestionCircleTwoTone } from '@ant-design/icons';
import React, { useState }  from 'react';
import { deleteTeam } from '@/pages/Team/service';
import UpdateTeamForm from '@/pages/Team/components/UpdateForm'

const {Text} = Typography;

const handleDeleteTeam = async team => {
  const hide = message.loading(`正在删除 ${team.name}`);
  try {
    await deleteTeam(team.id);
    hide();
    message.success('更新删除');
    return true
  } catch (error) {
    hide();
    message.error(`删除失败, 请重试：${error.toString()}`);
    return false
  }
}

const TeamCard = props =>{
  const {
    showEditedForm,
    showDrawer,
    onDrawerClose,
    refresh,
    team
  } = props;

  return (
    <Card
      size={'small'}
      onClick={()=>{showDrawer(team)}}
      hoverable
    >
      <Card.Meta
        title={
          <span>
            {team.team.name}(<Text type="warning">{team.users.length}</Text>)
            <span style={{float: 'right'}}>
              <Button
                size="small"
                shape="circle"
                type="primary"
                icon={<EditOutlined/>}
                onClick={e => {
                  e.stopPropagation();
                  showEditedForm(team);
                }}
              />
              <Divider type="vertical"/>
              <Popconfirm
                icon={<QuestionCircleTwoTone twoToneColor="red"/>}
                title={<span>确定删除 <Text strong type="danger">{team.team.name}</Text> 吗?</span>}
                onConfirm={e=>{
                  e.stopPropagation();
                  handleDeleteTeam(team.team).then(r => {
                    if (r){
                      refresh();
                    }
                  });
                }}
                onCancel={e=>{e.stopPropagation();onDrawerClose()}}
                okText="删除"
                okButtonProps={{danger: true}}
                cancelText="取消"
              >
                <Button
                  size="small"
                  shape="circle"
                  type="primary"
                  danger
                  icon={<DeleteOutlined/>}
                  onClick={e=>e.stopPropagation()}
                />
              </Popconfirm>
            </span>
          </span>
        }
        description={<Text ellipsis>{team.team.resume}</Text>}
      />
    </Card>
  )
}

export default TeamCard;
