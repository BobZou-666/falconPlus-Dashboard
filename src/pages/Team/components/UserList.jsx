import { Button, Input, List, Typography } from 'antd';
import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';

const { Text } = Typography;

const pagination={
  size: 'small',
  defaultPageSize: 10
}

const searchInputStyle = {
  marginBottom: 4
}

const NotAddedUserList = props => {
  const [searchText, setSearchText] = useState(undefined)
  const { team, notAddedUsers, onSubmit: handleUpdateTeam } = props;

  let teamUsers = [];
  team.users.forEach(v=>{
    teamUsers.push(v.id)
  })

  let filterUsers = [];
  if (!searchText){
    filterUsers = notAddedUsers;
  }else {
    notAddedUsers.forEach(v=>{
      if (v.name.indexOf(searchText) !== -1
        || v.cnname.indexOf(searchText) !== -1
        || v.email.indexOf(searchText) !== -1
        || v.im.indexOf(searchText) !== -1
        || v.qq.indexOf(searchText) !== -1
        || v.phone.indexOf(searchText) !== -1){
        filterUsers.push(v)
      }
    })
  }

  return (
    <span>
      <Input
        placeholder="input to search"
        prefix={<SearchOutlined />}
        onChange={e => setSearchText(e.target.value)}
        style={searchInputStyle}
      />
      <List
        size="small"
        pagination={pagination}
        itemLayout="horizontal"
        dataSource={filterUsers}
        renderItem={item => (
          <List.Item actions={[
            <Button
              type="primary"
              size="small"
              onClick={() => {
                teamUsers.push(item.id)
                handleUpdateTeam({
                  team_id: team.team.id,
                  name: team.team.name,
                  resume: team.team.resume,
                  users: teamUsers,
                })
              }}
            >
              添加
            </Button>
          ]}>
            <List.Item.Meta
              title={<span><Text strong><font color="green">{item.cnname}</font></Text> (<Text type={'secondary'}>{item.name}</Text>)</span>}
            />
          </List.Item>
        )}
      />
    </span>
  )
}

export default NotAddedUserList;
