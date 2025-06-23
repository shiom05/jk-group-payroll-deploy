import Layout from '@/layouts/Layout';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import CreateInventory from './CreateInventory';
import { fetchAllStatusSecurities, fetchInventoryTypes, fetchSecurities, getInventoryitems } from '@/services/security-managment.service';
import { Table, Tag, Space, Button } from 'antd';
import { EyeOutlined, EditOutlined, AppstoreOutlined, PlusCircleFilled, SwapOutlined, RollbackOutlined, DeliveredProcedureOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import EditInventory from './EditInventory';
import AllocationForm from './AllocationForm';
import Security from '@/types/jk/security';
import ReturnForm from './ReturnForm';
import useNotification from '@/hooks/useNotification';
import Loader from '@/components/ui/loader';

interface InventoryItem {
    id: number;
    inventory_type_id: number;
    type: {
      name: string;
    };
    size: string | null;
    condition: 'new' | 'returned';
    quantity: number;
    purchase_price: string;
    purchase_date: string;
    last_restocked_at: string | null;
    is_available: boolean;
    created_at: string;
    updated_at: string;
    inventory_type: any;
  }

const InventoryManagement = () => {

    const [invnentoryType, setInventoryTypes] = useState<any[]>([])
    const [inventories, setInventories] = useState<any[]>([]);

    const [securities, setSecurities]= useState<Security[]>([]);
    const [securitiesToRetun, setSecuritiesToReturn]= useState<Security[]>([]);

    const [isCreatingNewinventory, setIsCreatingNewinventory] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

    const [allocateInventory, setAllocateInventory] = useState<boolean>(false);
    const [returnInventory, setReturnInventory] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const { notifySuccess, notifyError, contextHolder } = useNotification();

    const getInventoryTypes = async()=>{
      setLoading(true);
      try {
        const result = await fetchInventoryTypes();
        setInventoryTypes(result.data);
      } catch (error) {
        console.error('Error fetching inventory types:', error);
        notifyError('ERROR', 'Failed to fetch inventory types');
      } finally {
        setLoading(false);
      }
    }

    const getInventories = async()=>{
        setLoading(true);
        try {
            const result = await getInventoryitems();
            setInventories(result.data);
        } catch (error) {
            console.error('Error fetching inventories:', error);
            notifyError('ERROR', 'Failed to fetch inventories');
        } finally {
            setLoading(false);
        }
    }

    const getSecurities = async() =>{
        setLoading(true);
        try {
            const result = await fetchSecurities();
            setSecurities(result.data);
        } catch (error) {
            console.error('Error fetching securities:', error);
            notifyError('ERROR', 'Failed to fetch securities');
        } finally {
            setLoading(false);
        }
    }
    const getSecuritiesofAllStatus = async() =>{
        setLoading(true);
        try {
            const result = await fetchAllStatusSecurities();
            setSecuritiesToReturn(result.data);
        } catch (error) {
            console.error('Error fetching securities of all status:', error);
            notifyError('ERROR', 'Failed to fetch securities of all status');
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        getInventoryTypes();
        getInventories();
        getSecurities();
        getSecuritiesofAllStatus();
    }, [isCreatingNewinventory]);


    const columns: ColumnsType<InventoryItem> = [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: 80,
          sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Item Type',
            key: 'type_name',
            render: (_: any, record: InventoryItem) => (
              <>
                {record.inventory_type?.name}
                {record.size && <Tag style={{ marginLeft: 8 }}>Size: {record.size}</Tag>}
              </>
            ),
          },
        {
          title: 'Condition',
          dataIndex: 'condition',
          key: 'condition',
          render: (condition: 'new' | 'returned') => (
            <Tag color={condition === 'new' ? 'green' : 'orange'}>
              {condition.charAt(0).toUpperCase() + condition.slice(1)}
            </Tag>
          ),
          filters: [
            { text: 'New', value: 'new' },
            { text: 'Returned', value: 'returned' },
          ],
          onFilter: (value: any, record: InventoryItem) => 
            record.condition === value,
        },
        {
          title: 'Quantity',
          dataIndex: 'quantity',
          key: 'quantity',
          sorter: (a: InventoryItem, b: InventoryItem) => a.quantity - b.quantity,
        },
        {
          title: 'Purchase Price',
          dataIndex: 'purchase_price',
          key: 'purchase_price',
          render: (price: string) => `Rs ${parseFloat(price).toFixed(2)}`,
          sorter: (a: InventoryItem, b: InventoryItem) => 
            parseFloat(a.purchase_price) - parseFloat(b.purchase_price),
        },
        {
          title: 'Purchase Date',
          dataIndex: 'purchase_date',
          key: 'purchase_date',
          render: (date: string) => new Date(date).toLocaleDateString(),
          sorter: (a: InventoryItem, b: InventoryItem) => 
            new Date(a.purchase_date).getTime() - new Date(b.purchase_date).getTime(),
        },
        {
          title: 'Last Restocked',
          dataIndex: 'last_restocked_at',
          key: 'last_restocked_at',
          render: (date: string | null) => date ? new Date(date).toLocaleDateString() : 'Never',
          sorter: (a: InventoryItem, b: InventoryItem) => {
            const dateA = a.last_restocked_at ? new Date(a.last_restocked_at).getTime() : 0;
            const dateB = b.last_restocked_at ? new Date(b.last_restocked_at).getTime() : 0;
            return dateA - dateB;
          },
        },
        {
          title: 'Status',
          key: 'status',
          render: (_: any, record: InventoryItem) => (
            <Tag color={record.is_available ? 'green' : 'red'}>
              {record.is_available ? 'Available' : 'Unavailable'}
            </Tag>
          ),
          filters: [
            { text: 'Available', value: true },
            { text: 'Unavailable', value: false },
          ],
          onFilter: (value: any, record: InventoryItem) => 
            record.is_available === value,
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 120,
          render: (_: any, record: InventoryItem) => (
            <Space size="small">
              <Button 
                icon={<EyeOutlined />} 
                size="small"
                onClick={() => handleView(record.id)}
              />
              <Button 
                icon={<EditOutlined />} 
                size="small" 
                onClick={() => handleEdit(record)}
              />
            </Space>
          ),
        },
      ];

    const handleView = (id: any) => {
        // Handle view action
        console.log('View item:', id);
      };
    
      const handleEdit = (item: any) => {
        // Handle edit action
        setEditingItem(item);
        console.log('Edit item:', item);
      };

      const renderHeader = ()=>{
        if(isCreatingNewinventory){
          return "CREATE INVENTORY"
        }else if(editingItem){
            return "EDIT INVENTORY"
        }else if(allocateInventory){
          return "ALLOCATE INVENTORY"
         }else if(returnInventory){
          return "RETURN INVENTORY"
         }else{
          return "INVENTORY  MANAGEMENT" 
         }
      }
      
    return (
        <Layout>
            {contextHolder}
                {loading && <Loader/>}
            <div className="p-10 pt-10">
                <h1 className="mb-4 text-3xl font-bold text-gray-800"><AppstoreOutlined /> {renderHeader()}</h1>
             
             <div className='flex flex-row gap-x-10 mb-10 mt-10'>
             <Button onClick={() => setIsCreatingNewinventory(true)} icon={<PlusCircleFilled />} type={isCreatingNewinventory?'primary':'dashed'} size="large"  disabled={allocateInventory || editingItem!==null || returnInventory} >
                Add New Inventory
                </Button>
                <Button onClick={() => setAllocateInventory(true)} disabled={isCreatingNewinventory || editingItem!==null || returnInventory}  icon={<DeliveredProcedureOutlined />} type={allocateInventory?'primary':'dashed'} size="large" >
                  Allocate Inventory
                </Button>
                <Button onClick={() => setReturnInventory(true)} disabled={isCreatingNewinventory || editingItem!==null || allocateInventory}  icon={<RollbackOutlined />}  type={returnInventory?'primary':'dashed'}  size="large" >
                  Return Inventory
                </Button>
             </div>

             

                {!isCreatingNewinventory && !editingItem && !allocateInventory && !returnInventory && (
                    <>
                        <Table
                            columns={columns}
                            dataSource={inventories}
                            rowKey="id"
                            loading={false}
                            bordered
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                pageSizeOptions: ['10', '20', '50', '100'],
                            }}
                            scroll={{ x: 'max-content' }}
                        />
                    </>
                )}
            </div>

            {isCreatingNewinventory && <CreateInventory types={invnentoryType} handleBack={() => setIsCreatingNewinventory(false)} />}

            {editingItem && (
                <EditInventory
                    item={editingItem}
                    types={invnentoryType}
                    handleBack={() => setEditingItem(null)}
                    onSuccess={getInventories} // Refresh inventory after edit
                />
            )}

            {allocateInventory && !editingItem && !isCreatingNewinventory && !returnInventory && (
                <AllocationForm onCancel={()=>setAllocateInventory(false)} employees={securities} inventoryItems={inventories} onSuccess={getInventories} />
            )}

            {returnInventory && !editingItem && !isCreatingNewinventory && !allocateInventory && <ReturnForm onCancel={()=>setReturnInventory(false)} employees={securitiesToRetun} onSuccess={getInventories} />}
        </Layout>
    );
};

export default InventoryManagement;
