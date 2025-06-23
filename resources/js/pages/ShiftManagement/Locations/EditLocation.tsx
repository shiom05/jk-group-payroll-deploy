import Loader from '@/components/ui/loader';
import useNotification from '@/hooks/useNotification';
import { editLocation } from '@/services/location.service';
import { Button, Checkbox, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect, useState } from 'react';

interface Locations {
    locationId: any,
    locationName: string;
    locationType: string;
    address: string;
    isJkPropLocation: boolean;

    billing_OIC_HourlyRate: number;
    billing_JSO_HourlyRate: number;
    billing_CSO_HourlyRate: number;
    billing_LSO_HourlyRate: number;
    billing_SSO_HourlyRate: number;

    paying_OIC_HourlyRate: number;
    paying_JSO_HourlyRate: number;
    paying_CSO_HourlyRate: number;
    paying_LSO_HourlyRate: number;
    paying_SSO_HourlyRate: number;
}

interface EditLocationProps {
    initialValues: Locations;
    onCancel: () => void;
}

const EditLocation = ({ initialValues, onCancel }: EditLocationProps) => {
      const [loading, setLoading] = useState(false);

  const { notifySuccess, notifyError, contextHolder } = useNotification();

    const handleSubmit = async(values: any) => {
        setLoading(true);
        try {
            const result = await editLocation( initialValues.locationId, values);
            if (result.status === 200) {
                 setTimeout(() => {
                    resetForm();
                }, 1000);
            }  
        } catch (error) {
            notifyError('Error', 'Failed to update location');
        } finally {
            setLoading(false);
            notifySuccess('Success', 'Location updated successfully');
        }
    };

    const resetForm = () => {
        form.resetFields();
        onCancel();
    };

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [initialValues, form]);

    return (
        <div className="mb-10">
             {contextHolder}
      {loading && <Loader/>}
            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                className="max-w mb-10! rounded-lg bg-white p-6! py-10! shadow-lg"
                initialValues={initialValues}
            >
                <h2 className="mb-4 text-2xl font-semibold text-gray-700">Edit Location</h2>

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
                        <Form.Item name="isJkPropLocation" valuePropName="checked">
                            <Checkbox>JK Property Location</Checkbox>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Please enter address' }]}>
                    <Input.TextArea rows={3} placeholder="Full Address" />
                </Form.Item>

                <h3 className="mb-2 text-lg font-medium text-gray-700">Billing Rates (LKR)</h3>
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item name="billing_OIC_HourlyRate" label="OIC Shift Rate">
                            <InputNumber className="w-full" min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="billing_JSO_HourlyRate" label="JSO Shift Rate">
                            <InputNumber className="w-full" min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="billing_CSO_HourlyRate" label="CSO Shift Rate">
                            <InputNumber className="w-full" min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="billing_SSO_HourlyRate" label="SSO Shift Rate">
                            <InputNumber className="w-full" min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="billing_LSO_HourlyRate" label="LSO Shift Rate">
                            <InputNumber className="w-full" min={0} />
                        </Form.Item>
                    </Col>
                </Row>

                <h3 className="mb-2 text-lg font-medium text-gray-700">Paying Rates (LKR)</h3>
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item name="paying_OIC_HourlyRate" label="OIC Shift Rate">
                            <InputNumber className="w-full" min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="paying_JSO_HourlyRate" label="JSO Shift Rate">
                            <InputNumber className="w-full" min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="paying_CSO_HourlyRate" label="CSO Shift Rate">
                            <InputNumber className="w-full" min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="paying_SSO_HourlyRate" label="SSO Shift Rate">
                            <InputNumber className="w-full" min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="paying_LSO_HourlyRate" label="LSO Shift Rate">
                            <InputNumber className="w-full" min={0} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <div className="flex flex-row gap-x-4">
                        <Button
                            onClick={onCancel}
                            className="mt-4 w-1/4 bg-red-600 text-white hover:bg-red-700"
                            // disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="mt-4 w-1/4 bg-blue-600 text-white hover:bg-blue-700"
                            // loading={isSubmitting}
                        >
                            Update
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditLocation;
