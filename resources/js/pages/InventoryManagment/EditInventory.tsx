import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { editInventoryitems, saveInventory } from '@/services/security-managment.service';
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
  Tabs,
  message
} from 'antd';
import dayjs from 'dayjs';
import useNotification from '@/hooks/useNotification';
import Loader from '@/components/ui/loader';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface InventoryType {
  id: number;
  name: string;
  track_size: boolean;
  size_range: string | null;
  standard_price: number;
}

interface InventoryItem {
  id: number;
  inventory_type_id: number;
  inventory_type: InventoryType;
  size: string | null;
  condition: 'new' | 'returned';
  quantity: number;
  purchase_price: string;
  purchase_date: string;
  last_restocked_at: string | null;
  is_available: boolean;
}

interface EditInventoryProps {
  item: InventoryItem;
  types: InventoryType[];
  handleBack: () => void;
  onSuccess?: () => void;
}

const EditInventory: React.FC<EditInventoryProps> = ({ item, types, handleBack, onSuccess }) => {
  const [form] = Form.useForm();
  const [restockForm] = Form.useForm();
  const [selectedType, setSelectedType] = useState<InventoryType | null>(item.inventory_type || null);

    const [loading, setLoading] = useState(false);
  
    const { notifySuccess, notifyError, contextHolder } = useNotification(); 
  
  const { data, setData, put, processing, errors } = useForm({
    inventory_type_id: item.inventory_type_id.toString(),
    size: item.size || '',
    condition: item.condition,
    quantity: item.quantity,
    purchase_price: item.purchase_price,
    purchase_date: item.purchase_date.split('T')[0],
    last_restocked_at: item.last_restocked_at?.split('T')[0]
  });

  const restockFormData = useForm({
    restock_quantity: 1,
    restock_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    setSelectedType(types.find(t => t.id === item.inventory_type_id) || null);
    form.setFieldsValue({
      ...data,
      purchase_date: dayjs(data.purchase_date),
      last_restocked_at: data.last_restocked_at ? dayjs(data.last_restocked_at) : null
    });
    restockForm.setFieldsValue({
      restock_quantity: 1,
      restock_date: dayjs()
    });
  }, [item, types]);

  const handleTypeChange = (value: string) => {
    const type = types.find((t: any) => t.id == value) || null;
    setSelectedType(type);
    setData('inventory_type_id', value);
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await editInventoryitems(item.id, {
        ...item,
        ...data
      });
      notifySuccess("SUCCESS",'Inventory item updated successfully');
      setTimeout(() => {
        onSuccess?.(); 
        handleBack();
      }, 1000);
    } catch (error) {
      console.error('Error updating inventory:', error);
      notifyError("ERROR",'Failed to update inventory item');
    }finally {
      setLoading(false);
    }
  };

  const handleRestockSubmit = async (values: any) => {
    try {
      setLoading(true);
      console.log('Restock values:', restockFormData.data);
      await saveInventory({
        ...item,
        last_restocked_at: restockFormData.data.restock_date,
        quantity: restockFormData.data.restock_quantity
      });
      notifySuccess("SUCCESS",'Inventory restocked successfully');
      setTimeout(() => {
        onSuccess?.(); 
        handleBack();
      }, 1000);
    } catch (error) {
      console.error('Error restocking inventory:', error);
      notifyError("ERROR",'Failed to restock inventory');
    }finally {
      setLoading(false);
    }
  };

  const generateSizes = (range: string | null) => {
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
            <Title level={2} style={{ marginBottom: '24px' }}>Inventory Item</Title>
            
            <Tabs defaultActiveKey="edit">
              <TabPane tab="Edit Item" key="edit">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  initialValues={{
                    ...data,
                    purchase_date: dayjs(data.purchase_date),
                    last_restocked_at: data.last_restocked_at ? dayjs(data.last_restocked_at) : null
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
                          disabled={processing}
                        >
                          {types.map((type) => (
                            <Option key={type.id} value={type.id.toString()}>
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
                          <Select placeholder="Select Size" disabled={processing}>
                            {generateSizes(selectedType.size_range).map((size) => (
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
                        label="Condition"
                        name="condition"
                        validateStatus={errors.condition ? 'error' : ''}
                        help={errors.condition}
                        rules={[{ required: true, message: 'Please select condition' }]}
                      >
                        <Select disabled={processing}>
                          <Option value="new">New</Option>
                          <Option value="returned">Returned</Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Current Quantity"
                        name="quantity"
                        validateStatus={errors.quantity ? 'error' : ''}
                        help={errors.quantity}
                        rules={[{ required: true, message: 'Please enter quantity' }]}
                      >
                        <Input 
                          type="number" 
                          min={0}
                          onChange={(e) => setData('quantity', parseInt(e.target.value) || 0)}
                          disabled={processing}
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
                          disabled={processing}
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
                          disabled={processing}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Last Restock Date"
                        name="last_restocked_at"
                        validateStatus={errors.last_restocked_at ? 'error' : ''}
                        help={errors.last_restocked_at}
                      >
                        <DatePicker 
                          style={{ width: '100%' }}
                          onChange={(date, dateString: any) => setData('last_restocked_at', dateString)}
                          disabled={processing}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item style={{ marginTop: '32px', textAlign: 'right' }}>
                    <Button 
                      style={{ marginRight: '16px' }}
                      onClick={handleBack}
                      disabled={processing}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="primary" 
                      htmlType="submit"
                      loading={processing}
                    >
                      Save Changes
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>

              <TabPane tab="Restock Item" key="restock">
                <Form
                  form={restockForm}
                  layout="vertical"
                  onFinish={handleRestockSubmit}
                  initialValues={{
                    restock_quantity: 1,
                    restock_date: dayjs()
                  }}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Current Quantity">
                        <Input 
                          value={item.quantity} 
                          readOnly 
                          disabled={restockFormData.processing}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Quantity to Add"
                        name="restock_quantity"
                        rules={[{ required: true, message: 'Please enter quantity to add' }]}
                      >
                        <Input 
                          type="number" 
                          min={1}
                          onChange={(e) => restockFormData.setData('restock_quantity', parseInt(e.target.value) || 1)}
                          disabled={restockFormData.processing}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Restock Date"
                        name="restock_date"
                        rules={[{ required: true, message: 'Please select restock date' }]}
                      >
                        <DatePicker 
                          style={{ width: '100%' }}
                          onChange={(date, dateString: any) => restockFormData.setData('restock_date', dateString)}
                          disabled={restockFormData.processing}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item style={{ marginTop: '32px', textAlign: 'right' }}>
                    <Button 
                      style={{ marginRight: '16px' }}
                      onClick={handleBack}
                      disabled={restockFormData.processing}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="primary" 
                      htmlType="submit"
                      loading={restockFormData.processing}
                      style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                    >
                      Restock Item
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EditInventory;