import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { saveInventory } from '@/services/security-managment.service';
import { 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Card, 
  Typography, 
  Row, 
  Col,
  message 
} from 'antd';
import dayjs from 'dayjs';
import Loader from '@/components/ui/loader';
import useNotification from '@/hooks/useNotification';

const { Title } = Typography;
const { Option } = Select;

const CreateInventory = ({ types, handleBack }: { types: any, handleBack: ()=> void}) => {
    const [selectedType, setSelectedType] = useState<any>(null);
    const [form] = Form.useForm();
    const { data, setData, post, processing, errors } = useForm({
        inventory_type_id: '',
        size: '',
        quantity: 1,
        purchase_price: '',
        purchase_date: new Date().toISOString().split('T')[0]
    });
  const [loading, setLoading] = useState(false);

  const { notifySuccess, notifyError, contextHolder } = useNotification();
  
    const handleTypeChange = (value: string) => {
        const type = types.find((t:any) => t.id == value);
        setSelectedType(type);
        setData({
            ...data,
            inventory_type_id: value,
            size: '',
            purchase_price: ''
        });
        form.setFieldsValue({
            size: '',
            purchase_price: ''
        });
    };

    const handleSubmit = async(values: any) => {
        try {
            setLoading(true);
            console.log(data);
            const result = await saveInventory(data);
            console.log(result);
            notifySuccess('SUCCESS', 'Inventory item saved successfully');
           setTimeout(() => {
                 handleBack();
           }, 1000);

        } catch (error) {
            notifyError('ERROR', 'Failed to save inventory item');
            console.error(error);
        }finally {
            setLoading(false);
        }
    };

    const generateSizes = (range: string) => {
        if (!range) return [];
        const [start, end] = range.split('-').map(Number);
        if (isNaN(start) || isNaN(end)) return [];
        const sizes = [];
        for (let i = start; i <= end; i++) {
            sizes.push(i.toString());
        }
        return sizes;
    };

    return (
        <div style={{ padding: '24px' }}>
              {contextHolder}
      {loading && <Loader/>}
            <Row justify="center">
                <Col xs={24} lg={18}>
                    <Card>
                        <Title level={2} style={{ marginBottom: '24px' }}>Add Inventory Item</Title>
                        
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{
                                ...data,
                                purchase_date: dayjs(data.purchase_date)
                            }}
                        >
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Item Type"
                                        name="inventory_type_id"
                                        validateStatus={errors.inventory_type_id ? 'error' : ''}
                                        help={errors.inventory_type_id}
                                        rules={[{ required: true, message: 'Please select item type' }]}
                                    >
                                        <Select
                                            placeholder="Select Type"
                                            onChange={handleTypeChange}
                                        >
                                            {types.map((type: any) => (
                                                <Option key={type.id} value={type.id}>
                                                    {type.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                {selectedType?.track_size && (
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Size"
                                            name="size"
                                            validateStatus={errors.size ? 'error' : ''}
                                            help={errors.size}
                                            rules={[{ required: true, message: 'Please select size' }]}
                                        >
                                            <Select placeholder="Select Size">
                                                {generateSizes(selectedType.size_range).map((size: any) => (
                                                    <Option key={size} value={size}>
                                                        {size}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                )}

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Quantity"
                                        name="quantity"
                                        validateStatus={errors.quantity ? 'error' : ''}
                                        help={errors.quantity}
                                        rules={[{ required: true, message: 'Please enter quantity' }]}
                                    >
                                        <Input 
                                            type="number" 
                                            min={1} 
                                            onChange={(e: any) => setData('quantity', e.target.value)}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Purchase Price"
                                        name="purchase_price"
                                        validateStatus={errors.purchase_price ? 'error' : ''}
                                        help={errors.purchase_price}
                                        rules={[{ required: true, message: 'Please enter purchase price' }]}
                                    >
                                        <Input 
                                            type="number" 
                                            step="0.01" 
                                            min={0} 
                                            onChange={(e) => setData('purchase_price', e.target.value)}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Purchase Date"
                                        name="purchase_date"
                                        validateStatus={errors.purchase_date ? 'error' : ''}
                                        help={errors.purchase_date}
                                        rules={[{ required: true, message: 'Please select purchase date' }]}
                                    >
                                        <DatePicker 
                                            style={{ width: '100%' }}
                                            onChange={(date, dateString: any) => setData('purchase_date', dateString)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item style={{ marginTop: '32px', textAlign: 'right' }}>
                                <Button 
                                    style={{ marginRight: '16px' }}
                                    onClick={handleBack}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="primary" 
                                    htmlType="submit"
                                    loading={processing}
                                >
                                    Save Item
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CreateInventory;