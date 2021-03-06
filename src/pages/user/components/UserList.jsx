import React, { useState } from 'react';
import { Button, Form, Divider, message, Table, Typography, Row, Col, Input, Tag, Switch, Popconfirm } from 'antd';
import { PlusOutlined, QuestionCircleTwoTone, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { changeUserRole, deleteUser, updateUserInfo, createUser, changeUserPassword } from '@/pages/user/service';
import UpdateUserForm from '@/pages/user/components/UpdateForm'
import ChangePasswordForm from '@/pages/user/components/ChangePasswordForm'
import CreateUserForm from '@/pages/user/components/CreateForm'

const { Text } = Typography;

const handleDeleteUser = async (username, payload) => {
  let hide = message.loading(`正在删除: ${username}`);
  try {
    await deleteUser(payload);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error(`删除失败，请重试：${error.toString()}`);
    return false;
  }
}

const handleUpdateUserInfo = async (user, payload) => {
  let hide = message.loading(`正在更新: ${user.cnname}`);
  try {
    await updateUserInfo(user.id, payload);
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error(`更新失败，请重试：${error.toString()}`);
    return false;
  }
}

const handleChangeUserPassword = async (username, payload) => {
  let hide = message.loading(`正在更新: ${username}`);
  try {
    await changeUserPassword(payload);
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error(`更新失败，请重试：${error.toString()}`);
    return false;
  }
}

const handleCreateUser = async payload => {
  let hide = message.loading(`正在创建: ${payload.cnname}`);
  try {
    await createUser(payload);
    hide();
    message.success('创建成功');
    return true;
  } catch (error) {
    hide();
    message.error(`创建失败，请重试：${error.toString()}`);
    return false;
  }
}

const handleChangeUserRole = async payload => {
  let hide;
  if (payload.admin === "yes"){
    hide = message.loading(`正在设置管理员`);
  }else {
    hide = message.loading(`正在取消管理员`);
  }

  try {
    await changeUserRole(payload);
    hide();
    if (payload.admin === "yes"){
      message.success('管理设置成功');
    }else {
      message.success('取消管理员成功');
    }
    return true;
  } catch (error) {
    hide();
    message.error(`失败，请重试：${error.toString()}`);
    return false;
  }
}

const UserList = props => {
  const {users, refresh} = props;
  const [searchText, setSearchText] = useState(undefined);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [editUser, setEditUser] = useState(undefined);

  let FilterSearchUsers = [];
  if (searchText && searchText !== ''){
    let searchTexts = searchText.toLowerCase().split(' ');
    users.forEach(v => {
      let find = true;
      searchTexts.every(text=>{
        if (v.name.toLowerCase().indexOf(text) === -1 &&
          v.cnname.toLowerCase().indexOf(text) === -1 &&
          v.phone.toLowerCase().indexOf(text) === -1 &&
          v.im.toLowerCase().indexOf(text) === -1 &&
          v.qq.toLowerCase().indexOf(text) === -1 &&
          v.email.toLowerCase().indexOf(text) === -1){
          find = false;
          return false
        }
        return true
      });

      if (find){
        FilterSearchUsers.push(v)
      }
    });
  } else {
    FilterSearchUsers = users;
  }

  const columns = [
    {
      title: "姓名",
      dataIndex: 'name',
      render: (text, record) => <span><Text strong>{record.cnname}</Text> (<Text type="secondary">{text}</Text>)</span>,
    },
    {
      title: "邮箱",
      dataIndex: 'email',
      render: text => {if(text === ''){return <Tag>未设置</Tag>} else {return <Text>{text}</Text>}}
    },
    {
      title: "手机",
      dataIndex: 'phone',
      render: text => {if(text === ''){return <Tag>未设置</Tag>} else {return <Text>{text}</Text>}}
    },
    {
      title: "社交账号",
      dataIndex: 'im',
      render: text => {if(text === ''){return <Tag>未设置</Tag>} else {return <Text>{text}</Text>}}
    },
    {
      title: "QQ",
      dataIndex: 'qq',
      render: text => {if(text === ''){return <Tag>未设置</Tag>} else {return <Text>{text}</Text>}}
    },
    {
      title: "管理员",
      dataIndex: 'role',
      render: (text, record) => {
        let checked = false;
        let disabled = false;
        if (text === 2){
          disabled = true
          checked = true
        } else if(text === 1){
          checked = true
        }
        return (
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            defaultChecked={checked}
            disabled={disabled}
            onChange={async checked=>{
              let payload;
              if(checked){
                payload = {
                  user_id: record.id,
                  admin:'yes'
                };
              }else {
                payload = {
                  user_id: record.id,
                  admin:'no'
                };
              }
              let success = await handleChangeUserRole(payload);
              if (!success){
                refresh();
              }
            }}
          />
        )
      }
    },
    {
      title: "action",
      dataIndex: 'id',
      width: 220,
      render: (text, record) => {
        return (
          <span>
            <Button type="primary" size="small" onClick={()=>{
              setEditUser(record);
              setUpdateVisible(true);
            }}>修改</Button>
            <Divider type={'vertical'}/>
            <Button type="primary" size="small" onClick={()=>{
              setEditUser(record);
              setChangePasswordVisible(true);
            }}>修改密码</Button>
            <Divider type={'vertical'}/>
            <Popconfirm
              icon={<QuestionCircleTwoTone twoToneColor="red"/>}
              title={<span>确定删除 <Text strong type="danger">{record.cnname}</Text> 吗?</span>}
              onConfirm={async ()=>{
                let success = await handleDeleteUser(record.cnname, {user_id: record.id})
                if (success){
                  refresh()
                }
              }}
              okText="删除"
              okButtonProps={{danger: true}}
              cancelText="取消"
            >
              <Button type="primary" danger size="small">删除</Button>
            </Popconfirm>
          </span>
        )
      }
    },
  ]

  return (
    <span>
      <Row gutter={[4, 4]}>
        <Col span={24}>
          <Button
            type="primary"
            onClick={()=>{setCreateVisible(true)}}
            icon={<PlusOutlined />}
            style={{marginRight: '4px', marginBottom: '4px' }}
          >
            新建
          </Button>
          <Input
            placeholder="Input endpoint to search"
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            style={{width: "55%", marginBottom: '4px'}}
          />
          <Button
            type="default"
            onClick={refresh}
            icon={<ReloadOutlined />}
            style={{float: 'right'}}
          >
            刷新
          </Button>
        </Col>
      </Row>
      <Row gutter={[4, 4]}>
        <Col span={24}>
          <Table
            rowKey={record=>record.id}
            size="middle"
            columns={columns}
            dataSource={FilterSearchUsers}
          />
        </Col>
      </Row>
      <CreateUserForm
        onSubmit={async fields=>{
          let success = await handleCreateUser(fields);
          if (success){
            refresh();
            setCreateVisible(false);
          }}}
        onClose={()=>{
          setCreateVisible(false);
        }}
        visible={createVisible}
      />
      {editUser?(
        <ChangePasswordForm
          onSubmit={async fields=>{
            let success = await handleChangeUserPassword(editUser.cnname, fields);
            if (success){
              setChangePasswordVisible(false);
              setEditUser(undefined);
              refresh();
            }}}
          onClose={()=>{
            setChangePasswordVisible(false);
            setEditUser(undefined);
          }}
          userID={editUser.id}
          visible={changePasswordVisible}
        />
      ):null}
      {editUser?(
        <UpdateUserForm
          onSubmit={async fields=>{
            let success = await handleUpdateUserInfo(editUser, fields);
            if (success){
              setUpdateVisible(false);
              setEditUser(undefined);
              refresh();
            }}}
          onClose={()=>{
            setUpdateVisible(false);
            setEditUser(undefined);
          }}
          values={editUser}
          visible={updateVisible}
        />
      ):null}
    </span>
  )
}
export default UserList;
