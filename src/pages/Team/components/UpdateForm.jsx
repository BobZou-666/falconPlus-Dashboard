import { Form, Input, Modal, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const modalBodyStyle = { padding: '32px 40px 48px' };

const hiddenFormItemStyle = { display: 'none' };

const UpdateTeamForm = props => {
  const {
    onSubmit: handleUpdate,
    onClose: handleClose,
    values: team,
    visible,
  } = props;

  const [form] = Form.useForm();

  let userIDs = [];
  team.users.forEach(v=>{
    userIDs.push(v.id)
  });

  const [formVals, setFormVals] = useState({
    team_id: team.team.id,
    name: team.team.name,
    resume: team.team.resume,
    users: userIDs,
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
      title="修改team"
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
        <Form.Item label="teamID" name="team_id" style={hiddenFormItemStyle} rules={[{ required: true}]}>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="简介"
          name="resume"
          rules={[{ required: true, message: '输入描述' }]}
        >
          <TextArea rows={2}/>
        </Form.Item>
        <Form.Item label="Users" name="users" style={hiddenFormItemStyle}>
          <Select mode="multiple" disabled={true}/>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateTeamForm;
