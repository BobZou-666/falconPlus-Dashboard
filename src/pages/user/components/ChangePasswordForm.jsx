import React, { useState } from 'react';
import { Form, Input, Modal } from 'antd';

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const modalBodyStyle = { padding: '32px 40px 48px' };

const hiddenFormItemStyle = { display: 'none' };

const ChangePasswordForm = props =>{
  const {
    onSubmit: handleChangePassword,
    onClose: handleClose,
    visible,
    userID
  } = props;

  const [form] = Form.useForm();

  const initialValues = {
    user_id: userID
  }

  const handleOk = async () => {
    const fieldsValue = await form.validateFields();
    handleChangePassword(fieldsValue);
    form.resetFields()
  }

  return (
    <Modal
      width={560}
      bodyStyle={modalBodyStyle}
      destroyOnClose
      title="修改密码"
      visible={visible}
      okText="修改"
      onOk={() => handleOk()}
      onCancel={()=>handleClose()}
      afterClose={()=>handleClose()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={initialValues}
      >
        <Form.Item label="userId" name="user_id" style={hiddenFormItemStyle} rules={[{ required: true}]}>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item label="新密码" name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="输入密码"/>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ChangePasswordForm;
