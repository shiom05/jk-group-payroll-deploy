import Loader from '@/components/ui/loader';
import useNotification from '@/hooks/useNotification';
import { saveLocation } from '@/services/location.service';
import { Button, Checkbox, Col, Form, Input, InputNumber, Row } from 'antd';
import { useState } from 'react';

const CreateLocation = ({ handleCancel }: { handleCancel: () => void }) => {
    const [form] = Form.useForm();

      const [loading, setLoading] = useState(false); 
    
      const { notifySuccess, notifyError, contextHolder } = useNotification();

    const handleSubmit = async(values: any) => {
        setLoading(true);
        try {
            const result = await saveLocation(values);
            if (result.data.success) {
                setTimeout(() => {
                    handleCancel();
                }, 1000);
            }
        } catch (error) {
            notifyError('Error', 'Failed to save location');
        } finally {
            setLoading(false);
            notifySuccess('Success', 'Location saved successfully');
            form.resetFields();
        }
      
    };

    return (
        <>
            <Form form={form} onFinish={handleSubmit} layout="vertical" className="max-w mb-10! space-y-4 rounded-lg bg-white p-6! py-10! shadow-lg">
                 {contextHolder}
      {loading && <Loader/>}
                <h2 className="mb-4 text-2xl font-semibold text-gray-700">Location Form</h2>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="locationName" label="Location Name" rules={[{ required: true, message: 'Please enter location name' }]}>
                            <Input placeholder="Location Name" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="locationType" label="Location Type" rules={[{ required: true, message: 'Please enter location type' }]}>
                            <Input placeholder="Location Type" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="isJkPropLocation" initialValue={false}  valuePropName="checked">
                            <Checkbox>JK Property Location</Checkbox>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Please enter address' }]}>
                    <Input.TextArea rows={3} placeholder="Full Address" />
                </Form.Item>

                <h3 className="mb-2 text-lg font-medium text-gray-700">Billing Rates from Customer(LKR)</h3>
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item name="billing_OIC_HourlyRate" label="OIC Shift Rate">
                            <InputNumber className="w-full" step={100} min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="billing_JSO_HourlyRate" label="JSO Shift Rate">
                            <InputNumber className="w-full" step={100} min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="billing_CSO_HourlyRate" label="CSO Shift Rate">
                            <InputNumber className="w-full" step={100} min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="billing_SSO_HourlyRate" label="SSO Shift Rate">
                            <InputNumber className="w-full" step={100} min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="billing_LSO_HourlyRate" label="LSO Shift Rate">
                            <InputNumber className="w-full" step={100} min={0} />
                        </Form.Item>
                    </Col>
                </Row>

                <h3 className="mb-2 text-lg font-medium text-gray-700">Paying Rates to Security (LKR)</h3>
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item name="paying_OIC_HourlyRate" label="OIC Shift Rate">
                            <InputNumber className="w-full" step={100} min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="paying_JSO_HourlyRate" label="JSO Shift Rate">
                            <InputNumber className="w-full" step={100} min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="paying_CSO_HourlyRate" label="CSO Shift Rate">
                            <InputNumber className="w-full" step={100} min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="paying_SSO_HourlyRate" label="SSO Shift Rate">
                            <InputNumber className="w-full" step={100} min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="paying_LSO_HourlyRate" label="LSO Shift Rate">
                            <InputNumber className="w-full" step={100} min={0} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <div className="flex flex-row gap-x-4">
                        <Button
                            type="default"
                            onClick={() => {
                                form.resetFields();
                                handleCancel();
                            }}
                            className="mt-4 w-1/4 bg-red-600 text-white hover:bg-red-700"
                        >
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" className="mt-4 w-1/4 bg-blue-600 text-white hover:bg-blue-700">
                            Save
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateLocation;
