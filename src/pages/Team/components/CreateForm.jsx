import { Form, Input, Modal, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const modalBodyStyle = { padding: '32px 40px 48px' };

const CreateTeamForm = props => {
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
      title="新建team"
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
        <Form.Item label="Name" name="team_name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="简介"
          name="resume"
          rules={[{ required: true, message: '输入简介' }]}
        >
          <TextArea rows={3}/>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateTeamForm;
