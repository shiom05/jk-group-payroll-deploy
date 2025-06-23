import { useEffect, useState } from 'react';
import { Card, Button, Input, Select, Tabs } from 'antd';
import type { SelectProps } from 'antd';
import Layout from '@/layouts/Layout';
import ManageLocations from './Locations/ManageLocations';
import AssignSecurity from './AssignSecurity';
import Location from '@/types/jk/location';
import { getLocation } from '@/services/location.service';
import Security from '@/types/jk/security';
import axios from 'axios';
import SecurityShiftLogManager from './LogShift/logshift';


import {
  ScheduleOutlined
} from '@ant-design/icons';
import useNotification from '@/hooks/useNotification';
import Loader from '@/components/ui/loader';

const { Option } = Select;
const { TabPane } = Tabs;

export default function ShiftManagement() {
  const [view, setView] = useState('locations');

  const locationTypes = ['Warehouse', 'Shop', 'House', 'Land'];
  const roleTypes = ['OIC', 'Sargent', 'Costapal'];

  const [locations, setLocations] = useState<Location[]>([]);
  const [securityList, setSecurityList]= useState<Security[]>([]);

  const [loading, setLoading] = useState(false);

  const { notifySuccess, notifyError, contextHolder } = useNotification();

  const fetchLocations = async() => {
    setLoading(true);
     try {
       const result = await getLocation();
       setLocations(result.data);
    } catch (error) {
      notifyError('ERROR', 'Failed to fetch locations');
    }finally{
      setLoading(false);
    }
  }

  const fetchSecurities = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/securities');
      setSecurityList(response.data);
    } catch (error) {
      notifyError('ERROR', 'Failed to fetch securities');
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchSecurities();
  }, []);

  return (
    <Layout>
      {contextHolder}
      {loading && <Loader/>}

      <div style={{ padding: 24 }}>
        <h1 style={{ marginBottom: 24, fontSize: '1.5rem', fontWeight: 'bold' }}>
         <ScheduleOutlined /> Shift Management
        </h1>

        <Tabs
          activeKey={view}
          onChange={setView}
          tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane tab="Manage Locations" key="locations" />
          <TabPane tab="Assign Securities" key="assignments" />
          <TabPane tab="Log Shifts" key="logs" />
        </Tabs>

        <Card>
          {view === 'locations' && <ManageLocations />}
          {view === 'assignments' && (
            <AssignSecurity securities={securityList} locations={locations} />
          )}
          {view === 'logs' && <SecurityShiftLogManager />}
        </Card>
      </div>
    </Layout>
  );
}