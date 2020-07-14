import React, { useState } from 'react';
import { Form, Input, Modal } from 'antd';

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const modalBodyStyle = { padding: '32px 40px 48px' };

const CreateUserForm = props =>{
  const {
    onSubmit: handleCreate,
    onClose: handleClose,
    visible,
  } = props;

  const [form] = Form.useForm();

  const handleOk = async () => {
    const fieldsValue = await form.validateFields();
    handleCreate(fieldsValue);
    form.resetFields()
  }

  return (
    <Modal
      width={560}
      bodyStyle={modalBodyStyle}
      destroyOnClose
      title="新建user"
      visible={visible}
      okText="新建"
      onOk={() => handleOk()}
      onCancel={()=>handleClose()}
      afterClose={()=>handleClose()}
    >
      <Form
        {...formLayout}
        form={form}
      >
        <Form.Item label="用户名" name="name" rules={[{ required: true}]}>
          <Input placeholder="输入用户名"/>
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="输入密码"/>
        </Form.Item>
        <Form.Item label="中文名" name="cnname" rules={[{ required: true}]}>
          <Input placeholder="输入中文名"/>
        </Form.Item>
        <Form.Item label="邮箱" name="email" rules={[{ required: true }]}>
          <Input placeholder="输入邮箱"/>
        </Form.Item>
        <Form.Item label="手机" name="phone">
          <Input placeholder="输入手机号"/>
        </Form.Item>
        <Form.Item label="社交账号" name="im">
          <Input placeholder="输入社交账号"/>
        </Form.Item>
        <Form.Item label="QQ" name="qq">
          <Input placeholder="输入QQ号"/>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateUserForm;
