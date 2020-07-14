import { Button, List, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

const pagination={
  size: 'small',
  defaultPageSize: 10
}

const TeamUserList = props => {
  const { team, onSubmit: handleUpdateTeam } = props;

  let teamUsers = [];
  team.users.forEach(v=>{
    teamUsers.push(v.id)
  })

  return (
    <List
      size="small"
      pagination={pagination}
      itemLayout="horizontal"
      dataSource={team.users}
      renderItem={item => (
        <List.Item actions={[
          <Button
            type="primary"
            size="small"
            danger
            onClick={() => {
              let currentUsers = [];
              teamUsers.forEach(v=>{
                if (item.id !== v){
                  currentUsers.push(v)
                }
              });
              handleUpdateTeam({
                team_id: team.team.id,
                name: team.team.name,
                resume: team.team.resume,
                users: currentUsers,
              })
            }}
          >
            移除
          </Button>
        ]}>
          <List.Item.Meta
            title={<span><Text strong><font color="green">{item.cnname}</font></Text> (<Text type={'secondary'}>{item.name}</Text>)</span>}
          />
        </List.Item>
      )}
    />
  )
}

export default TeamUserList;
