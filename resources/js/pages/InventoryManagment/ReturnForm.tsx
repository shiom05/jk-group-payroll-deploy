import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
  Table, Tag, Select, Button, DatePicker, Form, InputNumber, Card, Input
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { UndoOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Security from '@/types/jk/security';
import { getAsset, returnAsset, returnInventory } from '@/services/security-managment.service';
import useNotification from '@/hooks/useNotification';
import Loader from '@/components/ui/loader';

// Interfaces
export interface InventoryType {
  id: number;
  name: string;
  code: string;
  track_size: boolean;
  size_range: string;
  standard_price: number;
}

export interface InventoryItem {
  id: number;
  inventory_type_id: number;
  inventory_type: InventoryType;
  size: string | null;
  condition: 'new' | 'returned';
  quantity: number;
  purchase_price: number;
  purchase_date: string;
  last_restocked_at: string | null;
  is_available: boolean;
}

interface AllocationItem {
  id: number;
  inventory_item_id: number;
  quantity: number;
  inventory_item: InventoryItem;
  removeQuantity: number;
}

interface ReturnFormProps {
  employees: Security[];
  onSuccess?: () => void;
  onCancel: () => void;
}

const ReturnForm: React.FC<ReturnFormProps> = ({
  employees,
  onSuccess,
  onCancel
}) => {
  const [selectedItems, setSelectedItems] = useState<AllocationItem[]>([]);
  const [selectedSecurityId, setSelectedSecurityId] = useState<number | null>(null);
  const [allocatedInventory, setAllocatedInventory] = useState<AllocationItem[]>([]);

  const [loading, setLoading] = useState(false);

  const { notifySuccess, notifyError, contextHolder } = useNotification();

  const { data, setData, post, processing } = useForm<any>({
    security_id: '',
    items: [] as AllocationItem[],
    transaction_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = async () => {
      const itemMap = data.items.map((itm: AllocationItem) => ({
          id: itm.inventory_item_id,
          quantity: itm.removeQuantity,
      }));

      const returndata = {
          ...data,
          items: itemMap,
      };

      const assetRemoveReq = {
          security_id: data.security_id,
          items: data.items.map((itm: any) => {
              return {
                  inventory_item_id: itm.inventory_item_id,
                  quantity: itm.removeQuantity,
              };
          }),
      };
      
      try {
        setLoading(true);
        const result = await returnInventory(returndata);
         if (result.data && result.data.transaction_id) {
          const res = await returnAsset(assetRemoveReq);
          notifySuccess('SUCCESS', 'Inventory returned successfully');
          setTimeout(() => {
            onSuccess?.();
            onCancel();
        }, 1000);
      }
      } catch (error) {
        console.error('Error during return inventory:', error);
        notifyError('ERROR', 'Failed to return inventory');
      }finally {
        setLoading(false);
      }
  };

  const fetchInventoryAllocationsforSecurityId = async () => {
    try {
    setLoading(true);
    const result = await getAsset(selectedSecurityId);
    if (result && result.data && result.data.data) {
      const list: AllocationItem[] = result.data.data.map((item: any) => ({
        ...item,
        inventory_item: item.inventory_item,
        removeQuantity: 1
      }));
      setAllocatedInventory(list);
    }
    } catch (error) {
       notifyError('ERROR', 'Failed to fetch allocated inventory'); 
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSecurityId) {
      fetchInventoryAllocationsforSecurityId();
    }
  }, [selectedSecurityId]);

  return (
      <Card
          title={
              <>
                  <UndoOutlined /> Return Inventory
              </>
          }
      >
        {contextHolder}
        {loading && <Loader/>}

          <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item label="Security Officer" required>
                  <Select
                      value={data.security_id}
                      onChange={(value) => {
                          setData('security_id', value);
                          setSelectedSecurityId(value);
                          setSelectedItems([]);
                          setAllocatedInventory([]);
                      }}
                      options={employees.map((e: Security) => ({
                          value: e.securityId,
                          label: e.securityName,
                      }))}
                      placeholder="Select security officer"
                  />
              </Form.Item>

              {selectedSecurityId && allocatedInventory.length > 0 && (
                  <>
                      <Form.Item label="Items to Return" required>
                          <Table
                              columns={[
                                  {
                                      title: 'Allocation ID #',
                                      render: (item: AllocationItem) => `#${item.id}`,
                                  },
                                  {
                                      title: 'Item',
                                      render: (item: AllocationItem) => item.inventory_item.inventory_type.name,
                                  },
                                  {
                                      title: 'Size',
                                      render: (item: AllocationItem) =>
                                          item.inventory_item.inventory_type.track_size ? item.inventory_item.size : 'N/A',
                                  },
                                  {
                                      title: 'Condition',
                                      render: (item: AllocationItem) => (
                                          <Tag color={item.inventory_item.condition === 'new' ? 'green' : 'orange'}>
                                              {item.inventory_item.condition.toUpperCase()}
                                          </Tag>
                                      ),
                                  },
                                  {
                                      title: 'Allocated Qty',
                                      dataIndex: 'quantity',
                                  },
                                  {
                                      title: 'Action',
                                      render: (item: AllocationItem) => {
                                          const isSelected = selectedItems.some((i) => i.id === item.id);
                                          return (
                                              <Button
                                                  type={isSelected ? 'default' : 'primary'}
                                                  icon={<UndoOutlined />}
                                                  onClick={() => {
                                                      const newItems = [...selectedItems];
                                                      const existingIndex = newItems.findIndex((i) => i.id === item.id);

                                                      if (existingIndex >= 0) {
                                                          newItems.splice(existingIndex, 1);
                                                      } else {
                                                          newItems.push({ ...item, removeQuantity: 1 });
                                                      }

                                                      setSelectedItems(newItems);
                                                      setData('items', newItems);
                                                  }}
                                              >
                                                  {isSelected ? 'Remove' : 'Select'}
                                              </Button>
                                          );
                                      },
                                  },
                              ]}
                              dataSource={allocatedInventory}
                              rowKey={(record) => `${record.id}-${record.inventory_item_id}`}
                              pagination={false}
                              size="small"
                          />
                      </Form.Item>

                      <Form.Item label="Return Date" required>
                          <DatePicker
                              value={data.transaction_date ? dayjs(data.transaction_date) : null}
                              onChange={(date) => setData('transaction_date', date?.format('YYYY-MM-DD') || '')}
                              style={{ width: '100%' }}
                          />
                      </Form.Item>

                      <Form.Item label="Notes">
                          <Input.TextArea
                              value={data.notes}
                              onChange={(e) => setData('notes', e.target.value)}
                              placeholder="Optional notes about this return"
                          />
                      </Form.Item>
                  </>
              )}

              {selectedItems.length > 0 && (
                  <Form.Item label="Items Selected">
                      <Table
                          columns={[
                              {
                                  title: 'Item',
                                  render: (_, record: AllocationItem) =>
                                      `${record.inventory_item.inventory_type.name}${record.inventory_item.size ? ` (${record.inventory_item.size})` : ''}`,
                              },
                              {
                                  title: 'Condition',
                                  render: (record: AllocationItem) => (
                                      <Tag color={record.inventory_item.condition === 'new' ? 'green' : 'orange'}>
                                          {record.inventory_item.condition.toUpperCase()}
                                      </Tag>
                                  ),
                              },
                              {
                                  title: 'Allocated Qty',
                                  dataIndex: 'quantity',
                              },
                              {
                                  title: 'Return Qty',
                                  render: (_, record: AllocationItem) => (
                                      <InputNumber
                                          min={1}
                                          max={record.quantity}
                                          value={record.removeQuantity}
                                          onChange={(value) => {
                                              const items = [...selectedItems];
                                              const index = items.findIndex((i) => i.id === record.id);
                                              if (index >= 0 && value) {
                                                  items[index].removeQuantity = Math.min(value, record.quantity);
                                                  setSelectedItems(items);
                                                  setData('items', items);
                                              }
                                          }}
                                      />
                                  ),
                              },
                          ]}
                          dataSource={selectedItems}
                          rowKey="id"
                          pagination={false}
                      />
                  </Form.Item>
              )}

              <div style={{ marginTop: 16, textAlign: 'right' }}>
                  <span style={{ marginRight: 16 }}>
                      <strong>Items Selected:</strong> {selectedItems.length}
                  </span>
                  <span>
                      <strong>Total Qty:</strong> {selectedItems.reduce((sum, item) => sum + item.removeQuantity, 0)}
                  </span>
              </div>

              <Form.Item style={{ marginTop: 24 }}>
                  <div className="flex flex-row gap-x-5">
                  <Button type="primary" htmlType="submit" loading={processing} disabled={!data.security_id || selectedItems.length === 0}>
                      Process Return
                  </Button>
                      <Button type="primary" htmlType="button" className="bg-red-600!" onClick={onCancel}>
                          Cancel
                      </Button>
                  </div>
              </Form.Item>
          </Form>
      </Card>
  );
};

export default ReturnForm;
