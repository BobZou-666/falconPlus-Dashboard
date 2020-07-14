import React, { useState } from 'react';
import { Form, Modal, Input, InputNumber, Radio } from 'antd';
import TextArea from 'antd/es/input/TextArea';

const UpdateForm = props => {
  const [formVals, setFormVals] = useState({
    id: props.values.id,
    name: props.values.name,
    obj_type: props.values.obj_type,
    obj: props.values.obj,
    tags: props.values.tags,
    step: props.values.step,
    mock: props.values.mock,
    metric: props.values.metric,
    dstype: props.values.dstype,
  });
  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
  } = props;

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const handleOk = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals(fieldsValue);
    handleUpdate(fieldsValue);
    form.resetFields()
  };

  return (
    <Modal
      width={560}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      destroyOnClose
      title="修改nodata"
      visible={updateModalVisible}
      okText="修改"
      onOk={() => handleOk()}
      onCancel={() => handleUpdateModalVisible(false)}
      afterClose={() => form.resetFields()}
    >
      <Form
        {...layout}
        form={form}
        initialValues={formVals}
      >
        <Form.Item label="Id" name="id" style={{ display: 'none' }} rules={[{ required: true}]}>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item
          label="对象类型"
          name="obj_type"
          rules={[{ required: true, message: '请选择对象类型!' }]}
        >
          <Radio.Group value="group" buttonStyle="solid" >
            <Radio.Button value="group">机器分组</Radio.Button>
            <Radio.Button value="host">机器名</Radio.Button>
            <Radio.Button value="other">其它</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="对象列表"
          name="obj"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <TextArea rows={3}/>
        </Form.Item>
        <Form.Item
          label="Metric"
          name="metric"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="tags"
          name="tags"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Type"
          name="dstype"
          rules={[{ required: true, message: 'Please choose your ds type!' }]}
        >
          <Radio.Group value="GAUGE" buttonStyle="solid" >
            <Radio.Button value="GAUGE">GAUGE</Radio.Button>
            <Radio.Button value="COUNTER" disabled>COUNTER(暂不支持)</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="周期"
          name="step"
          rules={[{ required: true, message: 'Please input your step!' }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="补发数据"
          name="mock"
          rules={[{ required: true, message: 'Please input your mock!' }]}
        >
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateForm;
