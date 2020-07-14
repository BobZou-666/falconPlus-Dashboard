import React, { useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const modalBodyStyle = { padding: '32px 40px 48px' };

const UpdateUserForm = props =>{
  const {
    onSubmit: handleUpdate,
    onClose: handleClose,
    values: user,
    visible,
  } = props;

  const [form] = Form.useForm();

  const [formVals, setFormVals] = useState({
    cnname: user.cnname,
    email: user.email,
    phone: user.phone,
    im: user.im,
    qq: user.qq,
  });

  const handleOk = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals(fieldsValue);
    handleUpdate(fieldsValue);
    form.resetFields()
  }

  return (
    <Modal
      width={560}
      bodyStyle={modalBodyStyle}
      destroyOnClose
      title="修改user"
      visible={visible}
      okText="修改"
      onOk={() => handleOk()}
      onCancel={()=>handleClose()}
      afterClose={()=>handleClose()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={formVals}
      >
        <Form.Item label="中文名" name="cnname" rules={[{ required: true}]}>
          <Input />
        </Form.Item>
        <Form.Item label="邮箱" name="email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="手机" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="社交账号" name="im">
          <Input />
        </Form.Item>
        <Form.Item label="QQ" name="qq">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateUserForm;
